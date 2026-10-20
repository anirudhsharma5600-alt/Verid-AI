import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vision Assistant",
  description: "AI-powered real-time obstacle avoidance, scene description, and voice navigation for the visually impaired.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vision Assistant",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full bg-black">
      <head>
        {/* Load TensorFlow.js and Coco-SSD from CDN for reliable client-side detection */}
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js" async></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3" async></script>
      </head>
      <body className="h-full bg-black text-white antialiased overflow-x-hidden selection:bg-yellow-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
