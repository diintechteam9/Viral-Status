import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ImagetoVideo from './components/ImagetoVideo';
import VideotoVideo from './components/VideotoVideo';
import TexttoVideo from './components/TexttoVideo';
function App() {

  return (
    <>
      <Navbar/>
      <HeroSection/>
      <ImagetoVideo/>
      <VideotoVideo/>
      <TexttoVideo/>
      <Footer/>
    </>
  )
}

export default App
