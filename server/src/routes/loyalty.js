import express from 'express';
import { authenticate } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Loyalty tier configuration
const LOYALTY_TIERS = {
  bronze: { min_points: 0, multiplier: 1.0, benefits: ['5% off orders', 'Birthday bonus'] },
  silver: { min_points: 500, multiplier: 1.25, benefits: ['10% off orders', 'Free shipping on orders over R300', 'Birthday bonus'] },
  gold: { min_points: 1000, multiplier: 1.5, benefits: ['15% off orders', 'Free shipping', 'Birthday bonus', 'Early access to sales'] },
  platinum: { min_points: 2500, multiplier: 2.0, benefits: ['20% off orders', 'Free express shipping', 'Birthday bonus', 'Early access', 'Exclusive products'] }
};

// Get user's loyalty status
router.get('/status', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const userId = req.user.id;

    // Get user's points balance
    const pointsQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'earned' THEN points ELSE -points END), 0) as current_points,
        COALESCE(SUM(CASE WHEN type = 'earned' THEN points ELSE 0 END), 0) as lifetime_points,
        COUNT(CASE WHEN type = 'earned' THEN 1 END) as total_transactions
      FROM loyalty_points
      WHERE user_id = $1
    `;

    const pointsResult = await client.query(pointsQuery, [userId]);
    const { current_points, lifetime_points, total_transactions } = pointsResult.rows[0];

    // Determine current tier
    let currentTier = 'bronze';
    let nextTier = 'silver';
    let pointsToNextTier = LOYALTY_TIERS.silver.min_points;

    for (const [tier, config] of Object.entries(LOYALTY_TIERS)) {
      if (lifetime_points >= config.min_points) {
        currentTier = tier;
      }
    }

    // Find next tier
    const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tierOrder.indexOf(currentTier);
    if (currentIndex < tierOrder.length - 1) {
      nextTier = tierOrder[currentIndex + 1];
      pointsToNextTier = LOYALTY_TIERS[nextTier].min_points - lifetime_points;
    } else {
      nextTier = null;
      pointsToNextTier = 0;
    }

    // Get expiring points
    const expiringQuery = `
      SELECT 
        SUM(points - COALESCE(redeemed_points, 0)) as expiring_points,
        MIN(expires_at) as earliest_expiry
      FROM loyalty_points
      WHERE user_id = $1
      AND type = 'earned'
      AND expires_at > NOW()
      AND expires_at <= NOW() + INTERVAL '30 days'
      AND points > COALESCE(redeemed_points, 0)
    `;

    const expiringResult = await client.query(expiringQuery, [userId]);
    const { expiring_points, earliest_expiry } = expiringResult.rows[0];

    // Get recent activity
    const activityQuery = `
      SELECT 
        id,
        type,
        points,
        description,
        created_at
      FROM loyalty_points
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const activityResult = await client.query(activityQuery, [userId]);

    res.json({
      current_points: parseInt(current_points),
      lifetime_points: parseInt(lifetime_points),
      current_tier: currentTier,
      next_tier: nextTier,
      points_to_next_tier: Math.max(0, pointsToNextTier),
      tier_benefits: LOYALTY_TIERS[currentTier].benefits,
      points_multiplier: LOYALTY_TIERS[currentTier].multiplier,
      expiring_points: parseInt(expiring_points || 0),
      expiry_date: earliest_expiry,
      recent_activity: activityResult.rows
    });
  } catch (error) {
    console.error('Error getting loyalty status:', error);
    res.status(500).json({ error: 'Failed to get loyalty status' });
  } finally {
    client.release();
  }
});

