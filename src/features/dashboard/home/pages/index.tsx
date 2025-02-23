"use client";
import { cards } from "../data/cards";
import { ApplicationLayout } from "@/shared/components/application-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { ActionCard } from "../components/action-card";
import { Section } from "../../components/section";
import { documents } from "../data/all-documents";
import { DocumentList } from "../components/document-list";
import { DocumentCard } from "../../components/document-card";

export default function HomeScreen() {
  return (
    <ProtectedRoute>
      <ApplicationLayout>
        <div className="flex flex-col gap-8 sm:gap-16 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {cards.map((card) => (
              <ActionCard
                icon={card.icon}
                key={card.id}
                id={card.id}
                redirect=""
                title={card.title}
              />
            ))}
          </div>
          <Section title="Modificados recentemente">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DocumentCard
                id="1"
                title="Climatização do supermercado em Curitiba"
                datetime="15/02/2024 | 18:39"
              />
              <DocumentCard
                id="2"
                title="Climatização da igreja de XYZ"
                datetime="15/02/2024 | 18:39"
              />
            </div>
          </Section>
          <Section title="Todos os orçamentos">
            <div className="flex flex-col gap-2">
              <DocumentList documents={documents} />
            </div>
          </Section>
        </div>
      </ApplicationLayout>
    </ProtectedRoute>
  );
}
