import React from 'react'
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection from './HeroSection';
import ImagetoVideo from './ImagetoVideo';
import VideotoVideo from './VideotoVideo';
import TexttoVideo from './TexttoVideo';

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <ImagetoVideo/>
      <VideotoVideo/>
      <TexttoVideo/>
      <Footer/>
    </div>
  )
}
