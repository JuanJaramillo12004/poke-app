import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AddFavoritePage } from "./pages/AddFavoritePage";
import { CatalogPage } from "./pages/CatalogPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EditFavoritePage } from "./pages/EditFavoritePage";
import { FavoriteDetailPage } from "./pages/FavoriteDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/favorites" element={<Navigate to="/" replace />} />
        <Route path="/favorites/new" element={<AddFavoritePage />} />
        <Route path="/favorites/:id" element={<FavoriteDetailPage />} />
        <Route path="/favorites/:id/edit" element={<EditFavoritePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
