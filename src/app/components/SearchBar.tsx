"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";


function SearchBar() {

    const router = useRouter();

    function handleSearch(e: React.FormEvent<HTMLFormElement>){

        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        if(name){
            router.push(`/list?name=${name}`);
        }
    }

    return (
        <form className="flex ic justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1" onSubmit={handleSearch}>
           <input type="text" placeholder="Search..." className="flex-1 bg-transparent outline-none" name="name"/> 
           <button className="cursor-pointer">
                <Image src="/search.png" alt="" height={16} width={16} />
           </button>
        </form>
    )
}

export default SearchBar
