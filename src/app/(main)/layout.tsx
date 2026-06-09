import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";


export default function MainLayout({
    children,
}:{
    children: React.ReactNode
}){
    return(
        <>
            <Navbar/>
            {children}
            <MantineProvider>
                <Footer/>
            </MantineProvider>
        </>
    )
    
}