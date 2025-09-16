import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

interface GoogleMapProps {
  location: string;
  eventName?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  location, 
  eventName = "Sự kiện",
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Encode location for URL
  const encodedLocation = encodeURIComponent(location);
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;
  // Use a simple Google Maps search embed
  const embedUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const openInGoogleMaps = () => {
    window.open(searchUrl, '_blank');
  };

  const getDirections = () => {
    window.open(directionsUrl, '_blank');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const refreshMap = () => {
    setIsLoading(true);
    // Force iframe reload
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div className={`w-full rounded-lg overflow-hidden relative bg-gray-800 transition-all duration-300 ${
        isExpanded ? 'h-96' : 'h-48'
      }`}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
            <div className="text-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-sm">Đang tải bản đồ...</p>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-2 right-2 z-20 flex space-x-2">
          <button
            onClick={refreshMap}
            className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition-colors"
            title="Làm mới bản đồ"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={toggleExpanded}
            className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition-colors"
            title={isExpanded ? "Thu nhỏ" : "Phóng to"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Google Maps Embed */}
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Bản đồ ${location}`}
          className="w-full h-full"
        />

        {/* Map Overlay Info */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-3 max-w-xs">
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <h4 className="text-white font-semibold text-sm">{eventName}</h4>
          </div>
          <p className="text-gray-300 text-xs">{location}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={getDirections}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          title="Chỉ đường"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Chỉ đường
        </button>
        <button
          onClick={openInGoogleMaps}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          title="Mở trong Google Maps"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Xem đầy đủ
        </button>
        <button
          onClick={toggleExpanded}
          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          title={isExpanded ? "Thu nhỏ" : "Phóng to"}
        >
          {isExpanded ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
          {isExpanded ? "Thu nhỏ" : "Phóng to"}
        </button>
      </div>

      {/* Location Info */}
      <div className="mt-2 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <span className="text-sm text-gray-300">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;
