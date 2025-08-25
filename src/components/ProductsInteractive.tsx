import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Container,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Visibility,
  Star,
  Close,
  Add,
  Remove
} from '@mui/icons-material';
import { getFeaturedProducts, Product } from '@/data/products';

const SectionContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.secondary.light} 50%, 
    ${theme.palette.background.default} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1700587085844-b96c27958df2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMHdlbGxuZXNzJTIwZmxvYXRpbmd8ZW58MHwyfHx8MTc1NTE1Mjc2NHww&ixlib=rb-4.1.0&q=85)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.05,
    zIndex: 0
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(193, 88, 27, 0.2)',
    '& .product-image': {
      transform: 'scale(1.1)'
    },
    '& .product-overlay': {
      opacity: 1
    }
  }
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 280,
  position: 'relative',
  background: `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '& img': {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    transition: 'all 0.4s ease'
  }
}));

const ProductOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 2
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  color: 'white',
  padding: theme.spacing(1, 2),
  borderRadius: '20px',
  fontWeight: 700,
  fontSize: '1.1rem',
  boxShadow: '0 4px 12px rgba(193, 88, 27, 0.3)',
  zIndex: 3
}));

const BestSellerBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  background: `linear-gradient(45deg, #7BA05B, #9BC47A)`,
  color: 'white',
  fontWeight: 600,
  zIndex: 3,
  '& .MuiChip-label': {
    padding: theme.spacing(0.5, 1.5)
  }
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.primary.main,
    color: 'white',
    transform: 'scale(1.1)'
  }
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  color: 'white',
  borderRadius: '25px',
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 6px 20px rgba(193, 88, 27, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(193, 88, 27, 0.4)'
  }
}));

interface ProductCardComponentProps {
  product: Product;
  index: number;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  favorites: Set<string>;
}

const ProductCardComponent: React.FC<ProductCardComponentProps> = ({
  product,
  index,
  onQuickView,
  onToggleFavorite,
  favorites
}) => {
  return (
    <ProductCard onClick={() => onQuickView(product)}>
      {product.popular && (
        <BestSellerBadge label="Best Seller" />
      )}
      
      <PriceTag>
        {product.price}
      </PriceTag>

      <ProductImage>
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        <ProductOverlay className="product-overlay">
          <Stack direction="row" spacing={1}>
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id.toString());
              }}
            >
              {favorites.has(product.id.toString()) ? <Favorite /> : <FavoriteBorder />}
            </ActionButton>
            <ActionButton onClick={(e) => e.stopPropagation()}>
              <Visibility />
            </ActionButton>
            <ActionButton onClick={(e) => e.stopPropagation()}>
              <ShoppingCart />
            </ActionButton>
          </Stack>
        </ProductOverlay>
      </ProductImage>

      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            color: 'text.primary'
          }}
        >
          {product.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary', 
            mb: 2,
            lineHeight: 1.6
          }}
        >
          {product.description}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating 
            value={product.rating} 
            readOnly 
            size="small"
            sx={{ color: '#7BA05B' }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({product.reviews.toLocaleString()})
          </Typography>
        </Stack>

        <Stack spacing={1} sx={{ mb: 3 }}>
          {product.benefits.slice(0, 3).map((benefit, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#7BA05B'
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {benefit}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <AddToCartButton
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={(e) => e.stopPropagation()}
        >
          Add to Cart
        </AddToCartButton>
      </CardContent>
    </ProductCard>
  );
};

export const ProductsInteractive = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const featuredProducts = getFeaturedProducts();

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleCloseQuickView = () => {
    setSelectedProduct(null);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <SectionContainer sx={{ py: 10, position: 'relative', zIndex: 1 }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
          <Chip
            label="Better Being Products"
            sx={{
              background: 'rgba(193, 88, 27, 0.1)',
              color: 'primary.main',
              fontWeight: 600,
              px: 3,
              py: 1
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, #7BA05B)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Natural Wellness Solutions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              lineHeight: 1.6
            }}
          >
            Each product is meticulously formulated using the finest natural ingredients, 
            backed by cutting-edge research and trusted by thousands worldwide.
          </Typography>
        </Stack>

        {/* Featured Image */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            mb: 8,
            height: { xs: 200, md: 300 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main}CC, #7BA05BAA)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1625154253125-5d89afab6c7c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHByb2R1Y3RzJTIwc3VwcGxlbWVudHMlMjBuYXR1cmFsJTIwaGVhbHRofGVufDB8MHx8fDE3NTUxNTI3NjR8MA&ixlib=rb-4.1.0&q=85"
            alt="Premium wellness products arranged beautifully, natural lighting, professional photography by Honest Paws on Unsplash"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.8
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              color: 'white'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Better Being Quality Guaranteed
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Lab-tested • Third-party verified • Sustainably sourced
            </Typography>
          </Box>
        </Box>

        {/* Products Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 4,
            mb: 8
          }}
        >
          {featuredProducts.slice(0, 8).map((product, index) => (
            <ProductCardComponent
              key={product.id}
              product={product}
              index={index}
              onQuickView={handleQuickView}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
            />
          ))}
        </Box>

        {/* CTA */}
        <Stack alignItems="center">
          <Button
            size="large"
            variant="outlined"
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              borderRadius: '25px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'primary.main',
                color: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            View All Better Being Products
          </Button>
        </Stack>
      </Container>

      {/* Quick View Dialog */}
      <Dialog
        open={Boolean(selectedProduct)}
        onClose={handleCloseQuickView}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {selectedProduct.name}
              </Typography>
              <IconButton onClick={handleCloseQuickView}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Box sx={{ flex: 1 }}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '16px'
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                    {selectedProduct.description}
                  </Typography>
                  
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <Rating value={selectedProduct.rating} readOnly />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ({selectedProduct.reviews.toLocaleString()} reviews)
                    </Typography>
                  </Stack>

                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 3 }}>
                    {selectedProduct.price}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <Typography variant="body2">Quantity:</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <Typography sx={{ minWidth: '40px', textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Add />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <AddToCartButton
                      fullWidth
                      startIcon={<ShoppingCart />}
                    >
                      Add to Cart
                    </AddToCartButton>
                    <IconButton
                      onClick={() => handleToggleFavorite(selectedProduct.id.toString())}
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.main',
                        color: favorites.has(selectedProduct.id.toString()) ? 'error.main' : 'primary.main'
                      }}
                    >
                      {favorites.has(selectedProduct.id.toString()) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </SectionContainer>
  );
};