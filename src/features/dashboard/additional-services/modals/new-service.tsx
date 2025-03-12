import { useCallback, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  notification,
} from "antd";
import Masks from "@/shared/utils/masks";
import { additionalServicesService } from "../services/services.service";
import { AxiosError, AxiosResponse } from "axios";
import { ICreateServiceResponse } from "../interface/IServices";

const { Title } = Typography;
const { TextArea } = Input;

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRefresh: () => void;
}

export const NewServiceModal = ({
  isOpen,
  onClose,
  serviceRefresh,
}: NewServiceModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleMoneyChange = useCallback(
    (value: string | number | null) => {
      if (value === null) return;
      const formattedValue = Masks.money(value.toString());
      form.setFieldsValue({ cost: formattedValue });
    },
    [form]
  );

  const parseMoney = (value: string): number => {
    return parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
  };

  const handleSubmit = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();

    if (loading || !values) return;

    setLoading(true);

    const parsedCost = parseMoney(values.cost);

    additionalServicesService
      .create({
        name: values.name,
        cost: parsedCost,
        description: values.description,
      })
      .then((res: AxiosResponse<ICreateServiceResponse>) => {
        notification.success({
          message: "Serviço cadastrado com sucesso",
          description: `O serviço ${res.data.service.name} foi cadastrado com sucesso!`,
        });
        onClose();
        serviceRefresh();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao cadastrar serviço",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao cadastrar o serviço",
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
    <Modal
      title={<Title level={4}>Novo Serviço</Title>}
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Cadastrar Serviço
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          category: "consulting",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Form.Item
              name="name"
              label="Nome do Serviço"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe o nome do serviço",
                },
              ]}
            >
              <Input placeholder="Nome do serviço" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="cost"
              label="Preço (R$)"
              rules={[
                { required: true, message: "Por favor, informe o preço" },
              ]}
            >
              <Input
                className="w-full"
                placeholder="R$ 0,00"
                onChange={(value) => handleMoneyChange(value.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            {
              required: true,
              message: "Por favor, informe a descrição do serviço",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Descreva os detalhes do serviço" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
