"use client";

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../../auth-client';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
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
    <>
      <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 z-0 overflow-hidden">
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

      <div className="relative z-10 min-h-screen flex">
        {/* Left side with logo */}
        <div className="w-1/3 p-8 flex items-start">
          <div className="p-6">
            <Image
              src="/Logo 1.svg"
              alt="App Logo"
              width={200}
              height={200}
              className="dark:invert"
            />
          </div>
        </div>
        
        {/* Right side with login form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-border/20 p-8">

            <div className="pb-6">
            <h2 className="text-3xl font-bold text-white mb-8 text-left">Login</h2>
            
            {/* Email and Password Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
                Sign In
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/90 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={async () => {
                try {
                  // Redirect to OAuth provider page
                  // Handle Google OAuth
                  const redirectUrl = `${window.location.origin}/auth/callback`;
                  const authUrl = `http://localhost:3000/auth/oauth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;
                  window.location.href = authUrl;
                } catch (error) {
                  console.error("Error during OAuth Sign-In:", error);
                  alert("Failed to initiate sign in. Please try again.");
                }
              }}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center border border-gray-300 transition-colors"
            >
              <svg
                className="mr-2 w-4 h-4"
                aria-hidden="true"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
            
            <p className="text-xs text-gray-400 mt-6 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
            </div>
          </div>
        </div>
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
    </>
  );
}
