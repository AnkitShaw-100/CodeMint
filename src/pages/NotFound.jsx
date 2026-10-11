import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="page-backdrop" aria-hidden="true" />

      <div className="glass-card relative w-full max-w-md rounded-[20px] p-8 text-center sm:p-10">
        <p className="text-brand-gradient text-7xl font-extrabold tracking-[-0.04em]">
          404
        </p>

        <h1 className="mt-4 text-xl font-bold tracking-tight">
          Oops! Page not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>

        <Link
          to="/"
          className="bg-brand-gradient mt-7 inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-semibold text-[#1A1A1E] shadow-[0_10px_28px_-8px_rgba(255,107,26,0.6)] transition-all duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
