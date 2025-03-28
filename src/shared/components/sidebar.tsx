"use client";

import Link from "next/link";
import { Button, Drawer, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  ProductOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

interface SidebarProps {
  externalControl?: boolean;
  collapsedExternally?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link href="/">Início</Link>,
  },
  {
    key: "2",
    icon: <ProjectOutlined />,
    label: <Link href="/orcamentos">Orçamentos</Link>,
  },
  {
    key: "3",
    icon: <UserOutlined />,
    label: <Link href="/clientes">Clientes</Link>,
  },
  {
    key: "4",
    icon: <ProductOutlined />,
    label: <Link href="/produtos">Produtos</Link>,
  },
  {
    key: "5",
    icon: <AppstoreOutlined />,
    label: <Link href="/servicos">Serviços</Link>,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  externalControl = false,
  collapsedExternally = true,
  onCollapseChange,
  mobile = false,
  open = false,
  onClose,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(collapsedExternally);
  const pathname = usePathname();

  const getSelectedKey = () => {
    switch (pathname) {
      case "/":
        return "1";
      case "/orcamentos":
        return "2";
      case "/clientes":
        return "3";
      case "/produtos":
        return "4";
      case "/servicos":
        return "5";
      default:
        return "1";
    }
  };

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    if (onCollapseChange) {
      onCollapseChange(value);
    }
  };

  useEffect(() => {
    if (externalControl) {
      setCollapsed(collapsedExternally);
    }
  }, [collapsedExternally, externalControl]);

  const renderMenuContent = () => (
    <>
      <div
        className={`${
          collapsed && !mobile ? "py-8" : "p-4"
        } bg-white border-b border-borderSecondary flex flex-col gap-4`}
      >
        {!externalControl && !mobile && (
          <Button
            type="text"
            onClick={() => handleCollapse(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            className="w-full"
          />
        )}
        <h1
          className={`font-extrabold text-lg bg-white ${
            collapsed && !mobile && "hidden"
          }`}
        >
          Gerador de orçamentos
        </h1>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="border-none pt-4 h-full"
      />
    </>
  );

  if (mobile) {
    return (
      <Drawer
        placement="left"
        onClose={onClose}
        open={open}
        width={270}
        closable={false}
        style={{ padding: 0 }}
      >
        {renderMenuContent()}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      trigger={null}
      breakpoint="lg"
      className="h-screen left-0 top-0 bottom-0 border-r border-borderSecondary"
      collapsedWidth="80"
      width={270}
    >
      {renderMenuContent()}
    </Sider>
  );
};
