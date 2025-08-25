import express from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/reviews/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      sort = 'helpful', 
      rating,
      verified_only 
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build query conditions
    let conditions = ['r.product_id = $1'];
    let params = [productId];
    let paramCount = 1;

    if (rating) {
      paramCount++;
      conditions.push(`r.rating = $${paramCount}`);
      params.push(parseInt(rating));
    }

    if (verified_only === 'true') {
      conditions.push('r.verified_purchase = true');
    }

    // Determine sort order
    let orderBy = 'r.helpful_count DESC';
    switch (sort) {
      case 'newest':
        orderBy = 'r.created_at DESC';
        break;
      case 'oldest':
        orderBy = 'r.created_at ASC';
        break;
      case 'highest':
        orderBy = 'r.rating DESC, r.created_at DESC';
        break;
      case 'lowest':
        orderBy = 'r.rating ASC, r.created_at DESC';
        break;
    }

    // Get reviews with user information
    const reviewsQuery = `
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.avatar,
        COALESCE(ri.images, '[]'::json) as images,
        (
          SELECT COUNT(*) > 0 
          FROM review_votes rv 
          WHERE rv.review_id = r.id AND rv.user_id = $${paramCount + 1}
        ) as user_voted
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT json_agg(json_build_object('id', id, 'url', image_url)) as images
        FROM review_images
        WHERE review_id = r.id
      ) ri ON true
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT $${paramCount + 2} OFFSET $${paramCount + 3}
    `;

    params.push(req.user?.id || null, limit, offset);

    const reviewsResult = await pool.query(reviewsQuery, params);

    // Get total count and statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
        COUNT(CASE WHEN verified_purchase = true THEN 1 END) as verified_count
      FROM reviews
      WHERE product_id = $1
    `;

    const statsResult = await pool.query(statsQuery, [productId]);
    const stats = statsResult.rows[0];

    res.json({
      reviews: reviewsResult.rows,
      stats: {
        total: parseInt(stats.total),
        average: parseFloat(stats.average_rating || 0).toFixed(1),
        distribution: {
          5: parseInt(stats.five_star),
          4: parseInt(stats.four_star),
          3: parseInt(stats.three_star),
          2: parseInt(stats.two_star),
          1: parseInt(stats.one_star)
        },
        verified_count: parseInt(stats.verified_count)
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(stats.total),
        pages: Math.ceil(stats.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Submit a review
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      product_id,
      rating,
      title,
      comment,
      pros,
      cons,
      would_recommend
    } = req.body;

    // Check if user has purchased this product
    const purchaseCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1 
      AND oi.product_id = $2
      AND o.status = 'delivered'
    `, [req.user.id, product_id]);

    const verifiedPurchase = purchaseCheck.rows[0].count > 0;

    // Check if user already reviewed this product
    const existingReview = await client.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existingReview.rows.length > 0) {
      throw new Error('You have already reviewed this product');
    }

    // Insert review
    const reviewResult = await client.query(`
      INSERT INTO reviews (
        user_id, product_id, rating, title, comment, 
        pros, cons, would_recommend, verified_purchase
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      req.user.id,
      product_id,
      rating,
      title,
      comment,
      JSON.stringify(pros || []),
      JSON.stringify(cons || []),
      would_recommend,
      verifiedPurchase
    ]);

    const reviewId = reviewResult.rows[0].id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await client.query(
          'INSERT INTO review_images (review_id, image_url) VALUES ($1, $2)',
          [reviewId, `/uploads/reviews/${file.filename}`]
        );
      }
    }

    // Update product rating
    await client.query(`
      UPDATE products 
      SET 
        rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1)
      WHERE id = $1
    `, [product_id]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      review: reviewResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting review:', error);
    res.status(500).json({ error: error.message || 'Failed to submit review' });
  } finally {
    client.release();
  }
});

// Update a review
router.put('/:reviewId', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { reviewId } = req.params;
    const { rating, title, comment, pros, cons, would_recommend } = req.body;

    // Check if review belongs to user
    const reviewCheck = await client.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [reviewId, req.user.id]
    );

    if (reviewCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to edit this review' });
    }

    // Update review
    const result = await client.query(`
      UPDATE reviews 
      SET 
        rating = $1,
        title = $2,
        comment = $3,
        pros = $4,
        cons = $5,
        would_recommend = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [
      rating,
      title,
      comment,
      JSON.stringify(pros || []),
      JSON.stringify(cons || []),
      would_recommend,
      reviewId
    ]);

    // Update product rating
    const productId = reviewCheck.rows[0].product_id;
    await client.query(`
      UPDATE products 
      SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1)
      WHERE id = $1
    `, [productId]);

    await client.query('COMMIT');

    res.json({
      success: true,
      review: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  } finally {
    client.release();
  }
});

// Delete a review
router.delete('/:reviewId', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { reviewId } = req.params;

    // Check if review belongs to user or user is admin
    const reviewCheck = await client.query(
      'SELECT * FROM reviews WHERE id = $1',
      [reviewId]
    );

    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (reviewCheck.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this review' });
    }

    const productId = reviewCheck.rows[0].product_id;

    // Delete review (cascade will handle images and votes)
    await client.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    // Update product rating
    await client.query(`
      UPDATE products 
      SET 
        rating = (SELECT AVG(rating) FROM reviews WHERE product_id = $1),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1)
      WHERE id = $1
    `, [productId]);

    await client.query('COMMIT');

    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  } finally {
    client.release();
  }
});

// Vote on review helpfulness
router.post('/:reviewId/vote', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { reviewId } = req.params;
    const { helpful } = req.body;

    // Check if user already voted
    const existingVote = await client.query(
      'SELECT * FROM review_votes WHERE review_id = $1 AND user_id = $2',
      [reviewId, req.user.id]
    );

    if (existingVote.rows.length > 0) {
      // Update existing vote
      await client.query(
        'UPDATE review_votes SET is_helpful = $1 WHERE review_id = $2 AND user_id = $3',
        [helpful, reviewId, req.user.id]
      );
    } else {
      // Create new vote
      await client.query(
        'INSERT INTO review_votes (review_id, user_id, is_helpful) VALUES ($1, $2, $3)',
        [reviewId, req.user.id, helpful]
      );
    }

    // Update review helpful/unhelpful counts
    await client.query(`
      UPDATE reviews 
      SET 
        helpful_count = (
          SELECT COUNT(*) FROM review_votes 
          WHERE review_id = $1 AND is_helpful = true
        ),
        unhelpful_count = (
          SELECT COUNT(*) FROM review_votes 
          WHERE review_id = $1 AND is_helpful = false
        )
      WHERE id = $1
    `, [reviewId]);

    await client.query('COMMIT');

    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error voting on review:', error);
    res.status(500).json({ error: 'Failed to vote on review' });
  } finally {
    client.release();
  }
});

// Report a review
router.post('/:reviewId/report', authenticate, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason, details } = req.body;

    await pool.query(`
      INSERT INTO review_reports (review_id, user_id, reason, details)
      VALUES ($1, $2, $3, $4)
    `, [reviewId, req.user.id, reason, details]);

    res.json({ success: true, message: 'Review reported successfully' });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ error: 'Failed to report review' });
  }
});

export default router;
