"use client";

import { cards } from "../data/cards";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { ActionCard } from "../components/action-card";
import { Section } from "@/features/dashboard/budgets/components/section";
import { DocumentList } from "../components/document-list";
import { useBudgets } from "../../budgets/hooks/useBudgets";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function HomeScreen() {
  const { budgets, budgetLoading } = useBudgets();

  return (
    <ProtectedRoute>
      <ApplicationLayout>
        {budgetLoading ? (
          <div className="flex items-center justify-center">
            <Spin indicator={<LoadingOutlined />} size="large" />
          </div>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-16 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {cards.map((card) => (
                <ActionCard
                  icon={card.icon}
                  key={card.id}
                  id={card.id}
                  redirect={card.redirect}
                  title={card.title}
                />
              ))}
            </div>
            <Section title="Todos os orçamentos">
              <div className="flex flex-col gap-2">
                <DocumentList documents={budgets} />
              </div>
            </Section>
          </div>
        )}
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
