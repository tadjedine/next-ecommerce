import Slider from "../components/Slider"
import HeroSlider from "../components/HeroSlider"
import CategoryStrip from "../components/CategoryStrip"
import FeaturedProducts from "../components/FeaturedProducts"
import NewArrivals from "../components/NewArrivals"

const HomePage = () => {
  return (
    <div className=''>
      {/* <Slider/> */}
      <HeroSlider />
      <CategoryStrip />
      <FeaturedProducts />
      <NewArrivals/>
    </div>
  )
}

export default HomePage