import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import Input from "../components/Input";
import { Mail, Lock, Eye, EyeOff, User, Calendar } from "lucide-react";

const RegisterDesktop = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    const prohibited = [/password/i, /12345678/, /qwerty/i, /abc123/i, /admin/i];
    for (let p of prohibited) {
      if (p.test(password)) return "Contraseña demasiado común, elige una más segura";
    }
    return "";
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 13;
  };

  const handleRegister = async () => {
    let nameErr = "", surnameErr = "", birthDateErr = "", emailErr = "", passwordErr = "", confirmPasswordErr = "", termsErr = "";

    if (!name.trim()) nameErr = "El nombre es requerido";
    else if (name.trim().length < 2) nameErr = "El nombre debe tener al menos 2 caracteres";

    if (!surname.trim()) surnameErr = "El apellido es requerido";
    else if (surname.trim().length < 2) surnameErr = "El apellido debe tener al menos 2 caracteres";

    if (!birthDate) birthDateErr = "La fecha de nacimiento es requerida";
    else if (!validateAge(birthDate)) birthDateErr = "Debes tener al menos 13 años";

    if (!email) emailErr = "El email es requerido";
    else if (!validateEmail(email)) emailErr = "Por favor ingresa un email válido";

    if (!password) passwordErr = "La contraseña es requerida";
    else { const v = validatePassword(password); if (v) passwordErr = v; }

    if (!confirmPassword) confirmPasswordErr = "Debes confirmar la contraseña";
    else if (password !== confirmPassword) confirmPasswordErr = "Las contraseñas no coinciden";

    if (!termsAccepted) termsErr = "Debes aceptar los términos y condiciones";

    setNameError(nameErr);
    setSurnameError(surnameErr);
    setBirthDateError(birthDateErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);
    setTermsError(termsErr);

    if (nameErr || surnameErr || birthDateErr || emailErr || passwordErr || confirmPasswordErr || termsErr) return;

    const { error } = await registerUser(email, password, name, surname, birthDate);

    if (error) {
      if (error.message.includes("already registered")) setEmailError("Este email ya está registrado");
      else setEmailError("Error al crear la cuenta. Intenta de nuevo");
    } else {
      alert("✅ Cuenta creada exitosamente. Por favor verifica tu email.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* LADO IZQUIERDO */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a26 50%, #0f0f1a 100%)" }}
      >

        <div className="flex items-center gap-4 z-10">
          <div className="bg-accent1 h-14 w-14 rounded-xl flex items-center justify-center font-heading font-extrabold text-[28px] text-text-high">F</div>
          <span className="font-heading font-extrabold text-[28px] text-text-high">FYLIOS</span>
        </div>

        <div className="z-10">
          <span className="inline-flex bg-surf border border-accent1 rounded-full px-4 py-1 font-subheading font-bold text-[14px] text-accent1 mb-6">
            ◆ Nuevo por aquí
          </span>
          <h2 className="font-heading font-extrabold text-[44px] text-text-high leading-tight mb-4">
            Empieza tu<br />
            journey <span className="text-accent1">hoy.</span>
          </h2>
          <p className="font-body text-[16px] text-text-low leading-relaxed max-w-md">
            Únete a miles de atletas que ya están mejorando su rendimiento con FYLIOS.
          </p>

          <div className="flex flex-col gap-4 mt-10">
            {[
              "Rutinas personalizadas ilimitadas",
              "Seguimiento de progreso en tiempo real",
              "Planificación de mesociclos avanzada",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-accent1/20 border border-accent1 flex items-center justify-center font-bold text-[12px] text-accent1">✓</div>
                <p className="font-body text-[14px] text-text-low">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-body text-[12px] text-text-low z-10">© 2026 FYLIOS. Todos los derechos reservados.</p>
      </div>

      {/* LADO DERECHO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">

          <div className="mb-6">
            <span className="inline-flex bg-surf border border-accent1 rounded-full px-3 py-0.5 font-subheading font-bold text-[13px] text-accent1 mb-3">
              ◆ Nuevo por aquí
            </span>
            <h1 className="font-heading font-extrabold text-[32px] text-text-high leading-tight">
              Crea tu <span className="text-accent1">cuenta</span>
            </h1>
            <p className="font-body text-[14px] text-text-low mt-1">Únete gratis y empieza en segundos</p>
          </div>

          <div className="flex flex-col gap-4">

            {/* NOMBRE Y APELLIDO */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Nombre</label>
                <Input
                  type="text"
                  placeholder="Alejandro"
                  icon={<User size={16} />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors placeholder:text-text-low/50"
                />
                {nameError && <p className="font-body text-[12px] text-red">⚠️ {nameError}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Apellido</label>
                <Input
                  type="text"
                  placeholder="Rodríguez"
                  icon={<User size={16} />}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors placeholder:text-text-low/50"
                />
                {surnameError && <p className="font-body text-[12px] text-red">⚠️ {surnameError}</p>}
              </div>
            </div>

            {/* FECHA NACIMIENTO */}
            <div className="flex flex-col gap-1.5">
              <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Fecha de nacimiento</label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors"
                icon={<Calendar size={16} />}
              />
              {birthDateError && <p className="font-body text-[12px] text-red">⚠️ {birthDateError}</p>}
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Correo electrónico</label>
              <Input
                type="email"
                placeholder="email@ejemplo.com"
                icon={<Mail size={16} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors placeholder:text-text-low/50"
              />
              {emailError && <p className="font-body text-[12px] text-red">⚠️ {emailError}</p>}
            </div>

            {/* CONTRASEÑA */}
            <div className="flex flex-col gap-1.5">
              <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors placeholder:text-text-low/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-low hover:text-text-high text-[16px]"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {passwordError && <p className="font-body text-[12px] text-red">⚠️ {passwordError}</p>}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div className="flex flex-col gap-1.5">
              <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">Confirmar contraseña</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite la contraseña"
                  icon={<Lock size={16} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 pr-12 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors placeholder:text-text-low/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-low hover:text-text-high text-[16px]"
                >
                  {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {confirmPasswordError && <p className="font-body text-[12px] text-red">⚠️ {confirmPasswordError}</p>}
            </div>

            {/* TÉRMINOS */}
            <div>
              <div className="flex gap-3 items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 accent-primary"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <p className="font-body text-[13px] text-text-low">
                  Acepto los <span className="text-primary cursor-pointer">Términos de uso</span> y la <span className="text-primary cursor-pointer">Política de privacidad</span> de Fylios
                </p>
              </div>
              {termsError && <p className="font-body text-[12px] text-red mt-1">⚠️ {termsError}</p>}
            </div>

            {/* BOTÓN */}
            <button
              onClick={handleRegister}
              className="w-full bg-accent1 border border-accent1 rounded-xl py-3.5 font-heading font-bold text-[16px] text-text-high hover:opacity-90 transition-opacity"
            >
              Crear cuenta
            </button>

            {/* SEPARADOR */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-text-low/30" />
              <p className="font-body text-[13px] text-text-low">o continúa con</p>
              <div className="flex-1 h-px bg-text-low/30" />
            </div>

            {/* SOCIAL */}
            <div className="flex gap-3">
              <button className="flex-1 bg-surf border border-text-low rounded-xl py-3 font-body font-semibold text-[14px] text-text-high hover:border-primary transition-colors">Google</button>
              <button className="flex-1 bg-surf border border-text-low rounded-xl py-3 font-body font-semibold text-[14px] text-text-high hover:border-primary transition-colors">Apple</button>
            </div>

            {/* LOGIN */}
            <p className="font-body text-[13px] text-text-high text-center">
              ¿Ya tienes cuenta?{" "}
              <button onClick={() => navigate("/login")} className="text-primary hover:opacity-80 font-semibold">
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDesktop;