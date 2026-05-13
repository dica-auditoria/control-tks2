import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import AntdProvider from "@/components/providers/AntdProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Control Interno",
  description: "Sistema de administración interna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <AntdRegistry>
          <AntdProvider>{children}</AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
