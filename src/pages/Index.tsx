import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const seen = localStorage.getItem("lsw_seen_onboarding");
    if (!seen) {
      localStorage.setItem("lsw_seen_onboarding", "1");
      navigate("/onboarding", { replace: true });
    } else if (location.pathname === "/" || location.pathname === "/onboarding") {
      navigate("/home", { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Loading…</h1>
        <p className="text-muted-foreground">Redirecting</p>
      </div>
    </div>
  );
};

export default Index;
