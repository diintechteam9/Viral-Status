import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function HeroSection() {
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    fade: true,
    pauseOnHover: true,
  };

  return (
    <section className="py-8 px-4 pt-30">
      <div className="max-w-4xl mx-auto text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Create Viral Status In Few Clicks
        </h1>
        <p className="text-lg text-gray-600">
          Transform your ideas into engaging content that resonates with your audience
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4">
        <Slider {...settings}>
          <div className="px-2">
            <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src="/caro2.jpg"
                alt="Creative content creation"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="px-2">
            <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src="/caro2.jpg"
                alt="Social media engagement"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="px-2">
            <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src="/caro4.jpg"
                alt="Content strategy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </Slider>
      </div>
    </section>
  );
}




