import { ProtectedRoute } from "@/shared/components/protected-route";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="h-screen">
        <h1>hello world dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}
