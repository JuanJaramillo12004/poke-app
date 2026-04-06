import { useAuth } from "../context/useAuth";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-4 h-56 w-56 rounded-full bg-[var(--color-primary-soft)]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-6 h-48 w-48 rounded-full bg-[var(--color-border)]/60 blur-3xl" />

      <section className="relative w-full max-w-3xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-6 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.5)] sm:p-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Pokedex
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Hola, {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
          >
            Cerrar sesion
          </button>
        </header>

        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Flujo de autenticacion listo. Siguiente paso: integrar catalogo y
            CRUD de favoritos con vista tipo Pokedex.
          </p>
        </div>
      </section>
    </main>
  );
}
