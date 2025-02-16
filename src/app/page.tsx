import HomeScreen from "@/features/dashboard/home/pages";
import { ProtectedRoute } from "@/shared/components/protected-route";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  );
}
