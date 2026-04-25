import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import ReservationsPage from "./pages/admin/ReservationsPage";
import InventoryPage from "./pages/admin/InventoryPage";
import MenuAdminPage from "./pages/admin/MenuAdminPage";
import ReportesAdminPage from "./pages/admin/ReportesAdminPage";
import NotFound from "./pages/NotFound";
import CocinaPage from "./pages/CocinaPage";
import CreateReservationPage from "./pages/CreateReservationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ReportesPage from "./pages/ReportesPage";
import ReportA from "./pages/admin/ReportA";
import IAPage from "./pages/admin/IAPage";
import IATestPage from "./pages/admin/IATestPage";
import ThemeToggle from "./components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeToggle />
      <BrowserRouter>
        <Routes>
          <Route
            path="/cocina"
            element={
              <ProtectedRoute>
                <CocinaPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservar" element={<CreateReservationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reportes" element={<ReportesPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="reservaciones" element={<ReservationsPage />} />
            <Route path="inventario" element={<InventoryPage />} />
            <Route path="menu" element={<MenuAdminPage />} />
            <Route path="reportes" element={<ReportesAdminPage />} />
            <Route path="reporta" element={<ReportA />} />
            <Route path="ia" element={<IAPage />} />
            <Route path="ia-test" element={<IATestPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;