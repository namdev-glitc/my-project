import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Mail, 
  Eye, 
  QrCode,
  Share2,
  Download,
  Send,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  Plus,
  Settings,
  Palette,
  Zap
} from 'lucide-react';
import { getGuests, getEvents } from '../services/api';
import QRCodeModal from '../components/guests/QRCodeModal';
import CountdownTimer from '../components/CountdownTimer';
import toast from 'react-hot-toast';

const API_BASE_URL = '';

const Invitations: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('elegant');
  const [showPreview, setShowPreview] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [bulkSelectedGuests, setBulkSelectedGuests] = useState<number[]>([]);
  const [eventTemplates, setEventTemplates] = useState<{[key: number]: string}>({});
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [templateCustomization, setTemplateCustomization] = useState({
    primaryColor: '#0B2A4A',
    accentColor: '#1E88E5',
    fontFamily: 'Segoe UI',
    borderRadius: '20px',
    shadowIntensity: '0.3'
  });


  const { data: guests, isLoading: guestsLoading } = useQuery('guests', getGuests);
  const { data: events, isLoading: eventsLoading } = useQuery('events', getEvents);

  // Auto-select first event if none selected
  useEffect(() => {
    if (events && events.length > 0 && !selectedEvent) {
      const firstEvent = events[0];
      setSelectedEvent(firstEvent);
      // Set elegant as default template for all events
      if (!eventTemplates[firstEvent.id]) {
        setEventTemplates(prev => ({
          ...prev,
          [firstEvent.id]: 'elegant'
        }));
        setSelectedTemplate('elegant');
      } else {
        setSelectedTemplate(eventTemplates[firstEvent.id]);
      }
    }
  }, [events, selectedEvent, eventTemplates]);

  // Update template when event changes - default to elegant if no template set
  useEffect(() => {
    if (selectedEvent) {
      if (eventTemplates[selectedEvent.id]) {
        setSelectedTemplate(eventTemplates[selectedEvent.id]);
      } else {
        // Set elegant as default template for new events
        setEventTemplates(prev => ({
          ...prev,
          [selectedEvent.id]: 'elegant'
        }));
        setSelectedTemplate('elegant');
      }
    }
  }, [selectedEvent, eventTemplates]);

  // Auto-preview when guest and event are selected
  useEffect(() => {
    if (selectedGuest && selectedEvent && showPreview) {
      generateInvitation(selectedGuest.id);
    }
  }, [selectedGuest, selectedEvent, showPreview]);

  const generateInvitation = async (guestId: number) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/invitations/generate/${guestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          event_id: selectedEvent?.id
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.already_exists) {
          const url = `${data.download_url || '/invitations/' + data.filename}`;
          window.open(url, '_blank');
          toast(`Thiệp mời đã tồn tại!`, { icon: 'ℹ️' });
        } else {
          setPreviewData(data);
          toast.success('Tạo thiệp mời thành công! ✨');
        }
      } else {
        toast.error('Lỗi tạo thiệp mời!');
      }
    } catch (error) {
      toast.error('Lỗi tạo thiệp mời!');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllInvitations = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/invitations/generate-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          event_id: selectedEvent?.id
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Đã tạo ${data.invitations.length} thiệp mời! 🎉`);
      } else {
        toast.error('Lỗi tạo thiệp mời!');
      }
    } catch (error) {
      toast.error('Lỗi tạo thiệp mời!');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkInvitations = async () => {
    if (bulkSelectedGuests.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khách mời!');
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/invitations/generate-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_ids: bulkSelectedGuests,
          template: selectedTemplate,
          event_id: selectedEvent?.id
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Đã tạo ${data.invitations.length} thiệp mời! 🚀`);
        setBulkSelectedGuests([]);
      } else {
        toast.error('Lỗi tạo thiệp mời!');
      }
    } catch (error) {
      toast.error('Lỗi tạo thiệp mời!');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadInvitation = async (guestId: number) => {
    try {
      const response = await fetch(`/api/invitations/download/${guestId}`);
      const data = await response.json();
      
      if (response.ok) {
        const link = document.createElement('a');
        link.href = `/invitations/${data.filename}`;
        link.download = data.filename;
        link.click();
        toast.success('Tải xuống thành công! 📥');
      } else {
        toast.error('Lỗi tải xuống!');
      }
    } catch (error) {
      toast.error('Lỗi tải xuống!');
    }
  };

  const sendInvitationEmail = async (guestId: number) => {
    try {
      const response = await fetch(`/api/invitations/send-email/${guestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate
        })
      });
      
      if (response.ok) {
        toast.success('Đã gửi email thiệp mời! 📧');
      } else {
        toast.error('Lỗi gửi email!');
      }
    } catch (error) {
      toast.error('Lỗi gửi email!');
    }
  };

  const toggleBulkSelection = (guestId: number) => {
    setBulkSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const selectAllGuests = () => {
    if (guests) {
      setBulkSelectedGuests(guests.map((guest: any) => guest.id));
    }
  };

  const clearBulkSelection = () => {
    setBulkSelectedGuests([]);
  };

  const updateEventTemplate = (eventId: number, template: string) => {
    setEventTemplates(prev => ({
      ...prev,
      [eventId]: template
    }));
    setSelectedTemplate(template);
    
    toast.success(`Đã cập nhật template cho sự kiện! 🎨`);
  };

  const previewTemplate = async () => {
    if (!selectedEvent) {
      toast.error('Vui lòng chọn sự kiện trước!');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch(`${API_BASE_URL}/api/invitations/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          event_id: selectedEvent.id,
          customization: templateCustomization
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewData(data);
        toast.success('Đã tạo preview template! 👁️');
      } else {
        toast.error('Lỗi tạo preview!');
      }
    } catch (error) {
      toast.error('Lỗi tải preview!');
    } finally {
      setIsGenerating(false);
    }
  };


  const templates = [
    { 
      id: 'elegant', 
      name: 'Thanh lịch (Mặc định)', 
      icon: '✨', 
      description: 'Thiết kế sang trọng - Mẫu hay dùng nhất',
      category: 'formal',
      colors: { primary: '#0B2A4A', accent: '#1E88E5' },
      isDefault: true
    },
    { 
      id: 'modern', 
      name: 'Hiện đại', 
      icon: '🚀', 
      description: 'Phong cách trẻ trung',
      category: 'tech',
      colors: { primary: '#2D3748', accent: '#4299E1' }
    },
    { 
      id: 'classic', 
      name: 'Cổ điển', 
      icon: '👔', 
      description: 'Truyền thống',
      category: 'traditional',
      colors: { primary: '#1A202C', accent: '#718096' }
    },
    { 
      id: 'festive', 
      name: 'Lễ hội', 
      icon: '🎉', 
      description: 'Vui tươi',
      category: 'celebration',
      colors: { primary: '#C53030', accent: '#F56565' }
    }
  ];

  const eventCategories = [
    { id: 'formal', name: 'Sự kiện trang trọng', icon: '👔' },
    { id: 'tech', name: 'Sự kiện công nghệ', icon: '💻' },
    { id: 'traditional', name: 'Sự kiện truyền thống', icon: '🏛️' },
    { id: 'celebration', name: 'Lễ kỷ niệm', icon: '🎊' }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-exp-gradient rounded-lg flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Thiệp mời</h1>
                <p className="text-gray-300">
                  Tạo và quản lý thiệp mời cá nhân hóa
                </p>
              </div>
            </div>
            {selectedEvent && (
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <div className="flex items-center space-x-2 text-blue-300">
                  <Calendar size={16} />
                  <span>{new Date(selectedEvent.event_date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center space-x-2 text-green-300">
                  <MapPin size={16} />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-300">
                  <Users size={16} />
                  <span>{guests?.filter((g: any) => g.event_id === selectedEvent.id).length || 0} khách mời</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Palette size={20} className="text-white" />
            </button>
            <button
              onClick={previewTemplate}
              className="btn-exp flex items-center space-x-2"
            >
              <Eye size={20} />
              <span>Xem mẫu</span>
            </button>
            <button
              onClick={generateAllInvitations}
              disabled={isGenerating || !selectedEvent}
              className="btn-exp flex items-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap size={20} />
              )}
              <span>Tạo tất cả</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Template Selection - Only show when event is selected */}
      {selectedEvent && (
        <div className="card-exp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Palette size={20} className="mr-2" />
              Mẫu thiệp mời cho: <span className="text-blue-400 ml-2">{selectedEvent.name}</span>
            </h3>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-400">
                Template hiện tại: <span className="text-white font-medium">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </span>
              </div>
              <button
                onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm flex items-center space-x-1"
              >
                <Settings size={14} />
                <span>Tùy chỉnh</span>
              </button>
            </div>
          </div>

          {/* Template Categories */}
          <div className="mb-4">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Zap size={16} className="mr-2" />
              Phân loại theo sự kiện
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {eventCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-center"
                >
                  <div className="text-lg mb-1">{category.icon}</div>
                  <div className="text-gray-300 text-xs">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  updateEventTemplate(selectedEvent.id, template.id);
                  // Update customization colors when template changes
                  setTemplateCustomization(prev => ({
                    ...prev,
                    primaryColor: template.colors.primary,
                    accentColor: template.colors.accent
                  }));
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-exp-gradient bg-exp-gradient/10 scale-105'
                    : template.isDefault
                    ? 'border-yellow-500 hover:border-yellow-400 bg-yellow-900/20 hover:scale-105'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:scale-105'
                }`}
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <div className="text-white font-medium flex items-center justify-center space-x-1">
                  <span>{template.name}</span>
                  {template.isDefault && (
                    <span className="text-yellow-400 text-xs">⭐</span>
                  )}
                </div>
                <div className="text-gray-400 text-xs">{template.description}</div>
                <div className="flex space-x-1 mt-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: template.colors.primary }}
                  ></div>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: template.colors.accent }}
                  ></div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="mt-2 text-xs text-blue-400 font-medium">✓ Đang sử dụng</div>
                )}
                {template.isDefault && selectedTemplate !== template.id && (
                  <div className="mt-2 text-xs text-yellow-400 font-medium">⭐ Mặc định</div>
                )}
              </button>
            ))}
          </div>

          {/* Template Editor */}
          {showTemplateEditor && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg">
              <h4 className="text-white font-medium mb-4 flex items-center">
                <Settings size={16} className="mr-2" />
                Tùy chỉnh template
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Màu chính</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={templateCustomization.primaryColor}
                      onChange={(e) => {
                        setTemplateCustomization(prev => ({
                          ...prev,
                          primaryColor: e.target.value
                        }));
                        // Auto preview when color changes
                        setTimeout(() => previewTemplate(), 100);
                      }}
                      className="w-12 h-8 rounded border border-gray-600"
                    />
                    <input
                      type="text"
                      value={templateCustomization.primaryColor}
                      onChange={(e) => {
                        setTemplateCustomization(prev => ({
                          ...prev,
                          primaryColor: e.target.value
                        }));
                        // Auto preview when color changes
                        setTimeout(() => previewTemplate(), 100);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      placeholder="#0B2A4A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Màu phụ</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={templateCustomization.accentColor}
                      onChange={(e) => {
                        setTemplateCustomization(prev => ({
                          ...prev,
                          accentColor: e.target.value
                        }));
                        // Auto preview when color changes
                        setTimeout(() => previewTemplate(), 100);
                      }}
                      className="w-12 h-8 rounded border border-gray-600"
                    />
                    <input
                      type="text"
                      value={templateCustomization.accentColor}
                      onChange={(e) => {
                        setTemplateCustomization(prev => ({
                          ...prev,
                          accentColor: e.target.value
                        }));
                        // Auto preview when color changes
                        setTimeout(() => previewTemplate(), 100);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      placeholder="#1E88E5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Font chữ</label>
                  <select
                    value={templateCustomization.fontFamily}
                    onChange={(e) => {
                      setTemplateCustomization(prev => ({
                        ...prev,
                        fontFamily: e.target.value
                      }));
                      // Auto preview when font changes
                      setTimeout(() => previewTemplate(), 100);
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Bo góc</label>
                  <select
                    value={templateCustomization.borderRadius}
                    onChange={(e) => {
                      setTemplateCustomization(prev => ({
                        ...prev,
                        borderRadius: e.target.value
                      }));
                      // Auto preview when border radius changes
                      setTimeout(() => previewTemplate(), 100);
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="0px">Không bo góc</option>
                    <option value="8px">Bo góc nhẹ</option>
                    <option value="12px">Bo góc vừa</option>
                    <option value="20px">Bo góc nhiều</option>
                    <option value="50%">Bo góc tròn</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTemplateEditor(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    toast.success('Đã lưu tùy chỉnh template! 🎨');
                    setShowTemplateEditor(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* Template Preview */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-900/50 to-teal-900/50 border border-green-500/30 rounded-lg">
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Eye size={16} className="mr-2" />
              Xem trước template
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview Controls */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => previewTemplate()}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                  >
                    <Eye size={16} />
                    <span>Xem mẫu</span>
                  </button>
                  <button
                    onClick={() => {
                      if (selectedGuest) {
                        generateInvitation(selectedGuest.id);
                      } else {
                        toast.error('Vui lòng chọn khách mời để xem preview!');
                      }
                    }}
                    disabled={!selectedGuest}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Sparkles size={16} />
                    <span>Preview với khách mời</span>
                  </button>
                </div>

                <div className="text-sm text-gray-300">
                  <p><strong>Template hiện tại:</strong> {templates.find(t => t.id === selectedTemplate)?.name}</p>
                  <p><strong>Màu chính:</strong> <span className="inline-block w-4 h-4 rounded-full ml-2" style={{backgroundColor: templateCustomization.primaryColor}}></span> {templateCustomization.primaryColor}</p>
                  <p><strong>Màu phụ:</strong> <span className="inline-block w-4 h-4 rounded-full ml-2" style={{backgroundColor: templateCustomization.accentColor}}></span> {templateCustomization.accentColor}</p>
                  <p><strong>Font:</strong> {templateCustomization.fontFamily}</p>
                  <p><strong>Bo góc:</strong> {templateCustomization.borderRadius}</p>
                </div>
              </div>

              {/* Preview Display */}
              <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                {previewData ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: previewData.html_content }}
                    style={{ 
                      fontFamily: templateCustomization.fontFamily,
                      transform: 'scale(0.8)',
                      transformOrigin: 'top left',
                      width: '125%'
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Eye size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nhấn "Xem mẫu" để xem trước template</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-blue-300">
              <Sparkles size={16} />
              <span>
                Template này sẽ được áp dụng cho tất cả thiệp mời của sự kiện <strong>{selectedEvent.name}</strong>
              </span>
            </div>
          </div>
          
          {selectedTemplate === 'elegant' && (
            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-yellow-300">
                <span className="text-yellow-400">⭐</span>
                <span>
                  <strong>Mẫu Thanh lịch (Mặc định)</strong> - Tên sự kiện sẽ tự động cập nhật khi bạn chọn sự kiện khác
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event Selection Reminder */}
      {!selectedEvent && (
        <div className="card-exp bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Vui lòng chọn sự kiện</h3>
              <p className="text-gray-300 text-sm">
                Bạn cần chọn sự kiện trước khi có thể chọn template và tạo thiệp mời
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Preview Section */}
      {previewData && (
        <div className="card-exp">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Xem trước thiệp mời
              </h3>
            </div>
            <div className="flex space-x-2">
              {selectedGuest && (
                <>
                  <button
                    onClick={() => downloadInvitation(selectedGuest.id)}
                    className="btn-exp flex items-center space-x-2"
                  >
                    <Download size={16} />
                    <span>Tải xuống</span>
                  </button>
                  <button
                    onClick={() => sendInvitationEmail(selectedGuest.id)}
                    className="btn-exp flex items-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Gửi email</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setPreviewData(null)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-2xl">
            <div 
              dangerouslySetInnerHTML={{ __html: previewData.html_content }}
              style={{ maxHeight: '600px', overflow: 'auto' }}
            />
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {bulkSelectedGuests.length > 0 && (
        <div className="card-exp bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Đã chọn {bulkSelectedGuests.length} khách mời
                </h3>
                <p className="text-gray-300 text-sm">
                  Tạo thiệp mời hàng loạt cho các khách mời đã chọn
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearBulkSelection}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                Bỏ chọn
              </button>
              <button
                onClick={generateBulkInvitations}
                disabled={isGenerating}
                className="btn-exp flex items-center space-x-2"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Mail size={16} />
                )}
                <span>Tạo thiệp mời</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Selection - Only show when event is selected */}
      {selectedEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Guests List */}
          <div className="card-exp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Users size={20} className="mr-2" />
              Chọn khách mời
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={selectAllGuests}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Chọn tất cả
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  showPreview 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {showPreview ? 'Tắt' : 'Bật'} Preview
              </button>
            </div>
          </div>
          
          {guestsLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {guests?.map((guest: any) => (
                <div
                  key={guest.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedGuest?.id === guest.id
                      ? 'bg-exp-gradient text-white border-exp-gradient'
                      : bulkSelectedGuests.includes(guest.id)
                      ? 'bg-purple-900/30 text-white border-purple-500'
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => {
                    setSelectedGuest(guest);
                    if (showPreview) {
                      generateInvitation(guest.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={bulkSelectedGuests.includes(guest.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleBulkSelection(guest.id);
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium flex items-center">
                          {guest.title} {guest.name}
                          {guest.rsvp_status === 'confirmed' && (
                            <CheckCircle size={16} className="ml-2 text-green-400" />
                          )}
                        </p>
                        <p className="text-sm opacity-75 flex items-center">
                          <MapPin size={12} className="mr-1" />
                          {guest.organization || 'Chưa có tổ chức'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateInvitation(guest.id);
                        }}
                        disabled={isGenerating}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Mail size={16} />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const invitationLink = `${window.location.origin}/invitation/${guest.id}`;
                          navigator.clipboard.writeText(invitationLink).then(() => {
                            toast.success(`Đã copy link thiệp mời của ${guest.name} 📋`);
                          }).catch(() => {
                            const textArea = document.createElement('textarea');
                            textArea.value = invitationLink;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            toast.success(`Đã copy link thiệp mời của ${guest.name} 📋`);
                          });
                        }}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Event Info */}
        <div className="card-exp">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar size={20} className="mr-2" />
            Thông tin sự kiện
          </h3>
          
          {eventsLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-24 bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {events?.map((event: any) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedEvent?.id === event.id
                      ? 'bg-exp-gradient text-white border-exp-gradient'
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg">{event.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs opacity-75">Active</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Calendar size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{new Date(event.event_date).toLocaleDateString('vi-VN')}</p>
                        <p className="text-xs opacity-75">{new Date(event.event_date).toLocaleTimeString('vi-VN')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                        <MapPin size={16} className="text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">{event.location}</p>
                        <p className="text-xs opacity-75">Địa điểm sự kiện</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">{guests?.filter((g: any) => g.event_id === event.id).length || 0} khách mời</p>
                        <p className="text-xs opacity-75">
                          {guests?.filter((g: any) => g.event_id === event.id && g.rsvp_status === 'confirmed').length || 0} đã xác nhận
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}


      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {selectedEvent ? 
              guests?.filter((g: any) => g.event_id === selectedEvent.id).length || 0 
              : guests?.length || 0
            }
          </div>
          <div className="text-gray-400 text-sm">
            {selectedEvent ? 'Khách mời sự kiện' : 'Tổng khách mời'}
          </div>
        </div>
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {selectedEvent ? 
              guests?.filter((g: any) => g.event_id === selectedEvent.id && g.rsvp_status === 'confirmed').length || 0
              : guests?.filter((g: any) => g.rsvp_status === 'confirmed').length || 0
            }
          </div>
          <div className="text-gray-400 text-sm">Đã xác nhận</div>
        </div>
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {bulkSelectedGuests.length}
          </div>
          <div className="text-gray-400 text-sm">Đã chọn</div>
        </div>
        <div className="card-exp text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {selectedTemplate ? 
              templates.find(t => t.id === selectedTemplate)?.icon || '🎨'
              : '🎨'
            }
          </div>
          <div className="text-gray-400 text-sm">
            Template {selectedEvent ? 'hiện tại' : ''}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && selectedGuest && (
        <QRCodeModal
          guest={selectedGuest}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Enhanced Template Info */}
      <div className="card-exp bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Sparkles size={20} className="mr-2" />
          Mẫu thiệp mời - Template: {selectedEvent ? templates.find(t => t.id === selectedTemplate)?.name : 'Chưa chọn'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Settings size={16} className="mr-2" />
              Tính năng nổi bật
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-900/20 border border-green-500/30">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-gray-300 text-xs">Thiết kế responsive, đẹp mắt</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <QrCode size={14} className="text-blue-400" />
                <span className="text-gray-300 text-xs">Tích hợp QR code check-in</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-purple-900/20 border border-purple-500/30">
                <Mail size={14} className="text-purple-400" />
                <span className="text-gray-300 text-xs">Nút RSVP trực tiếp</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-orange-900/20 border border-orange-500/30">
                <Calendar size={14} className="text-orange-400" />
                <span className="text-gray-300 text-xs">Thông tin sự kiện chi tiết</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Palette size={16} className="mr-2" />
              Tính năng mới
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-pink-900/20 border border-pink-500/30">
                <Settings size={14} className="text-pink-400" />
                <span className="text-gray-300 text-xs">Template Editor</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-teal-900/20 border border-teal-500/30">
                <Eye size={14} className="text-teal-400" />
                <span className="text-gray-300 text-xs">Real-time Preview</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-indigo-900/20 border border-indigo-500/30">
                <Zap size={14} className="text-indigo-400" />
                <span className="text-gray-300 text-xs">Template Categories</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-gray-300 text-xs">Custom Colors & Fonts</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Zap size={16} className="mr-2" />
              Workflow mới
            </h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-gray-700/50">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-gray-300 text-xs">Chọn sự kiện</span>
              </div>
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-gray-700/50">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="text-gray-300 text-xs">Chọn template</span>
              </div>
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-gray-700/50">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <span className="text-gray-300 text-xs">Tùy chỉnh</span>
              </div>
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-gray-700/50">
                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                <span className="text-gray-300 text-xs">Preview & Generate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invitations;


