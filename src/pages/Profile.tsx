import { useState, useEffect } from "react";
import { NavigationPrimary } from "@/components/NavigationPrimary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  LogOut,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  marketingConsent: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    marketingConsent: false,
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState({
    profile: false,
    password: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        marketingConsent: false,
      });
      
      // Fetch full profile data
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setProfileData({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          phone: data.user.phone || "",
          dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.split('T')[0] : "",
          gender: data.user.gender || "",
          marketingConsent: data.user.marketingConsent || false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, profile: true }));

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateUser({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        });
        
        toast({
          title: "Profile Updated",
          description: data.message || "Your profile has been successfully updated.",
        });
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: errorMessages,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: data.message || "Failed to update profile.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, password: true }));

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "The new passwords do not match.",
      });
      setIsLoading(prev => ({ ...prev, password: false }));
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        toast({
          title: "Password Changed",
          description: data.message || "Your password has been successfully changed.",
        });
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          toast({
            variant: "destructive",
            title: "Password Change Failed",
            description: errorMessages,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Password Change Failed",
            description: data.message || "Failed to change password.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, password: false }));
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-wellness">
        <NavigationPrimary />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-white/80">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur">
                <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#C1581B]">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#C1581B]">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="account" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#C1581B]">
                  <Settings className="w-4 h-4 mr-2" />
                  Account
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="shadow-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select
                            id="gender"
                            name="gender"
                            value={profileData.gender}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C1581B]"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="marketingConsent"
                          name="marketingConsent"
                          checked={profileData.marketingConsent}
                          onChange={handleProfileChange}
                          className="rounded"
                        />
                        <Label htmlFor="marketingConsent" className="text-sm">
                          I would like to receive marketing communications and wellness tips
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-[#C1581B] hover:bg-[#B34E16]"
                        disabled={isLoading.profile}
                      >
                        {isLoading.profile ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  {/* Email Status */}
                  <Card className="shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {user.emailVerified ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                            )}
                            <span className="font-medium">{user.email}</span>
                          </div>
                          <Badge variant={user.emailVerified ? "default" : "secondary"}>
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        {!user.emailVerified && (
                          <Button variant="outline" size="sm">
                            Resend Verification
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Password Change */}
                  <Card className="shadow-2xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Change Password
                      </CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            >
                              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Password requirements:
                          <ul className="mt-1 space-y-1 list-disc list-inside">
                            <li>At least 8 characters</li>
                            <li>Uppercase and lowercase letters</li>
                            <li>At least one number</li>
                            <li>At least one special character</li>
                          </ul>
                        </div>

                        <Button
                          type="submit"
                          className="w-full md:w-auto bg-[#C1581B] hover:bg-[#B34E16]"
                          disabled={isLoading.password}
                        >
                          {isLoading.password ? "Changing..." : "Change Password"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account">
                <Card className="shadow-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Account Management
                    </CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Account Information</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
                        {user.lastLogin && (
                          <p>Last login: {new Date(user.lastLogin).toLocaleString()}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium text-red-600">Danger Zone</h3>
                      
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-red-800">Logout from all devices</h4>
                            <p className="text-sm text-red-600">
                              This will log you out from all devices and invalidate all sessions.
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => logout(true)}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout All
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}