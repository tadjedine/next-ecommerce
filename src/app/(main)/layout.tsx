import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";
import { CartProvider } from "@/lib/CartContext";

export default function MainLayout({
    children,
}:{
    children: React.ReactNode
}){
    return(
        <CartProvider>
            <Navbar/>
            {children}
            <MantineProvider>
                <Footer/>
            </MantineProvider>
        </CartProvider>
    )
    
}