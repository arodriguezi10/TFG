import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

const LoginDesktop = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleLogin = async () => {
    let emailErr = "";
    let passwordErr = "";

    if (!email) emailErr = "El email es requerido";
    else if (!validateEmail(email)) emailErr = "Por favor ingresa un email válido";

    if (!password) passwordErr = "La contraseña es requerida";
    else if (!validatePassword(password)) passwordErr = "La contraseña debe tener al menos 6 caracteres";

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    if (emailErr || passwordErr) return;

    const { error } = await loginUser(email, password);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setPasswordError("Email o contraseña incorrectos");
      } else if (error.message.includes("Email not confirmed")) {
        setEmailError("Por favor confirma tu email antes de iniciar sesión");
      } else {
        setEmailError("Error al iniciar sesión. Intenta de nuevo");
      }
    } else {
      navigate("/dashboard");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* LADO IZQUIERDO — visual */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a26 50%, #0f0f1a 100%)" }}
      >
        {/* Gradiente decorativo */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-25 -left-25 w-100 h-100 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6c63ff, transparent)" }} />
          <div className="absolute -top-25 -right-25 w-87.75 h-87.75 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #ff6b9d, transparent)" }} />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-4 z-10">
          <div className="bg-primary h-14 w-14 rounded-xl flex items-center justify-center font-heading font-extrabold text-[28px] text-text-high">
            F
          </div>
          <span className="font-heading font-extrabold text-[28px] text-text-high">FYLIOS</span>
        </div>

        {/* Contenido central */}
        <div className="z-10">
          <span className="inline-flex bg-surf border border-primary rounded-full px-4 py-1 font-subheading font-bold text-[14px] text-primary mb-6">
            ◆ Tu plataforma de entrenamiento
          </span>
          <h2 className="font-heading font-extrabold text-[48px] text-text-high leading-tight mb-4">
            Entrena más.<br />
            Progresa <span className="text-primary">mejor.</span>
          </h2>
          <p className="font-body text-[16px] text-text-low leading-relaxed max-w-md">
            Gestiona tus rutinas, analiza tu progreso y alcanza tus objetivos con la plataforma de entrenamiento más completa.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { value: "10k+", label: "Atletas activos" },
              { value: "500+", label: "Rutinas creadas" },
              { value: "98%", label: "Satisfacción" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading font-extrabold text-[28px] text-primary leading-none">{stat.value}</p>
                <p className="font-body text-[13px] text-text-low mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer izquierdo */}
        <p className="font-body text-[12px] text-text-low z-10">
          © 2026 FYLIOS. Todos los derechos reservados.
        </p>
      </div>

      {/* LADO DERECHO — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">

          {/* Header formulario */}
          <div className="mb-8">
            <span className="inline-flex bg-surf border border-primary rounded-full px-3 py-0.5 font-subheading font-bold text-[13px] text-primary mb-4">
              ◆ Acceso seguro
            </span>
            <h1 className="font-heading font-extrabold text-[36px] text-text-high leading-tight">
              Bienvenido de<span className="text-primary"> vuelta</span>
            </h1>
            <p className="font-body text-[15px] text-text-low mt-2">
              Inicia sesión para continuar donde lo dejaste
            </p>
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-2 block">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-surf border border-text-low rounded-xl px-4 py-3.5 font-body text-[15px] text-text-high outline-none focus:border-primary transition-colors placeholder:text-text-low/50"
            />
            {emailError && (
              <p className="font-body text-[13px] text-red mt-1.5">⚠️ {emailError}</p>
            )}
          </div>

          {/* CONTRASEÑA */}
          <div className="mb-2 relative">
            <label className="font-subheading font-bold text-[13px] text-text-low uppercase tracking-wide mb-2 block">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-surf border border-text-low rounded-xl px-4 py-3.5 font-body text-[15px] text-text-high outline-none focus:border-primary transition-colors placeholder:text-text-low/50 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-text-low hover:text-text-high transition-colors text-[18px]"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
            {passwordError && (
              <p className="font-body text-[13px] text-red mt-1.5">{passwordError}</p>
            )}
          </div>

          {/* RECORDAR Y OLVIDÉ */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <input type="checkbox" className="w-4 h-4 accent-primary" />
              <p className="font-body text-[14px] text-text-low">Recuérdame</p>
            </div>
            <button
              onClick={() => navigate("/forgotPassword")}
              className="font-body text-[14px] text-primary hover:opacity-80 transition-opacity"
            >
              ¿Olvidaste la contraseña?
            </button>
          </div>

          {/* BOTON LOGIN */}
          <button
            onClick={handleLogin}
            className="w-full bg-primary border border-primary rounded-xl py-3.5 font-heading font-bold text-[16px] text-text-high hover:opacity-90 transition-opacity mb-4"
          >
            Iniciar sesión
          </button>

          {/* SEPARADOR */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-text-low/30" />
            <p className="font-body text-[13px] text-text-low">o continúa con</p>
            <div className="flex-1 h-px bg-text-low/30" />
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-surf border border-text-low rounded-xl py-3 font-body font-semibold text-[15px] text-text-high hover:border-primary transition-colors">
              Google
            </button>
            <button className="flex-1 bg-surf border border-text-low rounded-xl py-3 font-body font-semibold text-[15px] text-text-high hover:border-primary transition-colors">
              Apple
            </button>
          </div>

          {/* REGISTRO */}
          <p className="font-body text-[14px] text-text-high text-center">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary hover:opacity-80 transition-opacity font-semibold"
            >
              Regístrate gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginDesktop;