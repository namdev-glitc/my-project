import React from 'react';
import { CheckCircle, Star, Heart, Crown, Sparkles, Gift } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  category: string;
  preview: string;
  colors: string[];
  fonts: string[];
  isPremium?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

interface TemplateGalleryProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'luxury': return <Crown className="text-yellow-400" size={16} />;
      case 'modern': return <Sparkles className="text-blue-400" size={16} />;
      case 'classic': return <Star className="text-purple-400" size={16} />;
      case 'casual': return <Heart className="text-pink-400" size={16} />;
      default: return <Gift className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Formal', 'Modern', 'Classic', 'Business', 'Casual', 'Luxury'].map((category) => (
          <button
            key={category}
            className="px-3 py-1.5 text-sm rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-blue-500/50'
                : ''
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            {/* Template Preview */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden mb-4">
              {/* Template Preview Content */}
              <div 
                className="w-full h-full p-6 flex flex-col justify-center items-center text-center"
                style={{
                  background: `linear-gradient(135deg, ${template.colors[0]}20, ${template.colors[1]}20)`,
                  color: template.colors[0]
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4 flex items-center justify-center">
                  <Crown className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: template.fonts[0] }}>
                  Sample Event
                </h3>
                <p className="text-sm opacity-80">Event Details</p>
              </div>

              {/* Overlay Effects */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              
              {/* Selection Indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-1">
                {template.isPremium && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                    Premium
                  </span>
                )}
                {template.isPopular && (
                  <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-semibold rounded-full">
                    Popular
                  </span>
                )}
                {template.isNew && (
                  <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Template Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">{template.name}</h4>
                {getCategoryIcon(template.category)}
              </div>
              <p className="text-gray-400 text-sm">{template.category}</p>
              
              {/* Color Palette */}
              <div className="flex space-x-1">
                {template.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Font Preview */}
              <div className="text-xs text-gray-400" style={{ fontFamily: template.fonts[0] }}>
                {template.fonts[0]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200">
          Xem thêm mẫu
        </button>
      </div>
    </div>
  );
};

export default TemplateGallery;



