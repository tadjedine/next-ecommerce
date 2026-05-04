"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Calendar, MapPin, ChevronDown } from "lucide-react";

function RegisterPage() {
    const router = useRouter();
    
    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    
    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        // if (!firstName.trim()) errors.firstName = "First name is required";
        if (!lastName.trim()) errors.lastName = "Last name is required";
        if (!email.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";
        
        if (!password) errors.password = "Password is required";
        else if (password.length < 8) errors.password = "Password must be at least 8 characters";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            errors.password = "Password must contain uppercase, lowercase, and number";
        }
        
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
        if (!dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!address.trim()) errors.address = "Address is required";
        if (!gender) errors.gender = "Please select a gender";
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ 
                    firstname: firstName.trim(),
                    lastname: lastName.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    password_confirmation: confirmPassword.trim(),
                    // dateOfBirth,
                    // address: address.trim(),
                    // gender
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to register");
            }

            console.log("Registration successful:", data);
            
            // Save token
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            
            // Redirect to home or verification page
            router.push('/');
            
        } catch (error) {
            console.error("Registration error:", error);
            setError(
                error instanceof Error 
                    ? error.message 
                    : "An unexpected error occurred. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center bg-gray-50 py-8">
            <div className="w-full md:w-[70%] lg:w-[55%] xl:w-[45%] 2xl:w-[40%]">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-CartRed">
                        🛍️ kwina
                    </Link>
                    <p className="text-gray-500 mt-2">Create your account and start shopping</p>
                </div>

                {/* Main Form */}
                <form 
                    onSubmit={handleSubmit}
                    className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-lg p-8 flex flex-col gap-5"
                >
                    {/* Global Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name Fields - Side by Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                First Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    id="firstName"
                                    type="text" 
                                    placeholder="John" 
                                    className={`w-full ring-1 rounded-md py-3 pl-10 pr-4 outline-none focus:ring-2 transition-all ${
                                        fieldErrors.firstName 
                                            ? 'ring-red-300 focus:ring-red-500' 
                                            : 'ring-gray-300 focus:ring-CartRed'
                                    }`}
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        // if (fieldErrors.firstName) {
                                        //     setFieldErrors(prev => ({...prev, firstName: ''}));
                                        // }
                                    }}
                                />
                            </div>
                            {fieldErrors.firstName && (
                                <span className="text-red-500 text-xs">{fieldErrors.firstName}</span>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                Last Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    id="lastName"
                                    type="text" 
                                    placeholder="Doe" 
                                    className={`w-full ring-1 rounded-md py-3 pl-10 pr-4 outline-none focus:ring-2 transition-all ${
                                        fieldErrors.lastName 
                                            ? 'ring-red-300 focus:ring-red-500' 
                                            : 'ring-gray-300 focus:ring-CartRed'
                                    }`}
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        if (fieldErrors.lastName) {
                                            setFieldErrors(prev => ({...prev, lastName: ''}));
                                        }
                                    }}
                                />
                            </div>
                            {fieldErrors.lastName && (
                                <span className="text-red-500 text-xs">{fieldErrors.lastName}</span>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address *
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                id="email"
                                type="email" 
                                placeholder="john@example.com" 
                                className={`w-full ring-1 rounded-md py-3 pl-10 pr-4 outline-none focus:ring-2 transition-all ${
                                    fieldErrors.email 
                                        ? 'ring-red-300 focus:ring-red-500' 
                                        : 'ring-gray-300 focus:ring-CartRed'
                                }`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) {
                                        setFieldErrors(prev => ({...prev, email: ''}));
                                    }
                                }}
                            />
                        </div>
                        {fieldErrors.email && (
                            <span className="text-red-500 text-xs">{fieldErrors.email}</span>
                        )}
                    </div>

                    {/* Password Fields - Side by Side on Desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters" 
                                    className={`w-full ring-1 rounded-md py-3 pl-10 pr-12 outline-none focus:ring-2 transition-all ${
                                        fieldErrors.password 
                                            ? 'ring-red-300 focus:ring-red-500' 
                                            : 'ring-gray-300 focus:ring-CartRed'
                                    }`}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) {
                                            setFieldErrors(prev => ({...prev, password: ''}));
                                        }
                                    }}
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
                            {fieldErrors.password && (
                                <span className="text-red-500 text-xs">{fieldErrors.password}</span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter password" 
                                    className={`w-full ring-1 rounded-md py-3 pl-10 pr-12 outline-none focus:ring-2 transition-all ${
                                        fieldErrors.confirmPassword 
                                            ? 'ring-red-300 focus:ring-red-500' 
                                            : 'ring-gray-300 focus:ring-CartRed'
                                    }`}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (fieldErrors.confirmPassword) {
                                            setFieldErrors(prev => ({...prev, confirmPassword: ''}));
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && (
                                <span className="text-red-500 text-xs">{fieldErrors.confirmPassword}</span>
                            )}
                        </div>
                    </div>

                    {/* Date of Birth and Gender - Side by Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date of Birth */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="dob" className="text-sm font-medium text-gray-700">
                                Date of Birth *
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    id="dob"
                                    type="date" 
                                    className={`w-full ring-1 rounded-md py-3 pl-10 pr-4 outline-none focus:ring-2 transition-all ${
                                        fieldErrors.dateOfBirth 
                                            ? 'ring-red-300 focus:ring-red-500' 
                                            : 'ring-gray-300 focus:ring-CartRed'
                                    }`}
                                    value={dateOfBirth}
                                    onChange={(e) => {
                                        setDateOfBirth(e.target.value);
                                        if (fieldErrors.dateOfBirth) {
                                            setFieldErrors(prev => ({...prev, dateOfBirth: ''}));
                                        }
                                    }}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            {fieldErrors.dateOfBirth && (
                                <span className="text-red-500 text-xs">{fieldErrors.dateOfBirth}</span>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                                Gender *
                            </label>
                            <div className="relative">
                                <select 
                                    id="gender"
                                    className={`w-full ring-1 rounded-md py-3 pl-4 pr-10 outline-none focus:ring-2 transition-all appearance-none bg-white ${
                                        fieldErrors.gender 
                                            ? 'ring-red-300 focus:ring-red-500' 
                                            : 'ring-gray-300 focus:ring-CartRed'
                                    } ${!gender ? 'text-gray-400' : 'text-gray-900'}`}
                                    value={gender}
                                    onChange={(e) => {
                                        setGender(e.target.value);
                                        if (fieldErrors.gender) {
                                            setFieldErrors(prev => ({...prev, gender: ''}));
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                            {fieldErrors.gender && (
                                <span className="text-red-500 text-xs">{fieldErrors.gender}</span>
                            )}
                        </div>
                    </div>

                    {/* Address Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="address" className="text-sm font-medium text-gray-700">
                            Address *
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea 
                                id="address"
                                placeholder="Enter your full address" 
                                rows={3}
                                className={`w-full ring-1 rounded-md py-3 pl-10 pr-4 outline-none focus:ring-2 transition-all resize-none ${
                                    fieldErrors.address 
                                        ? 'ring-red-300 focus:ring-red-500' 
                                        : 'ring-gray-300 focus:ring-CartRed'
                                }`}
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    if (fieldErrors.address) {
                                        setFieldErrors(prev => ({...prev, address: ''}));
                                    }
                                }}
                            />
                        </div>
                        {fieldErrors.address && (
                            <span className="text-red-500 text-xs">{fieldErrors.address}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-CartRed text-white rounded-md py-3 font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating account...
                            </>
                        ) : (
                            'Create Account →'
                        )}
                    </button>

                    {/* Sign In Link */}
                    <div className="text-sm text-center text-gray-500 mt-2">
                        Already have an account?{' '}
                        <Link href="/login" className="text-CartRed hover:text-red-700 font-semibold">
                            Sign In
                        </Link>
                    </div>
                </form>

                {/* Terms and Privacy */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-gray-600">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline hover:text-gray-600">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage