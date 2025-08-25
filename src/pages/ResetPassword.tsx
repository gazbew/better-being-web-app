import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { NavigationPrimary } from "@/components/NavigationPrimary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or has expired.",
      });
      navigate('/forgot-password');
    }
  }, [token, toast, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
      });
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        toast({
          title: "Password Reset Successful",
          description: data.message || "Your password has been successfully reset.",
        });
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map((err: any) => err.message).join(', ');
          toast({
            variant: "destructive",
            title: "Reset Failed",
            description: errorMessages,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Reset Failed",
            description: data.message || "Unable to reset password. The link may have expired.",
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
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-wellness flex flex-col items-center">
      <NavigationPrimary />
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-white">
                <span className="text-[#C1581B] font-bold text-lg">BB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Better Being</h1>
              </div>
            </div>
            <p className="text-white/80">Create a new password</p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-primary">
                {isSuccess ? "Password Reset Complete" : "Reset Password"}
              </CardTitle>
              <CardDescription className="text-center">
                {isSuccess 
                  ? "Your password has been successfully updated"
                  : "Enter your new password below"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can now log in with your new password.
                  </p>
                  <Link to="/login">
                    <Button className="w-full bg-[#C1581B] hover:bg-[#B34E16]">
                      Continue to Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Password must contain:
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>At least 8 characters</li>
                      <li>Uppercase and lowercase letters</li>
                      <li>At least one number</li>
                      <li>At least one special character</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#C1581B] hover:bg-[#B34E16]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}