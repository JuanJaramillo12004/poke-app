import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { LoginDto } from "../types/auth.types";

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
    try {
      await login(values);
      navigate("/");
    } catch {
      // Los mensajes de error se muestran globalmente con sonner.
    }
  });

  return (
    <main className="page auth-page">
      <section className="card auth-card">
        <h1>Bienvenido</h1>
        <p className="muted">Inicia sesion para continuar.</p>

        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Correo
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && (
              <small className="error">{errors.email.message}</small>
            )}
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="********"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {errors.password && (
              <small className="error">{errors.password.message}</small>
            )}
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="muted">
          ¿No tienes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </section>
    </main>
  );
}
