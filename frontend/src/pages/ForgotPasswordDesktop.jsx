import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "../services/auth";
import Input from "../components/Input";
import Button from "../components/Button";
import { Mail, Info} from "lucide-react";

const ForgotPasswordDesktop = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSendEmail = async () => {
    setMessage("");
    setError("");

    if (!email) { setError("Por favor ingresa tu correo electrónico"); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("Por favor ingresa un correo electrónico válido"); return; }

    setLoading(true);
    const { error: resetError } = await sendPasswordResetEmail(email);
    setLoading(false);

    if (resetError) {
      setError("Hubo un error al enviar el correo. Intenta de nuevo.");
    } else {
      setMessage("Te hemos enviado un correo con el enlace de recuperación");
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
            ◆ Recuperación segura
          </span>
          <h2 className="font-heading font-extrabold text-[44px] text-text-high leading-tight mb-4">
            Recupera tu<br />
            <span className="text-accent2">acceso.</span>
          </h2>
          <p className="font-body text-[16px] text-text-low leading-relaxed max-w-md">
            No te preocupes, te enviamos un enlace seguro a tu correo para restablecer tu contraseña en segundos.
          </p>

          <div className="flex flex-col gap-4 mt-10">
            {[
              "Enlace seguro con caducidad de 1 hora",
              "Revisa también tu carpeta de spam",
              "Puedes solicitar un nuevo enlace si caduca",
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
              ◆ Recuperación segura
            </span>
            <h1 className="font-heading font-extrabold text-[32px] text-text-high leading-tight">
              ¿Olvidaste la <span className="text-accent2">contraseña</span>?
            </h1>
            <p className="font-body text-[15px] text-text-low mt-2">
              Ingresa tu correo y te enviaremos un enlace para restablecerla
            </p>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">
              Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="email@ejemplo.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendEmail()}
              className="w-full bg-surf border border-text-low rounded-xl px-4 py-3.5 font-body text-[15px] text-text-high outline-none focus:border-accent2 transition-colors placeholder:text-text-low/50"
            />
          </div>

          {/* INFO SPAM */}
          <div className="bg-primary-bg border border-accent2 rounded-xl p-4 flex gap-3 items-start mb-6">
            <span className="text-accent2 text-[18px] shrink-0"><Info size={18} /></span>
            <p className="font-body text-[13px] text-text-low">
              Revisa también tu carpeta de <span className="text-accent2">spam.</span> El enlace expira en <span className="text-accent2">1 hora.</span>
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
          <Button
                variant="filled"
                text={loading ? "Enviando..." : "Enviar enlace"}
                bgColor="bg-accent2"
                textColor="text-text-high"
                borderColor="border-accent2"
                w="w-[100%]"
                onClick={handleSendEmail}
                disabled={loading}
          />

          {/* LINKS */}
          <div className="flex flex-col gap-2 text-center">
            <p className="font-body text-[14px] text-text-low">
              ¿No recibiste nada?{" "}
              <button className="text-primary hover:opacity-80 font-semibold" onClick={() => navigate("/login")}> Reenviar correo</button>
            </p>
            <p className="font-body text-[14px] text-text-low">
              ¿Recordaste la contraseña?{" "}
              <button className="text-accent1 hover:opacity-80 font-semibold" onClick={() => navigate("/login")}> Iniciar sesión</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordDesktop;