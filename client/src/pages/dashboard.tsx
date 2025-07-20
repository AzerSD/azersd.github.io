import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { LogOut, User, Settings, Cloud, Shield, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser, logout } from "@/lib/auth";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userResult, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userResult?.user) {
    navigate("/login");
    return null;
  }

  const user = userResult.user;

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || user.username.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="font-medium">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 text-white">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username
                }
              </CardTitle>
              <CardDescription className="text-sm">
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-medium">#{user.id}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome back{user.firstName ? `, ${user.firstName}` : ""}!
              </CardTitle>
              <CardDescription>
                You're successfully logged in to AceCloud. Here's your dashboard overview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Cloud className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Cloud Storage</h3>
                      <p className="text-sm text-muted-foreground">Manage your files</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Access Storage
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-green-100 to-green-50 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Security</h3>
                      <p className="text-sm text-muted-foreground">Account protection</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Security
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h3 className="font-semibold mb-2">Getting Started</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Welcome to AceCloud! You've successfully authenticated using{" "}
                  {user.firstName || user.lastName ? "your account" : "Zitadel OAuth"}.
                  Explore the platform and manage your cloud resources.
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    Quick Tour
                  </Button>
                  <Button variant="outline" size="sm">
                    Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
