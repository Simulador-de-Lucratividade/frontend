"use client";

import { Card, Form, Segmented } from "antd";
import { useState } from "react";
import { LoginForm, LoginFormValues } from "../components/login-form";
import { RegisterForm, RegisterFormValues } from "../components/register-form";

type Align = "Login" | "Cadastro";

export default function AuthScreen() {
  const [alignValue, setAlignValue] = useState<Align>("Login");
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [registerForm] = Form.useForm<RegisterFormValues>();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card title={alignValue} className="w-full text-center max-w-[420px]">
        <div className="mb-6 flex justify-center">
          <Segmented
            value={alignValue}
            onChange={(value) => setAlignValue(value as Align)}
            options={["Login", "Cadastro"]}
            size="large"
          />
        </div>

        {alignValue === "Login" ? (
          <LoginForm loginForm={loginForm} />
        ) : (
          <RegisterForm registerForm={registerForm} />
        )}
      </Card>
    </div>
  );
}
