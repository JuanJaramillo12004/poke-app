import { useAuth } from "../context/useAuth";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="page">
      <section className="card dashboard-card">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">Hola, {user?.email}</p>
          </div>
          <button type="button" onClick={logout}>
            Cerrar sesion
          </button>
        </header>

        <p>Commit 1 listo: auth flow y rutas protegidas.</p>
      </section>
    </main>
  );
}
