# نظام إدارة المواقف الذكي

تطبيق ويب متقدم لإدارة مواقف السيارات باستخدام الذكاء الاصطناعي والرؤية الحاسوبية.

## خطوات النشر على GitHub Pages

### 1. تجهيز المشروع
```bash
cd web-app
npm install
npm run build
```

### 2. إعداد GitHub Repository
1. أنشئ repository جديد باسم `car-smart-park` على GitHub
2. ارفع جميع الملفات إلى الـ repository

### 3. تفعيل GitHub Pages
1. اذهب إلى Settings > Pages في الـ repository
2. اختر Source: GitHub Actions
3. سيتم النشر تلقائياً عند كل push للـ main branch

### 4. الوصول للتطبيق
التطبيق سيكون متاحاً على:
https://husam05.github.io/car-smart-park/

## الملفات المهمة للنشر

- `.github/workflows/deploy.yml` - إعدادات النشر التلقائي
- `web-app/next.config.ts` - إعدادات Next.js للتصدير الثابت
- `web-app/package.json` - سكريبت البناء والتصدير

## استكشاف الأخطاء

إذا واجهت مشاكل في النشر:

1. **تحقق من GitHub Actions**: اذهب إلى تبويب Actions في الـ repository
2. **راجع السجلات**: انظر لرسائل الخطأ في سجل البناء
3. **تأكد من الملفات**: تأكد أن جميع الملفات تم رفعها بشكل صحيح

## دعم

للمساعدة الإضافية، راجع:
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)