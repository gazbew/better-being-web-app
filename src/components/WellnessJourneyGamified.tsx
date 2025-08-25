import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Container,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import {
  Person,
  FavoriteBorder,
  Psychology,
  FlashOn,
  Shield,
  Star,
  PlayArrow,
  CheckCircle,
  ArrowForward,
  Close,
  EmojiEvents,
  TrendingUp
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SectionContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.secondary.light}40 50%, 
    ${theme.palette.background.default} 100%)`,
  position: 'relative',
  overflow: 'hidden'
}));

const JourneyCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '24px',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    '& .step-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.accent.main})`
    }
  }
}));

const StepIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.accent.main}20)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  border: `2px solid ${theme.palette.primary.main}30`
}));

const ProgressCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  color: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(https://images.unsplash.com/photo-1571838081649-888aca731232?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx3ZWxsbmVzcyUyMG5hdHVyZSUyMG1lZGl0YXRpb24lMjBoZWFsdGh5JTIwbGlmZXN0eWxlfGVufDB8MHx8Z3JlZW58MTc1NTE1Mjc2NHww&ixlib=rb-4.1.0&q=85)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.2,
    zIndex: 0
  }
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative'
}));

const AchievementBadge = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.accent.main}, ${theme.palette.accent.light})`,
  color: 'white',
  borderRadius: '50px',
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontWeight: 600,
  fontSize: '0.9rem',
  boxShadow: '0 4px 12px rgba(123, 160, 91, 0.3)'
}));

const FloatingStats = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  padding: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  zIndex: 3
}));

const journeySteps = [
  {
    id: 1,
    title: "Discover Your Wellness Profile",
    description: "Take our comprehensive wellness assessment to understand your unique needs and create a personalized transformation plan.",
    icon: Person,
    color: "accent.main",
    duration: "5 minutes",
    completion: 0
  },
  {
    id: 2,
    title: "Begin Your Transformation",
    description: "Start with our scientifically-formulated products designed specifically for your wellness goals and lifestyle.",
    icon: FavoriteBorder,
    color: "primary.main",
    duration: "Week 1-2",
    completion: 0
  },
  {
    id: 3,
    title: "Experience the Change",
    description: "Feel increased energy, mental clarity, and overall vitality as your body responds to premium natural ingredients.",
    icon: Psychology,
    color: "accent.main",
    duration: "Week 3-4",
    completion: 0
  },
  {
    id: 4,
    title: "Achieve Lasting Results",
    description: "Maintain your new level of wellness with ongoing support, expert guidance, and our community of transformed lives.",
    icon: FlashOn,
    color: "primary.main",
    duration: "Ongoing",
    completion: 0
  }
];

const achievements = [
  { icon: EmojiEvents, label: "First Week Complete", unlocked: true },
  { icon: TrendingUp, label: "Energy Boost", unlocked: true },
  { icon: Star, label: "Wellness Warrior", unlocked: false },
  { icon: Shield, label: "Health Champion", unlocked: false }
];

const testimonial = {
  name: "Sarah Mitchell",
  title: "Marketing Executive",
  avatar: "https://i.pravatar.cc/150?img=1",
  rating: 5,
  quote: "Better Being completely transformed my life. I went from constant fatigue to boundless energy, and my mental clarity has never been better. This isn't just a product - it's a life revolution powered by nature.",
  results: [
    { label: "Energy Level", before: 30, after: 95, unit: "%" },
    { label: "Sleep Quality", before: 40, after: 90, unit: "%" },
    { label: "Mental Focus", before: 50, after: 88, unit: "%" },
    { label: "Overall Mood", before: 45, after: 92, unit: "%" }
  ],
  timeframe: "30 days"
};

export const WellnessJourneyGamified = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [userProgress, setUserProgress] = useState({
    currentStep: 1,
    completedSteps: 0,
    totalPoints: 1250,
    streak: 7
  });

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const handleStartJourney = () => {
    setShowProgress(true);
  };

  return (
    <SectionContainer sx={{ py: 10 }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
            <Chip
              icon={<Shield />}
              label="Your Natural Transformation"
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
                color: 'text.primary',
                mb: 2
              }}
            >
              From Where You Are
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme => theme.palette.primary.main}, ${theme => theme.palette.accent.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              To Better Being
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                lineHeight: 1.6
              }}
            >
              Join thousands who have discovered the power of nature with Better Being. 
              Your wellness revolution starts with a single step.
            </Typography>
          </Stack>
        </motion.div>

        {/* Journey Visual with Progress */}
        <Box sx={{ position: 'relative', mb: 8 }}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={6} alignItems="center">
            {/* Journey Image with Floating Stats */}
            <Box sx={{ position: 'relative', flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <ProgressCard sx={{ height: 400, position: 'relative', zIndex: 1 }}>
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        Your Wellness Journey
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
                        Track your progress and celebrate every milestone
                      </Typography>
                      
                      {/* Progress Stats */}
                      <Stack spacing={3}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="body2">Journey Progress</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {Math.round((userProgress.completedSteps / journeySteps.length) * 100)}%
                            </Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={(userProgress.completedSteps / journeySteps.length) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: 'white',
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>
                        
                        <Stack direction="row" spacing={4}>
                          <Box textAlign="center">
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {userProgress.totalPoints}
                            </Typography>
                            <Typography variant="caption">Wellness Points</Typography>
                          </Box>
                          <Box textAlign="center">
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {userProgress.streak}
                            </Typography>
                            <Typography variant="caption">Day Streak</Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Achievements */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {achievements.map((achievement, index) => (
                        <AchievementBadge
                          key={index}
                          sx={{
                            opacity: achievement.unlocked ? 1 : 0.5,
                            transform: achievement.unlocked ? 'scale(1)' : 'scale(0.9)'
                          }}
                        >
                          <achievement.icon sx={{ fontSize: '1rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                            {achievement.label}
                          </Typography>
                        </AchievementBadge>
                      ))}
                    </Stack>
                  </CardContent>
                </ProgressCard>
              </motion.div>

              {/* Floating Stats */}
              <FloatingStats
                style={{ top: -20, right: -20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  30 Days
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  To Better Being
                </Typography>
              </FloatingStats>

              <FloatingStats
                style={{ bottom: -20, left: -20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'accent.main' }}>
                  97%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Success Rate
                </Typography>
              </FloatingStats>
            </Box>

            {/* Journey Steps */}
            <Box sx={{ flex: 1 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {journeySteps.map((step, index) => (
                  <Step key={step.id}>
                    <StepLabel
                      onClick={() => handleStepClick(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <StepIcon className="step-icon">
                          <step.icon sx={{ fontSize: '2rem', color: step.color }} />
                        </StepIcon>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {step.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {step.duration}
                          </Typography>
                        </Box>
                      </Stack>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 11, mb: 2 }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              <Button
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleStartJourney}
                sx={{
                  mt: 4,
                  ml: 11,
                  background: `linear-gradient(45deg, ${theme => theme.palette.primary.main}, ${theme => theme.palette.primary.light})`,
                  color: 'white',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(193, 88, 27, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(193, 88, 27, 0.4)'
                  }
                }}
              >
                Start Your Better Being Journey
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* Enhanced Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <TestimonialCard>
            <CardContent sx={{ p: 6 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
                {/* Testimonial Content */}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={0.5} sx={{ mb: 3 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: 'accent.main', fontSize: '1.5rem' }} />
                    ))}
                  </Stack>
                  
                  <Typography
                    variant="h5"
                    sx={{
                      fontStyle: 'italic',
                      color: 'text.primary',
                      mb: 4,
                      lineHeight: 1.6,
                      fontWeight: 400
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {testimonial.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'accent.main', fontWeight: 600 }}>
                        Transformed in {testimonial.timeframe}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Results Visualization */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                    Better Being Results
                  </Typography>
                  <Stack spacing={3}>
                    {testimonial.results.map((result, index) => (
                      <Box key={index}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {result.label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'accent.main' }}>
                            {result.before}% → {result.after}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={result.after}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(45deg, ${theme => theme.palette.primary.main}, ${theme => theme.palette.accent.main})`,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      mt: 4,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      borderRadius: '25px',
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    Read More Success Stories
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </TestimonialCard>
        </motion.div>
      </Container>
    </SectionContainer>
  );
};