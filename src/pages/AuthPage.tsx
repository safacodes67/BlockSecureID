
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Banknote } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

interface LocationState {
  defaultTab?: string;
}

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [activeTab, setActiveTab] = useState(state?.defaultTab || "login");
  const [userType, setUserType] = useState<"user" | "bank">("user");

  // Check for authenticated session
  useEffect(() => {
    const checkAuth = async () => {
      const userAuth = localStorage.getItem("userAuth");
      const bankAuth = localStorage.getItem("bankAuth");
      
      if (userAuth || bankAuth) {
        navigate("/dashboard");
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center">BlockSecure ID</CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login" ? "Welcome back! Please log in to your account" : "Create your account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <div className="mb-6">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger 
                    value="user" 
                    onClick={() => setUserType("user")}
                    className={userType === "user" ? "bg-purple-100" : ""}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Individual</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bank" 
                    onClick={() => setUserType("bank")}
                    className={userType === "bank" ? "bg-blue-100" : ""}
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    <span>Bank</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Login Form Tab */}
              <TabsContent value="login">
                <LoginForm userType={userType} />
              </TabsContent>
              
              {/* Sign Up Form Tab */}
              <TabsContent value="signup">
                <SignupForm userType={userType} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate("/")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Return to homepage
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
