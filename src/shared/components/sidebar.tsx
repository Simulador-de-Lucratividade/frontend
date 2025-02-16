"use client";

import { Button, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import {
  VideoCameraOutlined,
  HomeOutlined,
  UserOutlined,
  ProductOutlined,
  CustomerServiceOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  externalControl?: boolean;
  collapsedExternally?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  externalControl = false,
  collapsedExternally = true,
  onCollapseChange,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(collapsedExternally);

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
      <div
        className={`${
          collapsed ? "py-8" : "p-4"
        } bg-white border-b border-borderSecondary flex flex-col gap-4`}
      >
        {!externalControl && (
          <Button
            type="text"
            onClick={() => handleCollapse(!collapsed)}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined size={52} />
              ) : (
                <MenuFoldOutlined size={52} />
              )
            }
            className="w-full"
          />
        )}
        <h1
          className={`font-extrabold text-lg bg-fillSecondary ${
            collapsed && "hidden"
          }`}
        >
          Gerador de orçamentos
        </h1>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <HomeOutlined />,
            label: "Início",
          },
          {
            key: "2",
            icon: <VideoCameraOutlined />,
            label: "Orçamentos",
          },
          {
            key: "3",
            icon: <UserOutlined />,
            label: "Clientes",
          },
          {
            key: "4",
            icon: <ProductOutlined />,
            label: "Produtos",
          },
          {
            key: "5",
            icon: <CustomerServiceOutlined />,
            label: "Serviços",
          },
        ]}
        className="h-screen border-none pt-4"
      />
    </Sider>
  );
};
