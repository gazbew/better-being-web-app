import { useState } from "react";
import { Link } from "react-router-dom";
import { NavigationPrimary } from "@/components/NavigationPrimary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsEmailSent(true);
        toast({
          title: "Reset Link Sent",
          description: data.message || "Please check your email for password reset instructions.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Request Failed",
          description: data.message || "Unable to process password reset request.",
        });
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
            <p className="text-white/80">Reset your password</p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-primary">
                {isEmailSent ? "Check Your Email" : "Forgot Password"}
              </CardTitle>
              <CardDescription className="text-center">
                {isEmailSent 
                  ? "We've sent password reset instructions to your email address"
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEmailSent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If an account with that email exists, you'll receive password reset instructions shortly.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setIsEmailSent(false)}
                      variant="outline"
                      className="w-full"
                    >
                      Send Another Email
                    </Button>
                    <Link to="/login">
                      <Button className="w-full bg-[#C1581B] hover:bg-[#B34E16]">
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#C1581B] hover:bg-[#B34E16]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              )}

              <div className="text-center space-y-2">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
                <div className="text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link
                    to="/register"
                    className="text-[#C1581B] hover:text-[#B34E16] font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}