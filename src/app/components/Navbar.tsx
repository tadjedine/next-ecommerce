import Link from "next/link"
import Menu from "./Menu"
import Image from "next/image"
import SearchBar from "./SearchBar"
import NavIcons from "./NavIcons"

function Navbar() {
    return (
        <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px64 relative">
            <div className=" h-full flex items-center justify-between md:hidden">
                {/* Mobile */}
                <Link href= "/" className="text-2xl tracking-wide"> Homepage </Link>
                <Menu/>
            </div>
            {/* BIGGER SCREENS */}
            <div className="hidden md:flex items-center justify-between gap-8 h-full">

                {/* LEFT */}
                <div className="w-1/3 xl:w-1/2">

                    <Link href="/" className="flex items-center gap-3"> 
                        <Image src="/logo.png" alt="" height={24} width={24}/> 
                        <div className="text-2xl tracking-wide">Store</div>
                    </Link>
                    <div className="hidden xl:flex gap-4">
                        <Link href="/">Homepage</Link>
                        <Link href="/">Shop</Link>
                        <Link href="/">Deals</Link>
                        <Link href="/">about</Link>
                        <Link href="/">Cart(1)</Link>
                        <Link href="/">Logout</Link>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-2/3 flex items-center justify-between gap-8 xl:w-1/2">
                    <SearchBar/>
                    <NavIcons/>
                </div>
            </div>
        </div>
    )
}

export default Navbar
