import { Button, Form, FormInstance, Input, notification, theme } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { sessionService } from "../services/session.service";
import { AxiosError, AxiosResponse } from "axios";
import { ILoginResponse } from "../interfaces/ISession";
import { useAuthStore } from "@/shared/context/auth";
import { useState } from "react";

export type LoginFormValues = {
  email: string;
  password: string;
};

export interface LoginFormProps {
  loginForm: FormInstance;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loginForm }) => {
  const { token } = theme.useToken();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginSubmit = async () => {
    const values = await loginForm.validateFields();

    if (loading || !values) return;

    setLoading(true);

    sessionService
      .login({ email: values.email, password: values.password })
      .then((res: AxiosResponse<ILoginResponse>) => {
        useAuthStore.getState().setUser({
          accessToken: res.data.login.token,
          refreshToken: res.data.login.refreshToken,
          userData: res.data.login.user,
        });

        router.push("/");
        notification.success({
          message: "Login realizado com sucesso!",
        });
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha no login",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha no login",
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Form
      form={loginForm}
      layout="vertical"
      onFinish={handleLoginSubmit}
      requiredMark={false}
    >
      <Form.Item
        name="email"
        rules={[
          { required: false, message: "Por favor, insira seu email" },
          { type: "email", message: "Email inválido" },
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-gray-400" />}
          placeholder="Email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: false, message: "Por favor, insira sua senha" },
          {
            min: 3,
            message: "A senha deve ter no mínimo 3 caracteres",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="Senha"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          style={{
            backgroundColor: token.colorPrimary,
          }}
        >
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
};
