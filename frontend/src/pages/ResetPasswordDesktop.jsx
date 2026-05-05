import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../services/auth";

const ResetPasswordDesktop = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setMessage("");
    setError("");

    if (!password || !confirmPassword) { setError("Por favor completa ambos campos"); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }

    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError("Hubo un error al cambiar la contraseña. Intenta de nuevo.");
    } else {
      setMessage("✓ Contraseña actualizada correctamente");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* LADO IZQUIERDO */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a26 50%, #0f0f1a 100%)" }}
      >

        {/* Logo */}
        <div className="flex items-center gap-4 z-10">
          <div className="bg-accent2 h-14 w-14 rounded-xl flex items-center justify-center font-heading font-extrabold text-[28px] text-text-high">F</div>
          <span className="font-heading font-extrabold text-[28px] text-text-high">FYLIOS</span>
        </div>

        {/* Central */}
        <div className="z-10">
          <span className="inline-flex bg-surf border border-accent2 rounded-full px-4 py-1 font-subheading font-bold text-[14px] text-accent2 mb-6">
            ◆ Nueva contraseña
          </span>
          <h2 className="font-heading font-extrabold text-[44px] text-text-high leading-tight mb-4">
            Restablece tu<br />
            <span className="text-accent2">contraseña.</span>
          </h2>
          <p className="font-body text-[16px] text-text-low leading-relaxed max-w-md">
            Elige una contraseña segura para proteger tu cuenta de FYLIOS.
          </p>

          <div className="flex flex-col gap-4 mt-10">
            {[
              "Mínimo 6 caracteres de longitud",
              "Combina letras, números y símbolos",
              "No uses contraseñas comunes",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-accent2/20 border border-accent2 flex items-center justify-center font-bold text-[12px] text-accent2">✓</div>
                <p className="font-body text-[14px] text-text-low">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-body text-[12px] text-text-low z-10">© 2026 FYLIOS. Todos los derechos reservados.</p>
      </div>

      {/* LADO DERECHO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <span className="inline-flex bg-surf border border-accent2 rounded-full px-3 py-0.5 font-subheading font-bold text-[13px] text-accent2 mb-4">
              ◆ Nueva contraseña
            </span>
            <h1 className="font-heading font-extrabold text-[32px] text-text-high leading-tight">
              Restablece tu <span className="text-accent2">contraseña</span>
            </h1>
            <p className="font-body text-[15px] text-text-low mt-2">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {/* NUEVA CONTRASEÑA */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
              Nueva contraseña
            </label>
            <input
              type="password"
              placeholder="Tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surf border border-text-low rounded-xl px-4 py-3.5 font-body text-[15px] text-text-high outline-none focus:border-accent2 transition-colors placeholder:text-text-low/50"
            />
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleResetPassword()}
              className="w-full bg-surf border border-text-low rounded-xl px-4 py-3.5 font-body text-[15px] text-text-high outline-none focus:border-accent2 transition-colors placeholder:text-text-low/50"
            />
          </div>

          {/* INFO */}
          <div className="bg-primary-bg border border-accent2 rounded-xl p-4 flex gap-3 items-start mb-6">
            <span className="text-accent2 text-[18px] shrink-0">🔒</span>
            <p className="font-body text-[13px] text-text-low">
              Tu contraseña debe tener al menos <span className="text-accent2">6 caracteres</span> de longitud.
            </p>
          </div>

          {/* MENSAJES */}
          {message && (
            <div className="bg-accent3/10 border border-accent3 rounded-xl p-4 mb-4">
              <p className="font-body text-[13px] text-accent3 text-center">{message}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-bg1 border border-red rounded-xl p-4 mb-4">
              <p className="font-body text-[13px] text-red text-center">{error}</p>
            </div>
          )}

          {/* BOTÓN */}
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-accent2 border border-accent2 rounded-xl py-3.5 font-heading font-bold text-[16px] text-text-high hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
          >
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>

          <p className="font-body text-[14px] text-text-high text-center">
            ¿Recordaste tu contraseña?{" "}
            <button onClick={() => navigate("/login")} className="text-accent1 hover:opacity-80 font-semibold">
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordDesktop;