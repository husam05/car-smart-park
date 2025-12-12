import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "موقف ذكي | لوحة التحكم",
  description: "نظام إدارة المواقف الذكي بالذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${cairo.className} antialiased bg-slate-950`}>
        {children}
      </body>
    </html>
  );
}
