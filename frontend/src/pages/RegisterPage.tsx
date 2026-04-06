import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/axios";
import { useAuth } from "../context/useAuth";
import type { RegisterDto } from "../types/auth.types";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterDto>({
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
      await registerUser(values);
      navigate("/");
    } catch (error: unknown) {
      setError("root", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  });

  return (
    <main className="page auth-page">
      <section className="card auth-card">
        <h1>Crear cuenta</h1>
        <p className="muted">Registra tus datos para comenzar.</p>

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
              placeholder="Minimo 8 caracteres"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              })}
            />
            {errors.password && (
              <small className="error">{errors.password.message}</small>
            )}
          </label>

          {errors.root && (
            <small className="error">{errors.root.message}</small>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="muted">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </section>
    </main>
  );
}
