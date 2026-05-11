"use client";
import { FadeUpOnScroll } from "./motion/FadeUpOnScroll";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import { HoverLift } from "./motion/HoverLift";
import { Star } from "lucide-react";
import Image from "next/image";
import { mockReviews } from "@/lib/mock/dummyData";

export default function Testimonials() {
  return (
    <div className="py-24 bg-surface border-y border-border-soft">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUpOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Loved by Our Customers</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Don't just take our word for it. See what people are saying about their experience.
          </p>
        </FadeUpOnScroll>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockReviews.map((review) => (
            <StaggerItem key={review.id}>
              <HoverLift className="h-full bg-surface border border-border-soft rounded-2xl p-8 flex flex-col">
                <div className="flex gap-1 mb-6 text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                  ))}
                </div>
                <p className="text-text-muted italic flex-grow text-lg leading-relaxed mb-8">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-border-soft">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-base relative">
                    <Image 
                      src={`https://ui-avatars.com/api/?name=${review.author}&background=2B7FFF&color=fff`} 
                      alt={review.author} 
                      fill 
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{review.author}</div>
                    <div className="text-xs text-text-muted">Verified buyer</div>
                  </div>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
