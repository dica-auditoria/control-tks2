"use client";

import type { ReactNode } from "react";

import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: "#0F3C78",
          colorSuccess: "#1B873F",
          colorError: "#D93025",
          borderRadius: 6,
          fontFamily:
            "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
          colorBgLayout: "#F7F9FF",
          colorTextBase: "#1A1A2E",
        },
        components: {
          Layout: {
            siderBg: "#1A1A2E",
            headerBg: "#FFFFFF",
          },
          Menu: {
            darkItemBg: "#1A1A2E",
            darkItemSelectedBg: "#0F3C78",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
