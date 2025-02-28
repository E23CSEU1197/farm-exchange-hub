
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tractor, User, Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  
  const toggleView = () => {
    setIsLogin(!isLogin);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!isLogin && (!name || !phone || !location)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Simulate authentication
    toast.success(isLogin ? "Login successful" : "Account created successfully");
    
    // Redirect to home after brief delay
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image and info */}
      <div className="flex-1 bg-primary relative overflow-hidden hidden md:block">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
            alt="Farming background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70"></div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full p-12 text-white">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Vismay
            </h1>
            
            <p className="text-white/80 text-lg mb-8">
              Join our community of farmers and agricultural enthusiasts to exchange equipment, sell produce, and support each other.
            </p>
            
            <div className="space-y-6">
              {[
                "Access to thousands of farming equipment for barter",
                "Direct selling platform without middlemen",
                "Community support for farmers in need",
                "AI-powered recommendations for optimal matches"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.33333 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-white/70 text-sm">
            © {new Date().getFullYear()} Vismay. All rights reserved.
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile back link */}
          <div className="md:hidden mb-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-primary font-medium mb-8"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <Tractor size={32} className="text-primary" />
            <h1 className="text-3xl font-bold ml-2">Vismay</h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-center">
            {isLogin ? "Login to Your Account" : "Create Your Account"}
          </h2>
          
          <p className="text-muted-foreground text-center mb-8">
            {isLogin 
              ? "Welcome back! Please enter your details"
              : "Join our farming community today"}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User size={18} className="text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-vismay pl-10 w-full"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-vismay w-full"
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-vismay w-full"
                      placeholder="Your city/village"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-vismay pl-10 w-full"
                  placeholder="Your email address"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-vismay pl-10 pr-10 w-full"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-muted-foreground" />
                  ) : (
                    <Eye size={18} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            
            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
            
            <button
              type="submit"
              className="btn-vismay w-full"
            >
              {isLogin ? "Login" : "Create Account"}
              <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleView}
                className="text-primary font-medium ml-2 hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
