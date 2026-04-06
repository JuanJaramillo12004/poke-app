import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { LoginDto } from "../types/auth.types";

// Page component: handles screen-level layout, actions, and data flow.
export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    // Surface request failures to the user with clear feedback.
    try {
      await login(values);
      navigate("/");
    } catch {
      // Los mensajes de error se muestran globalmente con sonner.
    }
  });

  // Render LoginPage for the current state.
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-10">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[var(--color-primary-soft)]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[var(--color-border)]/60 blur-3xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-6 shadow-[0_18px_45px_-25px_rgba(15,23,42,0.5)] sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
            <span className="block h-4 w-4 rounded-full bg-[var(--color-primary)]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Pokedex
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
              Iniciar sesion
            </h1>
          </div>
        </div>

        <p className="mb-6 text-sm text-[var(--color-muted)]">
          Accede a tu coleccion de favoritos.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            Correo
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && (
              <small className="mt-1 block text-xs font-medium text-[var(--color-primary-strong)]">
                {errors.email.message}
              </small>
            )}
          </label>

          <label className="block text-sm font-medium text-[var(--color-text)]">
            Contraseña
            <input
              type="password"
              placeholder="********"
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {errors.password && (
              <small className="mt-1 block text-xs font-medium text-[var(--color-primary-strong)]">
                {errors.password.message}
              </small>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--color-muted)]">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-[var(--color-primary-strong)] hover:text-[var(--color-primary)]"
          >
            Registrate
          </Link>
        </p>
      </section>
    </main>
  );
}
