"use client"

import Link from "next/link";
import { useState } from "react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //  login logic 
        console.log(email, password);
    };

    return (
        <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form 
                onSubmit={handleSubmit}
                className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md p-8 flex flex-col gap-6 w-full md:w-[70%] lg:w-[50%] xl:w-[35%]"
            >
                <h1 className="text-2xl font-semibold text-center">Login</h1>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">Email Address</label>
                    <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="ring-1 ring-gray-300 rounded-md p-3 outline-none focus:ring-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-500">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        className="ring-1 ring-gray-300 rounded-md p-3 outline-none focus:ring-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="text-sm underline cursor-pointer self-end text-gray-500">
                    Forgot Password?
                </div>

                <button 
                    type="submit" 
                    className="bg-CartRed text-white rounded-md p-3 font-semibold mt-2"
                >
                    Sign In
                </button>

                <div className="text-sm text-center text-gray-500 mt-4">
                    Don&apos;t have an account? <Link href="/" className="underline text-black">Sign Up</Link>
                </div>
            </form>
        </div>
    )
}

export default LoginPage