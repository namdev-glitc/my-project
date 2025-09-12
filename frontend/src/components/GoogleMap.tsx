import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

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
  // Encode location for URL
  const encodedLocation = encodeURIComponent(location);
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;

  const openInGoogleMaps = () => {
    window.open(searchUrl, '_blank');
  };

  const getDirections = () => {
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Preview */}
      <div className="w-full h-48 rounded-lg overflow-hidden relative bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-blue-400" />
          <h3 className="text-lg font-semibold text-white mb-2">{eventName}</h3>
          <p className="text-sm text-gray-300 mb-4">{location}</p>
          
          {/* Map Controls */}
          <div className="flex space-x-3 justify-center">
            <button
              onClick={getDirections}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Chỉ đường"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Chỉ đường
            </button>
            <button
              onClick={openInGoogleMaps}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Mở trong Google Maps"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem bản đồ
            </button>
          </div>
        </div>
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
