"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, Button, Form, Input } from "antd";

import { signInWithEmail } from "@/app/auth/actions";
import { mapAuthError } from "@/lib/auth/error-messages";

type LoginFields = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <Form<LoginFields>
      layout="vertical"
      requiredMark="optional"
      onFinish={(values) => {
        setError(null);
        startTransition(async () => {
          const result = await signInWithEmail({
            email: values.email,
            password: values.password,
          });
          if (!result.ok) {
            setError(mapAuthError(result.error));
            return;
          }
          router.push("/");
          router.refresh();
        });
      }}
      onValuesChange={() => setError(null)}
    >
      {error ? (
        <Alert
          type="error"
          message={error}
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Form.Item
        label="Correo electrónico"
        name="email"
        rules={[
          { required: true, message: "Ingresa tu correo" },
          { type: "email", message: "Correo no válido" },
        ]}
      >
        <Input autoComplete="email" inputMode="email" />
      </Form.Item>
      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: "Ingresa tu contraseña" }]}
      >
        <Input.Password autoComplete="current-password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={pending}>
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
}
