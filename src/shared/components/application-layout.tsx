import { Avatar, Button, Dropdown } from "antd";
import { Sidebar } from "./sidebar";
import Layout, { Content, Header } from "antd/es/layout/layout";
import { ReactNode, useState } from "react";
import {
  FiChevronsRight,
  FiChevronsLeft,
  FiMenu,
  FiUser,
  FiBell,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { useMediaQuery } from "../hooks/use-media-query";
import { useAuthStore } from "../context/auth";

interface ApplicationLayoutProps {
  children: ReactNode;
}

export const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { logout } = useAuthStore();

  return (
    <Layout className="h-screen overflow-hidden">
      {isDesktop ? (
        <Sidebar
          externalControl
          collapsedExternally={collapsed}
          onCollapseChange={setCollapsed}
        />
      ) : (
        <Sidebar
          mobile
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
      <Layout className="flex flex-col">
        <Header className="bg-white flex items-center justify-between px-4 z-10">
          {isDesktop ? (
            <Button
              type="text"
              icon={
                collapsed ? (
                  <FiChevronsRight size={28} className="flex self-center" />
                ) : (
                  <FiChevronsLeft size={28} className="flex self-center" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              className="w-16"
            />
          ) : (
            <Button
              type="text"
              icon={<FiMenu size={24} />}
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center"
            />
          )}
          <div className="flex items-center gap-3 cursor-pointer">
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors">
                        <FiBell size={16} className="text-primary" />
                        <p>Notificações</p>
                      </div>
                    ),
                    key: "1",
                  },
                  {
                    label: (
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors">
                        <FiSettings size={16} className="text-primary" />
                        <p>Configurações</p>
                      </div>
                    ),
                    key: "2",
                  },
                  {
                    label: (
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors">
                        <FiUser size={16} className="text-primary" />
                        <p>Meu perfil</p>
                      </div>
                    ),
                    key: "3",
                  },
                  {
                    label: (
                      <div
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 border-t border-borderSecondary hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiLogOut size={16} className="text-red-500" />
                        <p className="text-red-500">Sair</p>
                      </div>
                    ),
                    key: "4",
                  },
                ],
              }}
            >
              <Button className="bg-transparent border-none text-black">
                <p>Olá, Adrian</p>
                <Avatar size={24} icon={<FiUser />} className="bg-primary" />
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="flex-1 overflow-auto">
          <div className="m-4 p-2 md:p-6 bg-white rounded-lg min-h-full">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
