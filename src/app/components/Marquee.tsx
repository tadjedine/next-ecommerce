export default function Marquee() {
  const items = [
    "Access All Workshops",
    "Website Development",
    "Image & Video Design",
    "Premium Resources",
    "Expert Support",
    "Weekly Updates"
  ];

  return (
    <div className="w-full border-y border-slate-100 bg-white overflow-hidden py-4 flex relative">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex shrink-0">
            {items.map((item, i) => (
              <div key={`${arrayIndex}-${i}`} className="flex items-center">
                <span className="text-sm font-semibold text-slate-gray uppercase tracking-widest px-8">
                  {item}
                </span>
                <span className="text-slate-300">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
