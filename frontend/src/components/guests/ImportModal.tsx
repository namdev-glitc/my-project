import React, { useState } from 'react';
import { X, Upload, Download, FileText } from 'lucide-react';
import { importGuests } from '../../services/api';
import toast from 'react-hot-toast';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Chỉ hỗ trợ file CSV, Excel hoặc JSON');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file');
      return;
    }

    setIsLoading(true);
    try {
      await importGuests(file, 1); // Default event ID
      toast.success('Import thành công!');
      onClose();
      setFile(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi import!');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `title,name,role,organization,tag,email,phone
Mr,Nguyễn Văn A,CEO,Công ty ABC,ABC,nguyenvana@abc.com,0123456789
Mrs,Trần Thị B,CTO,Công ty XYZ,XYZ,tranthib@xyz.com,0987654321`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_guests.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Import danh sách khách mời
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                  dragActive
                    ? 'border-exp-primary bg-exp-primary bg-opacity-10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-white text-lg mb-2">
                  Kéo thả file vào đây hoặc
                </p>
                <label className="btn-exp cursor-pointer inline-flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Chọn file</span>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-400 text-sm mt-2">
                  Hỗ trợ: CSV, Excel (.xlsx, .xls), JSON
                </p>
              </div>

              {/* Selected File */}
              {file && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <FileText size={24} className="text-exp-primary" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Template Download */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Mẫu file CSV</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Tải về mẫu file CSV để tham khảo định dạng dữ liệu
                </p>
                <button
                  onClick={downloadTemplate}
                  className="btn-exp flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>Tải mẫu CSV</span>
                </button>
              </div>

              {/* Format Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Định dạng dữ liệu</h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>• <strong>title:</strong> Mr, Mrs, Dr, Prof. Dr</p>
                  <p>• <strong>name:</strong> Họ tên đầy đủ (bắt buộc)</p>
                  <p>• <strong>role:</strong> Chức vụ</p>
                  <p>• <strong>organization:</strong> Tên tổ chức</p>
                  <p>• <strong>tag:</strong> Mã nhóm</p>
                  <p>• <strong>email:</strong> Email</p>
                  <p>• <strong>phone:</strong> Số điện thoại</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className="btn-exp flex items-center space-x-2 sm:ml-3 sm:w-auto w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={20} />
              <span>{isLoading ? 'Đang import...' : 'Import'}</span>
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;




