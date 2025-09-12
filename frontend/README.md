# Frontend - Hệ thống Quản lý Khách mời

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt
```bash
cd frontend
npm install
```

### Chạy Development
```bash
npm start
```

### Build Production
```bash
npm run build
```

## 🎨 Theme & Design

### EXP Techno Logy Theme
- **Primary Colors**: Cyan (#00bcd4) → Indigo (#3f51b5) → Magenta (#e91e63)
- **Background**: Dark blue gradient (#0a0e27 → #1a1f3a)
- **Typography**: Inter (body), Poppins (headings)
- **Components**: Glass morphism, gradient effects

### Key Features
- Responsive design (Mobile-first)
- Dark theme với gradient effects
- Glass morphism components
- Smooth animations và transitions
- Modern UI/UX patterns

## 📁 Cấu trúc

```
src/
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── dashboard/      # Dashboard components
│   └── guests/         # Guest management components
├── pages/              # Main pages
├── services/           # API services
├── styles/             # CSS/SCSS files
└── utils/              # Utility functions
```

## 🛠️ Tech Stack

- **React 18** với TypeScript
- **Tailwind CSS** cho styling
- **React Query** cho data fetching
- **React Router** cho routing
- **React Hook Form** cho forms
- **Recharts** cho charts
- **Lucide React** cho icons
- **React Hot Toast** cho notifications

## 🔧 Configuration

Copy `env.example` thành `.env` và cấu hình:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_NAME=Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm
REACT_APP_VERSION=1.0.0
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 Features

- ✅ Dashboard với thống kê
- ✅ Quản lý khách mời (CRUD)
- ✅ Import/Export CSV/Excel
- ✅ QR Code generation
- ✅ QR Scanner cho check-in
- ✅ Báo cáo và thống kê
- ✅ Cài đặt hệ thống
- ✅ Responsive design
- ✅ Dark theme







