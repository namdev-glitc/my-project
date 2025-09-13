import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building, Shield, Users, ArrowRight } from 'lucide-react';
import ExpLogoImage from '../components/ExpLogoImage';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex border-0 outline-none relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-orange-900/10"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl"></div>
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-center p-12 border-0 outline-none relative z-10">
        <div className="max-w-lg">
          {/* Logo Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="animate-bounce">
                <ExpLogoImage size="xs" showText={false} />
              </div>
              <div>
                <h1 className="text-gray-400 text-lg font-bold mb-1 tracking-wide">EXP TECHNOLOGY</h1>
                <p className="text-gray-500 text-xs font-medium">Company Limited</p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-4 tracking-wide whitespace-nowrap bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]">
              Chào mừng đến với EXP Technology
            </h2>
            
            <p className="text-gray-300 text-base mb-6 leading-relaxed font-normal">
              Truy cập tài khoản để quản lý <span className="text-blue-400 font-semibold">AI</span>, <span className="text-purple-400 font-semibold">Blockchain</span> và <span className="text-orange-400 font-semibold">Giải pháp số</span> cho doanh nghiệp của bạn.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-2">
            <div className="flex items-start p-2 rounded-lg border-0 outline-none ring-0 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 border-0 outline-none ring-0 shadow-lg shadow-blue-500/50 group-hover:rotate-12 transition-transform duration-300">
                <Building className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 text-xs bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Giải pháp doanh nghiệp</h3>
                <p className="text-white text-xs leading-tight font-normal">
                  Tự động hóa kinh doanh bằng AI và ứng dụng blockchain.
                </p>
              </div>
            </div>

            <div className="flex items-start p-2 rounded-lg border-0 outline-none ring-0 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 border-0 outline-none ring-0 shadow-lg shadow-blue-500/50">
                <Shield className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 text-xs bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Truy cập an toàn</h3>
                <p className="text-white text-xs leading-tight font-normal">
                  Bảo mật cấp độ ngân hàng với xác thực đa yếu tố.
                </p>
              </div>
            </div>

            <div className="flex items-start p-2 rounded-lg border-0 outline-none ring-0 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 border-0 outline-none ring-0 shadow-lg shadow-blue-500/50">
                <Users className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 text-xs bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Hỗ trợ toàn cầu</h3>
                <p className="text-white text-xs leading-tight font-normal">
                  Hỗ trợ kỹ thuật 24/7 tại Việt Nam và khu vực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center p-8 border-0 outline-none relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3">
              <ExpLogoImage size="md" showText={false} />
              <div>
                <h1 className="text-white text-xl font-bold mb-1 tracking-wide">EXP TECHNOLOGY</h1>
                <p className="text-gray-300 text-sm font-medium">Company Limited</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Chào mừng trở lại</h2>
            <p className="text-gray-300 font-normal">Nhập thông tin đăng nhập để truy cập tài khoản</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} onKeyPress={handleKeyPress} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200 hover:border-blue-400 focus:bg-gray-700"
                  placeholder="Nhập email của bạn"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-400"
                  placeholder="Nhập mật khẩu của bạn"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-blue-400 hover:text-blue-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-normal">
                Quên mật khẩu?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg animate-pulse hover:animate-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'ĐĂNG NHẬP'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Chưa có tài khoản?{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
                Đăng ký
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 EXP Technology Co., Ltd. All rights reserved.
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-400">Chính sách bảo mật</a>
              <span className="mx-2">•</span>
              <a href="#" className="hover:text-gray-400">Điều khoản dịch vụ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
