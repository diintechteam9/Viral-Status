import React from "react";
import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#122442] to-[#0a1628] text-white py-16 px-6 md:px-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent mb-6">
              Viral Status
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A Complete AI Powered Video Editor Tool. Transforming ideas into reality with cutting-edge technology.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-400" />
                <a className="text-gray-300 hover:text-blue-400 transition-colors" href="tel:+91-9555070779">
                  +91-9555070779
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400" />
                <a className="text-gray-300 hover:text-blue-400 transition-colors" href="mailto:support@aitronix.in">
                  support@viralstatus.in
                </a>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="/home">Home</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="/about">About Us</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="/blogs">Blogs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Products</h3>
            <ul className="space-y-3">
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Studio Setup</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Microphones</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Camera Accessories</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Digital Boards</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Display Solution</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Smart Class Studio</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Wireless Microphone</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">MAXPRO 13 IFP</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Galaxy 13 IFP</a></li>
              <li><a className="text-gray-300 hover:text-blue-400 transition-colors" href="#">Alpha 13 Pro IFP</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 sm:mb-0">
              © 2025-26 Viral Status. All Rights Reserved
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a className="text-gray-400 hover:text-blue-400 transition-colors" href="#">Privacy Policy</a>
              <a className="text-gray-400 hover:text-blue-400 transition-colors" href="#">Shipping Policies</a>
              <a className="text-gray-400 hover:text-blue-400 transition-colors" href="#">Warranty Policy</a>
              <a className="text-gray-400 hover:text-blue-400 transition-colors" href="#">Terms & Conditions</a>
              <a className="text-gray-400 hover:text-blue-400 transition-colors" href="#">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}