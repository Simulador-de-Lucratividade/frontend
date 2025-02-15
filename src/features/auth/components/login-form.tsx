import { Button, Form, FormInstance, Input, notification, theme } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import useAuthStore from "@/shared/context/auth";

export type LoginFormValues = {
  email: string;
  password: string;
};

export interface LoginFormProps {
  loginForm: FormInstance;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loginForm }) => {
  const { token } = theme.useToken();
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLoginSubmit = async () => {
    login();
    router.push("/");
    notification.success({
      message: "Login realizado com sucesso!",
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
            min: 6,
            message: "A senha deve ter no mínimo 6 caracteres",
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
