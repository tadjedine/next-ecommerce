import HeroSlider from "../components/HeroSlider";
import Marquee from "../components/Marquee";
import BrowseCategories from "../components/BrowseCategories";
import OurProducts from "../components/OurProducts";
import PromoBanner from "../components/PromoBanner";
import FeatureCards from "../components/FeatureCards";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import TrustBar from "../components/TrustBar";
import CtaBanner from "../components/CtaBanner";
import { PageTransition } from "../components/motion/PageTransition";

const HomePage = () => {
  return (
    <PageTransition className="min-h-screen bg-bg-base">
      <HeroSlider />
      <Marquee />
      <BrowseCategories />
      <OurProducts />
      <PromoBanner />
      <FeatureCards />
      <Testimonials />
      <Newsletter />
      <TrustBar />
      <CtaBanner />
    </PageTransition>
  )
}

export default HomePage