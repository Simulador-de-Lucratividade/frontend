"use client";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Card,
} from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";

const { Title } = Typography;
const { TextArea } = Input;

export default function NewBudgetScreen() {
  const [form] = Form.useForm();

  const onFinish = () => {};

  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <Space direction="vertical" size="large" className="w-full">
            <Title level={2}>Novo Orçamento</Title>

            <Card>
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
                      <DatePicker className="w-full" />
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
                      <DatePicker className="w-full" />
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
                      <InputNumber
                        formatter={(value) =>
                          `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value!.replace(/R\$\s?|(,*)/g, "")}
                        className="w-full"
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
                      <Select>
                        <Select.Option value="draft">Rascunho</Select.Option>
                        <Select.Option value="sent">Enviado</Select.Option>
                        <Select.Option value="approved">Aprovado</Select.Option>
                        <Select.Option value="rejected">
                          Rejeitado
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Space className="flex flex-col md:flex-row justify-between">
                    <Button
                      icon={<CloseOutlined />}
                      className="bg-transparent border-colorError text-colorError"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                    >
                      Salvar Orçamento
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Space>
        </div>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