// Earn points from purchase
router.post('/earn', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { order_id, amount } = req.body;
    const userId = req.user.id;

    // Check if points already earned for this order
    const existingPoints = await client.query(
      'SELECT id FROM loyalty_points WHERE user_id = $1 AND order_id = $2',
      [userId, order_id]
    );

    if (existingPoints.rows.length > 0) {
      throw new Error('Points already earned for this order');
    }

    // Get user's current tier for multiplier
    const tierQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'earned' THEN points ELSE 0 END), 0) as lifetime_points
      FROM loyalty_points
      WHERE user_id = $1
    `;

    const tierResult = await client.query(tierQuery, [userId]);
    const lifetimePoints = tierResult.rows[0].lifetime_points;

    let multiplier = 1.0;
    for (const [tier, config] of Object.entries(LOYALTY_TIERS)) {
      if (lifetimePoints >= config.min_points) {
        multiplier = config.multiplier;
      }
    }

    // Calculate points (R1 = 1 point, with multiplier)
    const basePoints = Math.floor(amount);
    const earnedPoints = Math.floor(basePoints * multiplier);
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year expiry

    // Insert points record
    const pointsResult = await client.query(`
      INSERT INTO loyalty_points (
        user_id, type, points, description, order_id, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      userId,
      'earned',
      earnedPoints,
      `Purchase order #${order_id}`,
      order_id,
      expiresAt
    ]);

    await client.query('COMMIT');

    res.json({
      success: true,
      points_earned: earnedPoints,
      base_points: basePoints,
      multiplier: multiplier,
      expires_at: expiresAt
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error earning points:', error);
    res.status(500).json({ error: error.message || 'Failed to earn points' });
  } finally {
    client.release();
  }
});

// Get available rewards
router.get('/rewards', async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT 
        r.*,
        rc.name as category_name
      FROM loyalty_rewards r
      JOIN loyalty_reward_categories rc ON r.category_id = rc.id
      WHERE r.active = true
      AND (r.stock IS NULL OR r.stock > 0)
    `;

    const params = [];
    if (category) {
      query += ' AND rc.slug = $1';
      params.push(category);
    }

    query += ' ORDER BY r.points_required ASC';

    const result = await pool.query(query, params);

    res.json({
      rewards: result.rows
    });
  } catch (error) {
    console.error('Error getting rewards:', error);
    res.status(500).json({ error: 'Failed to get rewards' });
  }
});

// Redeem points for reward
router.post('/redeem', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { reward_id } = req.body;
    const userId = req.user.id;

    // Get reward details
    const rewardQuery = `
      SELECT * FROM loyalty_rewards 
      WHERE id = $1 AND active = true
      AND (stock IS NULL OR stock > 0)
    `;

    const rewardResult = await client.query(rewardQuery, [reward_id]);
    
    if (rewardResult.rows.length === 0) {
      throw new Error('Reward not available');
    }

    const reward = rewardResult.rows[0];

    // Check user's points balance
    const balanceQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'earned' THEN points ELSE -points END), 0) as current_points
      FROM loyalty_points
      WHERE user_id = $1
    `;

    const balanceResult = await client.query(balanceQuery, [userId]);
    const currentPoints = balanceResult.rows[0].current_points;

    if (currentPoints < reward.points_required) {
      throw new Error('Insufficient points');
    }

    // Create redemption record
    const redemptionResult = await client.query(`
      INSERT INTO loyalty_redemptions (
        user_id, reward_id, points_spent, status
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      userId,
      reward_id,
      reward.points_required,
      'pending'
    ]);

    const redemptionId = redemptionResult.rows[0].id;

    // Deduct points
    await client.query(`
      INSERT INTO loyalty_points (
        user_id, type, points, description, redemption_id
      ) VALUES ($1, $2, $3, $4, $5)
    `, [
      userId,
      'redeemed',
      reward.points_required,
      `Redeemed: ${reward.name}`,
      redemptionId
    ]);

    // Update reward stock if applicable
    if (reward.stock !== null) {
      await client.query(
        'UPDATE loyalty_rewards SET stock = stock - 1 WHERE id = $1',
        [reward_id]
      );
    }

    // Generate reward code if it's a discount
    let rewardCode = null;
    if (reward.type === 'discount') {
      rewardCode = generateRewardCode();
      
      await client.query(`
        INSERT INTO promo_codes (
          code, discount_type, discount_value, 
          description, usage_limit, expires_at, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        rewardCode,
        reward.discount_type,
        reward.discount_value,
        reward.name,
        1,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        userId
      ]);

      // Update redemption with code
      await client.query(
        'UPDATE loyalty_redemptions SET reward_code = $1, status = $2 WHERE id = $3',
        ['completed', rewardCode, redemptionId]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      redemption_id: redemptionId,
      reward: reward,
      reward_code: rewardCode,
      remaining_points: currentPoints - reward.points_required
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error redeeming reward:', error);
    res.status(500).json({ error: error.message || 'Failed to redeem reward' });
  } finally {
    client.release();
  }
});

