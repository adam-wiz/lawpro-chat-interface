
import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

const Header = () => {
  return (
    <div className="w-full bg-white pb-12 pt-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-800 px-6 py-2 rounded-full text-sm font-medium">
            Professional Legal Services
          </div>
        </div>
        
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 mb-6 font-circular">
          Your Professional Legal Solution
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-600 text-center max-w-3xl mx-auto mb-16 font-circular">
          Expert legal guidance and attorney connections when you need them most.
        </p>
        
        {/* Icons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-5 rounded-full">
              <Shield className="h-8 w-8 text-blue-800" />
            </div>
            <span className="text-xl text-gray-700 font-circular">Privacy Protected</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-5 rounded-full">
              <CheckCircle className="h-8 w-8 text-blue-800" />
            </div>
            <span className="text-xl text-gray-700 font-circular">Clarity Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
