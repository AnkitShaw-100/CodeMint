import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[56px] leading-none font-semibold tracking-[-0.02em]">
          404
        </p>

        <h1 className="mt-4 text-[21px] font-semibold">Oops! Page not found</h1>

        <p className="mt-2 text-[17px] text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center rounded-[12px] bg-primary px-6 text-[17px] font-semibold text-primary-foreground transition-colors duration-150 outline-none hover:bg-primary-hover focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
