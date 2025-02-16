import { Button } from "antd";
import { Sidebar } from "./sidebar";
import Layout, { Content, Header } from "antd/es/layout/layout";
import { ReactNode, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

interface ApplicationLayoutProps {
  children: ReactNode;
}

export const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <Layout className="fixed w-full">
      <Sidebar
        externalControl
        collapsedExternally={collapsed}
        onCollapseChange={setCollapsed}
      />
      <Layout>
        <Header className="bg-white">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="w-16"
          />
        </Header>
        <Content className="m-4 p-6 bg-white rounded-lg">{children}</Content>
      </Layout>
    </Layout>
  );
};
