import { Button, Form, FormInstance, Input, notification, theme } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import useAuthStore from "@/shared/context/auth";
import { useRouter } from "next/navigation";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface RegisterFormProps {
  registerForm: FormInstance;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ registerForm }) => {
  const router = useRouter();

  const { token } = theme.useToken();
  const { login } = useAuthStore();

  const handleRegisterSubmit = async () => {
    login();
    router.push("/");
    notification.success({
      message: "Registro realizado com sucesso!",
    });
  };

  return (
    <Form
      form={registerForm}
      layout="vertical"
      onFinish={handleRegisterSubmit}
      requiredMark={false}
    >
      <Form.Item
        name="name"
        rules={[{ required: false, message: "Por favor, insira seu nome" }]}
      >
        <Input
          prefix={<UserOutlined className="text-gray-400" />}
          placeholder="Nome completo"
          size="large"
        />
      </Form.Item>

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

      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: false, message: "Por favor, confirme sua senha" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("As senhas não coincidem"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="Confirmar senha"
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
          Cadastrar
        </Button>
      </Form.Item>
    </Form>
  );
};
