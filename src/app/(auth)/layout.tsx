import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kwina - YourStore',
    description: 'Sign in to your Kwina account',
}

export default function AuthLayout({
    children,
}:{
    children: React.ReactNode
}){
    return(
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    )
}