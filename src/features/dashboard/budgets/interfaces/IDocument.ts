export interface Document {
  id?: string;
  title: string;
  datetime: string;
  status?: "draft" | "pending" | "approved";
}

export interface DocumentCardProps {
  title: string;
  datetime: string;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
}