// Get user's redemption history
router.get('/redemptions', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        r.*,
        lr.name as reward_name,
        lr.description as reward_description,
        lr.type as reward_type
      FROM loyalty_redemptions r
      JOIN loyalty_rewards lr ON r.reward_id = lr.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM loyalty_redemptions
      WHERE user_id = $1
    `;

    const countResult = await pool.query(countQuery, [userId]);
    const total = countResult.rows[0].total;

    res.json({
      redemptions: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting redemptions:', error);
    res.status(500).json({ error: 'Failed to get redemptions' });
  }
});

// Award bonus points
router.post('/bonus', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { reason, points, user_id } = req.body;
    const targetUserId = user_id || req.user.id;

    // Check if admin for awarding to other users
    if (user_id && user_id !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Unauthorized to award points to other users');
    }

    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const result = await client.query(`
      INSERT INTO loyalty_points (
        user_id, type, points, description, expires_at
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      targetUserId,
      'earned',
      points,
      reason || 'Bonus points',
      expiresAt
    ]);

    await client.query('COMMIT');

    res.json({
      success: true,
      points_awarded: points,
      record: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error awarding bonus points:', error);
    res.status(500).json({ error: error.message || 'Failed to award bonus points' });
  } finally {
    client.release();
  }
});

// Transfer points between users
router.post('/transfer', authenticate, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { recipient_email, points, message } = req.body;
    const senderId = req.user.id;

    // Get recipient user
    const recipientQuery = `
      SELECT id, first_name, last_name 
      FROM users 
      WHERE email = $1
    `;

    const recipientResult = await client.query(recipientQuery, [recipient_email]);
    
    if (recipientResult.rows.length === 0) {
      throw new Error('Recipient not found');
    }

    const recipient = recipientResult.rows[0];

    if (recipient.id === senderId) {
      throw new Error('Cannot transfer points to yourself');
    }

    // Check sender's balance
    const balanceQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'earned' THEN points ELSE -points END), 0) as current_points
      FROM loyalty_points
      WHERE user_id = $1
    `;

    const balanceResult = await client.query(balanceQuery, [senderId]);
    const currentPoints = balanceResult.rows[0].current_points;

    if (currentPoints < points) {
      throw new Error('Insufficient points');
    }

    // Deduct from sender
    await client.query(`
      INSERT INTO loyalty_points (
        user_id, type, points, description
      ) VALUES ($1, $2, $3, $4)
    `, [
      senderId,
      'transferred',
      points,
      `Transferred to ${recipient.first_name} ${recipient.last_name}`
    ]);

    // Add to recipient
    await client.query(`
      INSERT INTO loyalty_points (
        user_id, type, points, description, expires_at
      ) VALUES ($1, $2, $3, $4, $5)
    `, [
      recipient.id,
      'earned',
      points,
      `Received from ${req.user.first_name} ${req.user.last_name}${message ? ': ' + message : ''}`,
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    ]);

    // Record transfer
    await client.query(`
      INSERT INTO loyalty_transfers (
        sender_id, recipient_id, points, message
      ) VALUES ($1, $2, $3, $4)
    `, [senderId, recipient.id, points, message]);

    await client.query('COMMIT');

    res.json({
      success: true,
      points_transferred: points,
      recipient: {
        id: recipient.id,
        name: `${recipient.first_name} ${recipient.last_name}`
      },
      remaining_points: currentPoints - points
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error transferring points:', error);
    res.status(500).json({ error: error.message || 'Failed to transfer points' });
  } finally {
    client.release();
  }
});

// Get tier benefits
router.get('/tiers', (req, res) => {
  const tiers = Object.entries(LOYALTY_TIERS).map(([name, config]) => ({
    name,
    min_points: config.min_points,
    multiplier: config.multiplier,
    benefits: config.benefits
  }));

  res.json({ tiers });
});

// Helper function to generate reward code
function generateRewardCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'REWARD-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default router;
