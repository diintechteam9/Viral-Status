import React from 'react';
import { FaUpload, FaVideo, FaMagic } from 'react-icons/fa';

const TexttoVideo = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent mb-4">
            Transform Text into Videos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your static images into engaging videos with our AI-powered technology. 
            Add motion, effects, and bring your content to life.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaUpload className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Upload</h3>
                  <p className="text-gray-600">
                    Simply upload your image and let our AI do the magic. Support for all major image formats.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <FaMagic className="text-pink-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Effects</h3>
                  <p className="text-gray-600">
                    Choose from a variety of motion effects and transitions to make your video stand out.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaVideo className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Preview</h3>
                  <p className="text-gray-600">
                    Preview your video in real-time and make adjustments until it's perfect.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Preview */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="/texttoimage.jpg"
                alt="Image to Video Preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Upload Button */}
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default TexttoVideo;
