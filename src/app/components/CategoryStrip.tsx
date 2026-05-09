import Image from "next/image";
import Link from "next/link";
import { mockCategories } from "@/lib/mock/dummyData";

export default function CategoryStrip() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
      <div className="flex overflow-x-auto gap-6 pb-4 snap-x hide-scrollbar">
        {mockCategories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`} className="snap-start shrink-0 group flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100">
              <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 128px, 160px" />
            </div>
            <span className="font-medium text-sm md:text-base group-hover:underline">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}