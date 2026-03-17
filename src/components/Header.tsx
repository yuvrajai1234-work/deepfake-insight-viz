import { Shield, Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        const name = session.user.user_metadata?.full_name?.split(' ')[0] || session.user.email?.split('@')[0];
        setUserName(name || "User");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        const name = session.user.user_metadata?.full_name?.split(' ')[0] || session.user.email?.split('@')[0];
        setUserName(name || "User");
      } else {
        setUserName("");
      }
    });
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setIsLoggedIn(false);
      toast.info("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-glass bg-background/80 py-3 backdrop-blur-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary p-2 text-primary-foreground shadow-glow">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            TruthLens<span className="text-primary">AI</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {!isLoggedIn && (
              <>
                <li>
                  <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    Use Cases
                  </a>
                </li>
              </>
            )}
            <li>
              {isLoggedIn ? (
                <div className="flex items-center gap-6">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Hi, <span className="text-primary">{userName}</span>
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleLogout}
                    className="rounded-full border-glass hover:bg-destructive/10 hover:text-destructive group"
                  >
                    <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => navigate("/auth")}
                  className="rounded-full bg-gradient-primary px-6 font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
                >
                  Sign In
                </Button>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-glass bg-background/95 px-6 py-8 backdrop-blur-2xl md:hidden">
          <ul className="flex flex-col gap-6">
            {!isLoggedIn && (
              <>
                <li>
                  <a href="#features" className="text-lg font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-lg font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="text-lg font-medium text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    Use Cases
                  </a>
                </li>
              </>
            )}
            <li>
              {isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      Hi, <span className="text-primary">{userName}</span>
                    </span>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    className="w-full rounded-xl variant-outline border-glass flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    navigate("/auth");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl bg-gradient-primary font-bold text-primary-foreground"
                >
                  Sign In
                </Button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
