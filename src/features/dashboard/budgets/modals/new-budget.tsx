import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import Masks from "@/shared/utils/masks";
import { useCallback } from "react";

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBudgetModal: React.FC<NewBudgetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();

  const handleMoneyChange = useCallback(
    (value: string | number | null) => {
      if (value === null) return;
      const formattedValue = Masks.money(value.toString());
      form.setFieldsValue({ totalAmount: formattedValue });
    },
    [form]
  );

  const onFinish = () => {};

  return (
    <Modal open={isOpen} onClose={onClose} closeIcon={null} footer={null}>
      <Space
        direction="vertical"
        size="large"
        className="w-full flex items-center justify-center"
      >
        <Card className="max-w-6xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="clientName"
                  label="Nome do Cliente"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira o nome do cliente",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="projectName"
                  label="Nome do Projeto"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira o nome do projeto",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="budgetDate"
                  label="Data do Orçamento"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, selecione a data",
                    },
                  ]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Selecione uma data"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="validUntil"
                  label="Válido Até"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, selecione a data de validade",
                    },
                  ]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Selecione uma data"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Descrição do Projeto"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira a descrição do projeto",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="totalAmount"
                  label="Valor Total"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira o valor total",
                    },
                  ]}
                >
                  <Input
                    className="w-full"
                    placeholder="R$ 0,00"
                    onChange={(value) => handleMoneyChange(value.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, selecione o status",
                    },
                  ]}
                >
                  <Select defaultValue={"sent"}>
                    <Select.Option value="draft">Rascunho</Select.Option>
                    <Select.Option value="sent">Enviado</Select.Option>
                    <Select.Option value="approved">Aprovado</Select.Option>
                    <Select.Option value="rejected">Rejeitado</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space className="flex flex-col md:flex-row justify-between">
                <Button
                  icon={<CloseOutlined />}
                  className="bg-transparent border-colorError text-colorError"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  onClick={onClose}
                >
                  Salvar Orçamento
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Modal>
  );
};
