import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User, Package, Heart, MapPin, CreditCard, Bell,
  Gift, Shield, Settings, LogOut, ChevronRight,
  TrendingUp, Award, Clock, Star, Download,
  ShoppingBag, RefreshCw, AlertCircle, Check, Loader2
} from 'lucide-react';

import { NavigationPrimary } from '@/components/NavigationPrimary';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Account Overview Component
const AccountOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 12,
    totalSpent: 8456,
    loyaltyPoints: 845,
    savedItems: 7,
    activeSubscriptions: 2,
    memberSince: '2023-01-15'
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-muted-foreground">
                  Member since {new Date(stats.memberSince).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white">
              Gold Member
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.loyaltyPoints}</div>
            <p className="text-xs text-muted-foreground">
              R{(stats.loyaltyPoints * 0.1).toFixed(2)} value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest account activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Order #ORD-2025-123456 delivered</p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Earned 85 loyalty points</p>
              <p className="text-xs text-muted-foreground">5 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Left a review for Vitamin C Complex</p>
              <p className="text-xs text-muted-foreground">1 week ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <RefreshCw className="w-5 h-5" />
          <span className="text-xs">Reorder</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <Download className="w-5 h-5" />
          <span className="text-xs">Invoices</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <Heart className="w-5 h-5" />
          <span className="text-xs">Wishlist</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-4">
          <Bell className="w-5 h-5" />
          <span className="text-xs">Preferences</span>
        </Button>
      </div>
    </div>
  );
};

// Orders History Component
const OrdersHistory: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Fetch orders from API
  const { data: ordersResponse, isLoading, error } = useQuery({
    queryKey: ['user-orders', activeTab, page],
    queryFn: () => api.getUserOrders({
      status: activeTab === 'all' ? undefined : activeTab,
      limit,
      offset: (page - 1) * limit
    }),
  });
  
  const orders = ordersResponse?.data?.orders || [];
  const totalOrders = ordersResponse?.data?.total || 0;
  const hasMore = ordersResponse?.data?.hasMore || false;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-600">Failed to load orders. Please try again.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Order History</h2>
        <p className="text-muted-foreground">View and manage your past orders</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">#{order.orderNumber || order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">R{parseFloat(order.total).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/account/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                      {order.status !== 'delivered' && (
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Reorder
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {/* Pagination */}
          {totalOrders > limit && (
            <div className="flex justify-center gap-2 mt-6">
              <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                disabled={!hasMore}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Loyalty Program Component
const LoyaltyProgram: React.FC = () => {
  const [loyaltyData, setLoyaltyData] = useState({
    currentPoints: 845,
    lifetimePoints: 2456,
    currentTier: 'Gold',
    nextTier: 'Platinum',
    pointsToNextTier: 155,
    expiringPoints: 120,
    expiryDate: '2025-12-31'
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Loyalty Program</h2>
        <p className="text-muted-foreground">Earn points and unlock exclusive rewards</p>
      </div>

      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Points Balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-primary mb-2">
              {loyaltyData.currentPoints}
            </div>
            <p className="text-muted-foreground">Available Points</p>
            <p className="text-sm text-muted-foreground mt-2">
              = R{(loyaltyData.currentPoints * 0.1).toFixed(2)} value
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {loyaltyData.expiringPoints} points expiring on {new Date(loyaltyData.expiryDate).toLocaleDateString()}
            </AlertDescription>
          </Alert>

          <Button className="w-full">Redeem Points</Button>
        </CardContent>
      </Card>

      {/* Tier Status */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Tier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white">
              {loyaltyData.currentTier} Member
            </Badge>
            <Badge variant="outline">
              Next: {loyaltyData.nextTier}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {loyaltyData.nextTier}</span>
              <span>{loyaltyData.pointsToNextTier} points needed</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
          <CardDescription>Redeem your points for these rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">R50 Off Voucher</p>
                <p className="text-xs text-muted-foreground">Valid on orders over R500</p>
              </div>
            </div>
            <Button size="sm">
              500 pts
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On your next order</p>
              </div>
            </div>
            <Button size="sm">
              200 pts
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">15% Off Coupon</p>
                <p className="text-xs text-muted-foreground">Site-wide discount</p>
              </div>
            </div>
            <Button size="sm">
              750 pts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Account Settings Component
const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    birthday: '',
    newsletter: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+27 123 456 7890"
            />
          </div>
          <div>
            <Label htmlFor="birthday">Birthday (for special offers)</Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Control what emails you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newsletter">Newsletter</Label>
              <p className="text-sm text-muted-foreground">Weekly wellness tips and articles</p>
            </div>
            <Switch
              id="newsletter"
              checked={formData.newsletter}
              onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="orderUpdates">Order Updates</Label>
              <p className="text-sm text-muted-foreground">Shipping and delivery notifications</p>
            </div>
            <Switch
              id="orderUpdates"
              checked={formData.orderUpdates}
              onCheckedChange={(checked) => setFormData({ ...formData, orderUpdates: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="promotions">Promotions</Label>
              <p className="text-sm text-muted-foreground">Special offers and discounts</p>
            </div>
            <Switch
              id="promotions"
              checked={formData.promotions}
              onCheckedChange={(checked) => setFormData({ ...formData, promotions: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">Enable Two-Factor Authentication</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Account Dashboard Component
const AccountDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/account', label: 'Overview', icon: User },
    { path: '/account/orders', label: 'Orders', icon: Package },
    { path: '/account/loyalty', label: 'Loyalty Program', icon: Gift },
    { path: '/account/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/account/addresses', label: 'Addresses', icon: MapPin },
    { path: '/account/payments', label: 'Payment Methods', icon: CreditCard },
    { path: '/account/notifications', label: 'Notifications', icon: Bell },
    { path: '/account/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationPrimary />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-6">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/account'}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-gray-100"
                          )
                        }
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                  
                  <Separator className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 w-full text-left text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<AccountOverview />} />
              <Route path="/orders" element={<OrdersHistory />} />
              <Route path="/loyalty" element={<LoyaltyProgram />} />
              <Route path="/settings" element={<AccountSettings />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
