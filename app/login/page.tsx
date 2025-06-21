"use client"; // Mark as a Client Component

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../../auth-client'; // Adjust path as necessary

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const session = await authClient.session.get();
        if (session && session.user) {
          router.push('/'); // Redirect to homepage or dashboard
        }
      } catch (error) {
        // Not logged in or error fetching session, stay on login page
        console.info("User not logged in or error fetching session:", error);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left side with logo and design elements */}
      <div className="relative hidden lg:flex flex-col justify-center items-center w-2/3 bg-muted overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Diagonal Stripes */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`absolute h-full w-1/12 bg-primary/5 dark:bg-primary/10 transform -skew-x-12 ${
                i % 2 === 0 ? 'animate-stripe-slow' : 'animate-stripe-fast'
              }`}
              style={{ left: `${i * 10 - 20}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className="z-10 flex flex-col items-center">
          <Image
            src="/Logo 1.svg" // Assuming you have a logo here
            alt="App Logo"
            width={200}
            height={200}
            className="mb-8"
          />
          <h1 className="text-4xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue to your dashboard.
          </p>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center items-center p-8 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Image
              src="/Logo 1.svg" // Assuming you have a logo here
              alt="App Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
             <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Login</h2>
          <p className="text-muted-foreground mb-6">
            Use your Google account to sign in.
          </p>

          {/* Google Sign-In Button */}
          <button
            onClick={async () => {
              try {
                // Redirect to Google's OAuth provider page
                const { url } = await authClient.oauth.google.authorize();
                window.location.href = url;
              } catch (error) {
                console.error("Error during Google Sign-In:", error);
                // Handle error appropriately in UI, e.g., show a message
                alert("Failed to initiate Google Sign-In. Please try again.");
              }
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 400.3 381.4 512 244 512 110.4 512 0 398.8 0 256S110.4 0 244 0c71.1 0 130.8 29.1 174.3 76.5l-64.5 64.5C320.5 112.3 285.8 96 244 96c-66.9 0-120.9 54.3-120.9 120.9s54 120.9 120.9 120.9c43.7 0 78.2-22.1 98.7-54.4H244v-79.2h239.1c2.3 12.7 3.8 25.9 3.8 39.5z"
              ></path>
            </svg>
            Sign in with Google
          </button>

          <p className="text-xs text-muted-foreground mt-8 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <style jsx global>{`
        @keyframes stripe-slow {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(100%) skewX(-12deg);
          }
        }
        @keyframes stripe-fast {
          0% {
            transform: translateX(-150%) skewX(-12deg);
          }
          100% {
            transform: translateX(150%) skewX(-12deg);
          }
        }
        .animate-stripe-slow {
          animation: stripe-slow 20s linear infinite;
        }
        .animate-stripe-fast {
          animation: stripe-fast 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
