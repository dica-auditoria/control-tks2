"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, Button, Space, Typography } from "antd";

import { signOut } from "@/app/auth/actions";

export default function Home() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <main
      style={{
        padding: "var(--spacing-lg)",
        minHeight: "100vh",
        background: "var(--color-bg)",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Typography.Title level={2} style={{ color: "var(--color-text)" }}>
            Control Interno
          </Typography.Title>
          <Typography.Paragraph style={{ color: "var(--color-text-muted)" }}>
            Sesión iniciada con Supabase Auth (email).
          </Typography.Paragraph>
        </div>
        {error ? (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            onClose={() => setError(null)}
          />
        ) : null}
        <div>
          <Button
            type="default"
            loading={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await signOut();
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.push("/login");
                router.refresh();
              });
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </Space>
    </main>
  );
}
