import { useCallback, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  notification,
  Spin,
} from "antd";
import Masks from "@/shared/utils/masks";
import { additionalServicesService } from "../services/services.service";
import { AxiosError, AxiosResponse } from "axios";
import { ICreateServiceResponse, IService } from "../interface/IServices";

const { Title } = Typography;
const { TextArea } = Input;

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRefresh: () => void;
  service: IService | undefined;
}

export const EditServiceModal = ({
  isOpen,
  onClose,
  serviceRefresh,
  service,
}: EditServiceModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingService, setFetchingService] = useState(false);

  const fetchServiceData = async () => {
    setFetchingService(true);
    try {
      form.setFieldsValue({
        name: service?.name,
        cost: service?.cost ? Masks.money(service.cost.toString()) : "",
        description: service?.description,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        notification.error({
          message: "Falha ao carregar dados do serviço",
          description: errorMessage,
        });
      } else {
        notification.error({
          message: "Falha ao carregar dados do serviço",
          description:
            "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        });
      }
      onClose();
    } finally {
      setFetchingService(false);
    }
  };

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

    if (loading || !values || !service) return;

    setLoading(true);

    const parsedCost = parseMoney(values.cost);

    additionalServicesService
      .update(service.id, {
        name: values.name,
        cost: parsedCost,
        description: values.description,
      })
      .then((res: AxiosResponse<ICreateServiceResponse>) => {
        notification.success({
          message: "Serviço atualizado com sucesso",
          description: `O serviço ${res.data.service.name} foi atualizado com sucesso!`,
        });
        onClose();
        serviceRefresh();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || error.message;
          notification.error({
            message: "Falha ao atualizar serviço",
            description: errorMessage,
          });
        } else {
          notification.error({
            message: "Falha ao atualizar o serviço",
            description:
              "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen && service) {
      fetchServiceData();
    }
  }, [isOpen, service]);

  return (
    <Modal
      title={<Title level={4}>Editar Serviço</Title>}
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
          Atualizar Serviço
        </Button>,
      ]}
    >
      {fetchingService ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Carregando dados do serviço..." />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={32}>
              <Form.Item
                name="name"
                label="Nome do Serviço"
                rules={[
                  {
                    required: true,
                    message: "Por favor, informe o nome do serviço",
                  },
                ]}
                className="w-full"
              >
                <Input placeholder="Nome do serviço" className="h-10 w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={32}>
              <Form.Item
                name="cost"
                label="Preço (R$)"
                rules={[
                  { required: true, message: "Por favor, informe o preço" },
                ]}
                className="w-full"
              >
                <Input
                  className="w-full h-10"
                  placeholder="R$ 0,00"
                  onChange={(e) => handleMoneyChange(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <TextArea rows={4} placeholder="Descreva os detalhes do serviço" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
