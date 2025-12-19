# 🚗 نظام إدارة المواقف الذكي | Smart Parking Management System

<div dir="rtl">

نظام متقدم لإدارة مواقف السيارات باستخدام الذكاء الاصطناعي والرؤية الحاسوبية، مبني بتقنيات Next.js و React.

</div>

## 🌐 Live Demo

- **Vercel**: [https://car-smart-park.vercel.app](https://car-smart-park.vercel.app) ⏳ *Ready to deploy*
- **GitHub Pages**: [https://husam05.github.io/car-smart-park/](https://husam05.github.io/car-smart-park/) ✅ *Currently live*

## ✨ Features | المميزات

<div dir="rtl">

- ✅ **خريطة المواقف التفاعلية** - 100 موقف عبر طابقين مع تحديثات فورية
- ✅ **المحاكاة التلقائية** - نظام محاكاة ذكي لحركة السيارات
- ✅ **بوابات ذكية** - نظام دخول وخروج تلقائي مع رسوم متحركة
- ✅ **كاميرات المراقبة** - كشف لوحات السيارات باستخدام الذكاء الاصطناعي
- ✅ **رموز QR** - إصدار تذاكر رقمية مع رموز QR
- ✅ **سجل الأحداث** - تتبع شامل لجميع عمليات الدخول والخروج
- ✅ **لوحة التحكم** - إدارة البوابات والمواقف
- ✅ **التقارير المالية** - تتبع الإيرادات والإحصائيات
- ✅ **واجهة عربية** - دعم كامل للغة العربية (RTL)

</div>

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **QR Codes**: react-qr-code
- **Backend**: Firebase (Firestore, Auth)

## 📁 Project Structure

```
car-smart-park/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main parking map page
│   ├── gates/             # Gate control panel
│   ├── cameras/           # Camera monitoring
│   ├── logs/              # Event logs
│   └── reports/           # Financial reports
├── components/            # React components
│   ├── ParkingMap.tsx    # Interactive parking grid
│   ├── EntryGate.tsx     # Entry gate animation
│   ├── ExitGate.tsx      # Exit gate animation
│   └── ...
├── context/              # React Context (ParkingContext)
├── lib/                  # Utilities and Firebase config
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. Visit [vercel.com](https://vercel.com)
2. Import repository: `husam05/car-smart-park`
3. Click "Deploy"
4. Done! Your app will be live at `car-smart-park.vercel.app`

**Detailed guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Deploy to GitHub Pages

The app is already configured for GitHub Pages deployment via GitHub Actions.

**Detailed guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎯 How to Use

<div dir="rtl">

### تشغيل المحاكاة
1. افتح التطبيق
2. اضغط على زر "تشغيل المحاكاة"
3. شاهد السيارات تدخل وتخرج تلقائياً

### التحكم اليدوي
1. انتقل إلى صفحة "البوابات"
2. استخدم أزرار التحكم لفتح/إغلاق البوابات
3. راقب حالة البوابات في الوقت الفعلي

### مراقبة الكاميرات
1. انتقل إلى صفحة "الكاميرات"
2. شاهد البث المباشر من كاميرات المراقبة
3. تتبع كشف لوحات السيارات

</div>

## 📊 Features Breakdown

| Feature | Status | Description |
|---------|--------|-------------|
| Parking Map | ✅ | 100 spots across 2 floors with real-time updates |
| Auto Simulation | ✅ | Intelligent car movement simulation |
| Entry/Exit Gates | ✅ | Automated gates with visual animations |
| Camera Feeds | ✅ | Simulated LPR (License Plate Recognition) |
| QR Codes | ✅ | Digital tickets with QR codes |
| Event Logs | ✅ | Comprehensive entry/exit tracking |
| Gate Controls | ✅ | Manual gate control panel |
| Financial Reports | ✅ | Revenue tracking and analytics |
| Payment Options | ✅ | Cash, Card, and App payment methods |

## 🔧 Configuration

The project automatically detects the deployment environment:

- **Vercel**: Uses SSR (Server-Side Rendering)
- **GitHub Pages**: Uses static export with basePath
- **Local**: Standard Next.js development mode

Configuration is handled in `next.config.ts`.

## 📝 License

This project is part of an academic assignment for the Artificial Intelligence course.

## 🤝 Contributing

This is an educational project. For suggestions or improvements, please open an issue.

## 📞 Support

For deployment help:
- **Vercel**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **GitHub Pages**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

<div align="center">

**Built with ❤️ using Next.js and React**

[Live Demo](https://husam05.github.io/car-smart-park/) | [Documentation](./DEPLOYMENT.md) | [Vercel Guide](./VERCEL_DEPLOYMENT.md)

</div>

