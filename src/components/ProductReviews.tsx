import React, { useState, useEffect } from 'react';
import { 
  Star, ThumbsUp, ThumbsDown, Camera, Check, 
  AlertCircle, Filter, ChevronDown, User, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  userVote?: 'helpful' | 'not-helpful' | null;
  createdAt: string;
  productVariant?: string;
  recommendProduct: boolean;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  recommendationRate: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedPurchases: number;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

// Star Rating Component
const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          onClick={() => !readonly && onRatingChange?.(star)}
        >
          <Star
            className={cn(
              sizeClasses[size],
              (hoverRating || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

// Review Stats Component
const ReviewStatsCard: React.FC<{ stats: ReviewStats }> = ({ stats }) => {
  const maxCount = Math.max(...Object.values(stats.ratingDistribution));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{stats.averageRating.toFixed(1)}</div>
          <StarRating rating={stats.averageRating} readonly size="lg" />
          <p className="text-sm text-muted-foreground mt-2">
            Based on {stats.totalReviews} reviews
          </p>
        </div>

        {/* Recommendation Rate */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">
                {stats.recommendationRate}% Recommend
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {stats.verifiedPurchases} Verified
            </Badge>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
            const percentage = stats.totalReviews > 0 
              ? (count / stats.totalReviews) * 100 
              : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <button className="flex items-center gap-1 min-w-[60px] hover:text-primary transition-colors">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 fill-current" />
                </button>
                <div className="flex-1">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                </div>
                <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Write Review Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              Write a Review
            </Button>
          </DialogTrigger>
          <WriteReviewDialog productId="" productName="" />
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Write Review Dialog
const WriteReviewDialog: React.FC<{ productId: string; productName: string }> = ({ 
  productId, 
  productName 
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const handleSubmit = async () => {
    if (rating === 0 || !title || !comment) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    const reviewData = {
      productId,
      rating,
      title,
      comment,
      pros: pros.split(',').map(p => p.trim()).filter(Boolean),
      cons: cons.split(',').map(c => c.trim()).filter(Boolean),
      recommendProduct: recommend,
      images: [] // Handle image upload separately
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        // Handle success
        window.location.reload();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogDescription>
          Share your experience with {productName}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Rating */}
        <div>
          <Label>Overall Rating *</Label>
          <div className="mt-2">
            <StarRating 
              rating={rating} 
              onRatingChange={setRating}
              size="lg"
            />
          </div>
        </div>

        {/* Review Title */}
        <div>
          <Label htmlFor="review-title">Review Title *</Label>
          <Input
            id="review-title"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Review Comment */}
        <div>
          <Label htmlFor="review-comment">Your Review *</Label>
          <Textarea
            id="review-comment"
            placeholder="Tell us about your experience with this product"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2 min-h-[120px]"
          />
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pros">Pros (comma separated)</Label>
            <Input
              id="pros"
              placeholder="e.g., Great quality, Fast shipping"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="cons">Cons (comma separated)</Label>
            <Input
              id="cons"
              placeholder="e.g., Expensive, Large pills"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Label className="font-medium">Would you recommend this product?</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={recommend ? "default" : "outline"}
              size="sm"
              onClick={() => setRecommend(true)}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Yes
            </Button>
            <Button
              type="button"
              variant={!recommend ? "default" : "outline"}
              size="sm"
              onClick={() => setRecommend(false)}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              No
            </Button>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <Label>Add Photos (Optional)</Label>
          <div className="mt-2 space-y-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Label
              htmlFor="image-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
            >
              <Camera className="w-5 h-5 mr-2" />
              Upload Images (Max 5)
            </Label>
            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Reset form
            setRating(0);
            setTitle('');
            setComment('');
            setPros('');
            setCons('');
            setImages([]);
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || rating === 0 || !title || !comment}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Individual Review Card
const ReviewCard: React.FC<{ 
  review: Review; 
  onVote: (reviewId: string, type: 'helpful' | 'not-helpful') => void;
}> = ({ review, onVote }) => {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.userAvatar} />
              <AvatarFallback>{review.userName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.userName}</span>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</p>
            </div>
          </div>
          <StarRating rating={review.rating} readonly size="sm" />
        </div>

        {/* Review Title */}
        <h4 className="font-semibold text-lg mb-2">{review.title}</h4>

        {/* Recommendation Badge */}
        {review.recommendProduct && (
          <Badge variant="outline" className="mb-3 text-green-700 border-green-300">
            <ThumbsUp className="w-3 h-3 mr-1" />
            Recommends this product
          </Badge>
        )}

        {/* Product Variant */}
        {review.productVariant && (
          <p className="text-sm text-muted-foreground mb-3">
            Variant: {review.productVariant}
          </p>
        )}

        {/* Review Content */}
        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

        {/* Pros and Cons */}
        {(review.pros?.length || review.cons?.length) ? (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {review.pros?.length ? (
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">Pros:</p>
                <ul className="space-y-1">
                  {review.pros.map((pro, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {review.cons?.length ? (
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Cons:</p>
                <ul className="space-y-1">
                  {review.cons.map((con, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Review Images */}
        {review.images?.length ? (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {review.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Review image ${idx + 1}`}
                className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  // Open image modal
                }}
              />
            ))}
          </div>
        ) : null}

        <Separator className="my-4" />

        {/* Helpful Votes */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Was this review helpful?
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={review.userVote === 'helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onVote(review.id, 'helpful')}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {review.helpful}
            </Button>
            <Button
              variant={review.userVote === 'not-helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onVote(review.id, 'not-helpful')}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              {review.notHelpful}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Product Reviews Component
export const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId, 
  productName 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 4.5,
    totalReviews: 127,
    recommendationRate: 92,
    ratingDistribution: { 5: 89, 4: 28, 3: 7, 2: 2, 1: 1 },
    verifiedPurchases: 115
  });
  const [sortBy, setSortBy] = useState('most-helpful');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVerified, setFilterVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterRating, filterVerified]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockReviews: Review[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Sarah Johnson',
          userAvatar: '/api/placeholder/40/40',
          rating: 5,
          title: 'Excellent quality and fast results!',
          comment: 'I\'ve been taking this supplement for 3 months now and the results are amazing. My energy levels have significantly improved and I feel much healthier overall.',
          pros: ['High quality ingredients', 'No side effects', 'Easy to swallow'],
          cons: ['A bit pricey'],
          images: ['/api/placeholder/100/100', '/api/placeholder/100/100'],
          verified: true,
          helpful: 45,
          notHelpful: 2,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          recommendProduct: true
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Michael Chen',
          rating: 4,
          title: 'Good product, works as described',
          comment: 'The product works well and I\'ve noticed improvements. Shipping was fast and packaging was excellent.',
          pros: ['Effective', 'Well packaged'],
          verified: true,
          helpful: 23,
          notHelpful: 1,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          recommendProduct: true
        }
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reviewId: string, type: 'helpful' | 'not-helpful') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        // Update local state
        setReviews(reviews.map(review => {
          if (review.id === reviewId) {
            return {
              ...review,
              userVote: type,
              helpful: type === 'helpful' ? review.helpful + 1 : review.helpful,
              notHelpful: type === 'not-helpful' ? review.notHelpful + 1 : review.notHelpful
            };
          }
          return review;
        }));
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
        <div className="flex items-center gap-4">
          <StarRating rating={stats.averageRating} readonly />
          <span className="text-muted-foreground">
            {stats.totalReviews} reviews
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Stats Sidebar */}
        <div className="lg:col-span-1">
          <ReviewStatsCard stats={stats} />
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters and Sorting */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-helpful">Most Helpful</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Rating</SelectItem>
                      <SelectItem value="lowest">Lowest Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {/* Rating Filter */}
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      variant={filterRating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    >
                      {rating}
                      <Star className="w-3 h-3 ml-1 fill-current" />
                    </Button>
                  ))}
                  
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  
                  <Button
                    variant={filterVerified ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterVerified(!filterVerified)}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Verified Only
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  onVote={handleVote}
                />
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No reviews yet. Be the first to review this product!
              </AlertDescription>
            </Alert>
          )}

          {/* Load More */}
          {reviews.length > 0 && (
            <div className="text-center">
              <Button variant="outline">
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
