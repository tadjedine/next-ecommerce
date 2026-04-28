"use client"

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        //  API call
        try {
            //  login logic 
            console.log({ email, password, rememberMe });
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        // Your social login logic
        console.log(`Login with ${provider}`);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center bg-gray-50">
            <div className="w-full md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-CartRed">
                        🛍️ Kwina
                    </Link>
                    <p className="text-gray-500 mt-2">Welcome back! Sign in to your account</p>
                </div>

                {/* Main Form */}
                <form 
                    onSubmit={handleSubmit}
                    className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-lg p-8 flex flex-col gap-5"
                >
                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                id="email"
                                type="email" 
                                placeholder="john@example.com" 
                                className="w-full ring-1 ring-gray-300 rounded-md py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-CartRed transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password" 
                                className="w-full ring-1 ring-gray-300 rounded-md py-3 pl-10 pr-12 outline-none focus:ring-2 focus:ring-CartRed transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-CartRed focus:ring-CartRed"
                            />
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <Link 
                            href="/forgot-password" 
                            className="text-CartRed hover:text-red-700 font-medium"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Sign In Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-CartRed text-white rounded-md py-3 font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Sign In →'
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-sm font-medium hidden sm:inline">Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="text-sm font-medium hidden sm:inline">Facebook</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('apple')}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            <span className="text-sm font-medium hidden sm:inline">Apple</span>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-sm text-center text-gray-500 mt-2">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-CartRed hover:text-red-700 font-semibold">
                            Sign Up
                        </Link>
                    </div>
                </form>

                {/* Guest Checkout */}
                <div className="text-center mt-6">
                    <Link 
                        href="/checkout" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                        🏃 Continue as Guest
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage