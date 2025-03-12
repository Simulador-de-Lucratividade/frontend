import { Button, Form, FormInstance, Input, notification, theme } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sessionService } from "../services/session.service";
import { AxiosError, AxiosResponse } from "axios";
import { ILoginResponse } from "../interfaces/ISession";
import { useAuthStore } from "@/shared/context/auth";
import Masks from "@/shared/utils/masks";

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

  const [loading, setLoading] = useState<boolean>(false);

  const handleDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    let maskedValue = "";
    if (value.length <= 11) {
      maskedValue = Masks.cpf(value);
    } else {
      maskedValue = Masks.cnpj(value);
    }

    registerForm.setFieldValue("document", maskedValue);
  };

  const handleRegisterSubmit = async () => {
    const values = await registerForm.validateFields();

    if (loading || !values) return;

    setLoading(true);

    sessionService
      .register({
        name: values.name,
        email: values.email,
        password: values.password,
        document: values.document,
      })
      .then(() => {
        notification.success({
          message: "Registro realizado com sucesso!",
        });
        return sessionService.login({
          email: values.email,
          password: values.password,
        });
      })
      .then((res: AxiosResponse<ILoginResponse>) => {
        useAuthStore.getState().setUser({
          accessToken: res.data.login.token,
          refreshToken: res.data.login.refreshToken,
          userData: res.data.login.user,
        });

        router.push("/");
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha no registro",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha no registro",
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
        name="document"
        rules={[{ required: false, message: "Por favor, insira um documento" }]}
      >
        <Input
          prefix={<UserOutlined className="text-gray-400" />}
          placeholder="Documento (CPF ou CNPJ)"
          size="large"
          onChange={handleDocument}
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
