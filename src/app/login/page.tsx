"use client";

import { Card, Typography } from "antd";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "var(--spacing-lg)",
        background: "var(--color-bg)",
      }}
    >
      <Card title="Iniciar sesión" style={{ width: 400, maxWidth: "100%" }}>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Accede con el correo y contraseña configurados en Supabase Auth.
        </Typography.Paragraph>
        <LoginForm />
      </Card>
    </div>
  );
}
