import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulador de Lucratividade",
  description:
    "Gere seus orçamentos e simule a lucratividade de forma ráida e fácil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#0066cc",
              colorFillSecondary: "#ecf4ff",
              colorSuccess: "#00cc66",
              colorWarning: "#ff9933",
              colorError: "#ff3410",

              colorTextBase: "#333333",
              colorBgContainer: "#ffffff",
              colorBorderSecondary: "#e8e8e8",
              fontFamily: "var(--font-poppins)",
            },
            components: {
              Button: {
                defaultBg: "#0066cc",
                borderRadius: 12,
                defaultColor: "#ffffff",
                defaultBorderColor: "#0066cc",
                defaultHoverBg: "#0052a3",
                defaultHoverColor: "#ffffff",
                defaultHoverBorderColor: "#0052a3",
              },
              Menu: {
                itemBg: "#ffffff",
                itemColor: "#333333",
                itemSelectedBg: "#0052a3",
                itemSelectedColor: "#ffffff",
                itemMarginInline: 10,
                itemHoverBg: "#0051a34c",
              },
            },
          }}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
