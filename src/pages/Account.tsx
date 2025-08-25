import React, { useState } from "react";
import { NavigationPrimary } from "@/components/NavigationPrimary";
import { FooterPrimary } from "@/components/FooterPrimary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Package,
  MapPin,
  Settings,
  Heart,
  CreditCard,
  Bell,
  Shield,
  Edit,
  Truck,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Download,
  Plus,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const Account = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "+27 82 123 4567",
    birthDate: "1990-05-15",
    avatar: "/api/placeholder/100/100",
  });

  // Mock data
  const recentOrders = [
    {
      id: "BB-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 445.0,
      items: 3,
      image: "/api/placeholder/60/60",
      trackingNumber: "TN123456789",
    },
    {
      id: "BB-2024-002",
      date: "2024-01-28",
      status: "processing",
      total: 275.5,
      items: 2,
      image: "/api/placeholder/60/60",
      trackingNumber: "TN987654321",
    },
    {
      id: "BB-2024-003",
      date: "2024-02-10",
      status: "shipped",
      total: 189.99,
      items: 1,
      image: "/api/placeholder/60/60",
      trackingNumber: "TN456789123",
    },
  ];

  const addresses = [
    {
      id: 1,
      type: "home",
      name: "Home Address",
      address: "123 Wellness Street",
      apartment: "Apt 4B",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      name: "Work Address",
      address: "456 Health Avenue",
      apartment: "Suite 200",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8000",
      isDefault: false,
    },
  ];

  const wishlistItems = [
    {
      id: 1,
      name: "Collagen Plus Complex",
      price: 420.0,
      originalPrice: 480.0,
      image: "/api/placeholder/80/80",
      inStock: true,
    },
    {
      id: 2,
      name: "Stress Relief Bundle",
      price: 299.99,
      originalPrice: null,
      image: "/api/placeholder/80/80",
      inStock: true,
    },
    {
      id: 3,
      name: "Immune Boost Pack",
      price: 350.0,
      originalPrice: 425.0,
      image: "/api/placeholder/80/80",
      inStock: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleProfileUpdate = () => {
    setIsEditing(false);
    // Handle profile update logic here
    alert("Profile updated successfully!");
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#BB4500]/10 rounded-xl">
                <Package className="w-6 h-6 text-[#BB4500]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#280B0B]">12</p>
                <p className="text-sm text-[#626675]">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C4C240]/10 rounded-xl">
                <Heart className="w-6 h-6 text-[#C4C240]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#280B0B]">3</p>
                <p className="text-sm text-[#626675]">Wishlist Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#280B0B]">4.8</p>
                <p className="text-sm text-[#626675]">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#280B0B]">Gold</p>
                <p className="text-sm text-[#626675]">Member Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
                RECENT ORDERS
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#BB4500] hover:bg-[#BB4500]/10"
                onClick={() => setActiveTab("orders")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 bg-[#F9E7C9]/30 rounded-lg"
              >
                <div className="w-12 h-12 bg-[#F9E7C9] rounded-lg overflow-hidden">
                  <img
                    src={order.image}
                    alt="Order"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#280B0B]">
                      #{order.id}
                    </span>
                    <Badge
                      className={`text-xs ${getStatusColor(order.status)}`}
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#626675]">
                    {order.items} items •{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#280B0B]">
                    R{order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
              QUICK ACTIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-[#BB4500]/20 text-[#BB4500] hover:bg-[#BB4500] hover:text-white"
              asChild
            >
              <Link to="/products">
                <Package className="mr-3 w-4 h-4" />
                Browse Products
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[#BB4500]/20 text-[#BB4500] hover:bg-[#BB4500] hover:text-white"
              onClick={() => setActiveTab("orders")}
            >
              <Truck className="mr-3 w-4 h-4" />
              Track Order
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[#BB4500]/20 text-[#BB4500] hover:bg-[#BB4500] hover:text-white"
              onClick={() => setActiveTab("wishlist")}
            >
              <Heart className="mr-3 w-4 h-4" />
              View Wishlist
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-[#BB4500]/20 text-[#BB4500] hover:bg-[#BB4500] hover:text-white"
              asChild
            >
              <Link to="/contact">
                <Mail className="mr-3 w-4 h-4" />
                Contact Support
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProfile = () => (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
            PROFILE INFORMATION
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-[#BB4500]/20 text-[#BB4500] hover:bg-[#BB4500] hover:text-white"
          >
            <Edit className="mr-2 w-4 h-4" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userProfile.avatar} alt="Profile" />
            <AvatarFallback className="bg-[#BB4500] text-white text-xl">
              {userProfile.firstName[0]}
              {userProfile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Plus className="mr-2 w-4 h-4" />
              Change Photo
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[#280B0B] font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              value={userProfile.firstName}
              onChange={(e) =>
                setUserProfile({ ...userProfile, firstName: e.target.value })
              }
              disabled={!isEditing}
              className="border-[#626675]/20 focus:border-[#BB4500]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[#280B0B] font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={userProfile.lastName}
              onChange={(e) =>
                setUserProfile({ ...userProfile, lastName: e.target.value })
              }
              disabled={!isEditing}
              className="border-[#626675]/20 focus:border-[#BB4500]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#280B0B] font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={userProfile.email}
              onChange={(e) =>
                setUserProfile({ ...userProfile, email: e.target.value })
              }
              disabled={!isEditing}
              className="border-[#626675]/20 focus:border-[#BB4500]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#280B0B] font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={userProfile.phone}
              onChange={(e) =>
                setUserProfile({ ...userProfile, phone: e.target.value })
              }
              disabled={!isEditing}
              className="border-[#626675]/20 focus:border-[#BB4500]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-[#280B0B] font-medium">
              Birth Date
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={userProfile.birthDate}
              onChange={(e) =>
                setUserProfile({ ...userProfile, birthDate: e.target.value })
              }
              disabled={!isEditing}
              className="border-[#626675]/20 focus:border-[#BB4500]"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4">
            <Button
              onClick={handleProfileUpdate}
              className="bg-[#BB4500] hover:bg-[#BB4500]/90 text-white"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-[#626675]/20 text-[#626675]"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {recentOrders.map((order) => (
        <Card key={order.id} className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#F9E7C9] rounded-lg overflow-hidden">
                  <img
                    src={order.image}
                    alt="Order"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#280B0B]">
                    #{order.id}
                  </h3>
                  <p className="text-sm text-[#626675]">
                    {new Date(order.date).toLocaleDateString()} • {order.items}{" "}
                    items
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={`text-xs ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#280B0B]">
                  R{order.total.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Eye className="mr-1 w-3 h-3" />
                    View
                  </Button>
                  {order.status === "delivered" && (
                    <Button size="sm" variant="outline" className="text-xs">
                      <Download className="mr-1 w-3 h-3" />
                      Invoice
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="text-sm text-[#626675] bg-[#F9E7C9]/30 p-3 rounded-lg">
                <strong>Tracking Number:</strong> {order.trackingNumber}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#280B0B]">SAVED ADDRESSES</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-[#BB4500]/20 text-[#BB4500] hover:bg-[#BB4500] hover:text-white"
        >
          <Plus className="mr-2 w-4 h-4" />
          Add Address
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className="border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#BB4500]" />
                  <h4 className="font-bold text-[#280B0B]">{address.name}</h4>
                </div>
                {address.isDefault && (
                  <Badge className="bg-[#C4C240]/20 text-[#C4C240]">
                    Default
                  </Badge>
                )}
              </div>
              <div className="text-sm text-[#626675] space-y-1">
                <p>{address.address}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>
                  {address.city}, {address.province} {address.postalCode}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="text-xs">
                  <Edit className="mr-1 w-3 h-3" />
                  Edit
                </Button>
                {!address.isDefault && (
                  <Button size="sm" variant="outline" className="text-xs">
                    Set Default
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#280B0B]">WISHLIST ITEMS</h3>
        <Badge variant="secondary" className="bg-[#F9E7C9] text-[#626675]">
          {wishlistItems.length} items
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="border-none shadow-md">
            <CardContent className="p-6">
              <div className="aspect-square bg-[#F9E7C9]/50 rounded-lg overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-[#280B0B] mb-2">{item.name}</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-[#BB4500]">
                  R{item.price.toFixed(2)}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-[#626675] line-through">
                    R{item.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-[#BB4500] hover:bg-[#BB4500]/90 text-white"
                  disabled={!item.inStock}
                >
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      <NavigationPrimary />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#BB4500] to-[#BB4500]/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src={userProfile.avatar} alt="Profile" />
              <AvatarFallback className="bg-white/20 text-white text-2xl">
                {userProfile.firstName[0]}
                {userProfile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide">
                Welcome Back, {userProfile.firstName}!
              </h1>
              <p className="text-lg text-white/90 mt-2">
                Manage your wellness journey and account settings
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white shadow-sm">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-[#BB4500] data-[state=active]:text-white"
            >
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-[#BB4500] data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 data-[state=active]:bg-[#BB4500] data-[state=active]:text-white"
            >
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="flex items-center gap-2 data-[state=active]:bg-[#BB4500] data-[state=active]:text-white"
            >
              <MapPin className="w-4 h-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="flex items-center gap-2 data-[state=active]:bg-[#BB4500] data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            {renderProfile()}
          </TabsContent>

          <TabsContent value="orders" className="space-y-8">
            {renderOrders()}
          </TabsContent>

          <TabsContent value="addresses" className="space-y-8">
            {renderAddresses()}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-8">
            {renderWishlist()}
          </TabsContent>
        </Tabs>
      </div>

      <FooterPrimary />
    </div>
  );
};

export default Account;
