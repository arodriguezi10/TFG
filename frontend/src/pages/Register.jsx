import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

import { registerUser } from "../services/auth";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de error
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const navigate = useNavigate();

  // Validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

 // Validar contraseña
    const validatePassword = (password) => {
    // Mínimo 8 caracteres
    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres";
    }

    // Caracteres prohibidos comunes
    const prohibitedPatterns = [
        /password/i,
        /12345678/,  // Ajustado para bloquear exactamente tu contraseña anterior
        /qwerty/i,
        /abc123/i,
        /admin/i,
        /letmein/i,
        /welcome/i,
        /monkey/i,
        /dragon/i,
        /master/i,
        /11111111/,
        /22222222/,
        /33333333/,
        /00000000/
    ];

    for (let pattern of prohibitedPatterns) {
        if (pattern.test(password)) {
        return "Contraseña demasiado común, elige una más segura";
        }
    }

    return ""; // Contraseña válida
    };

  // Validar edad mínima (13 años)
  const validateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 13;
  };

  /*manejo de registro del usuario*/
  const handleRegister = async () => {
    // Resetear todos los errores
    let nameErr = "";
    let surnameErr = "";
    let birthDateErr = "";
    let emailErr = "";
    let passwordErr = "";
    let confirmPasswordErr = "";
    let termsErr = "";

    // Validar NOMBRE
    if (!name.trim()) {
      nameErr = "El nombre es requerido";
    } else if (name.trim().length < 2) {
      nameErr = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar APELLIDO
    if (!surname.trim()) {
      surnameErr = "El apellido es requerido";
    } else if (surname.trim().length < 2) {
      surnameErr = "El apellido debe tener al menos 2 caracteres";
    }

    // Validar FECHA DE NACIMIENTO
    if (!birthDate) {
      birthDateErr = "La fecha de nacimiento es requerida";
    } else if (!validateAge(birthDate)) {
      birthDateErr = "Debes tener al menos 13 años";
    }

    // Validar EMAIL
    if (!email) {
      emailErr = "El email es requerido";
    } else if (!validateEmail(email)) {
      emailErr = "Por favor ingresa un email válido";
    }

    // Validar CONTRASEÑA
    if (!password) {
      passwordErr = "La contraseña es requerida";
    } else {
      const passwordValidation = validatePassword(password);
      if (passwordValidation) {
        passwordErr = passwordValidation;
      }
    }

    // Validar CONFIRMAR CONTRASEÑA
    if (!confirmPassword) {
      confirmPasswordErr = "Debes confirmar la contraseña";
    } else if (password !== confirmPassword) {
      confirmPasswordErr = "Las contraseñas no coinciden";
    }

    // Validar TÉRMINOS
    if (!termsAccepted) {
      termsErr = "Debes aceptar los términos y condiciones";
    }

    // Establecer todos los errores
    setNameError(nameErr);
    setSurnameError(surnameErr);
    setBirthDateError(birthDateErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);
    setTermsError(termsErr);

    // Si hay algún error, no continuar
    if (nameErr || surnameErr || birthDateErr || emailErr || passwordErr || confirmPasswordErr || termsErr) {
      return;
    }

    // Intentar registro
    const { data, error } = await registerUser(email, password, name, surname, birthDate);

    if (error) {
      console.error("Error: ", error);
      
      if (error.message.includes("already registered")) {
        setEmailError("Este email ya está registrado");
      } else {
        setEmailError("Error al crear la cuenta. Intenta de nuevo");
      }
    } else {
      console.log("Registro exitoso: ", data);
      alert("✅ Cuenta creada exitosamente. Por favor verifica tu email.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 flex flex-col text-text-high pb-8">
      <section className="h-15 items-center text-[28px] font-heading font-extrabold flex gap-4 ">
        <h1 className="bg-accent1 h-13.75 w-13.75 rounded-xl flex items-center justify-center">
          F
        </h1>

        <h1>FYLIOS</h1>
      </section>

      <section className="items-center mt-5.5">
        <span className="bg-surf h-7.5 py-0.5 px-3 rounded-2xl border border-accent1 text-[16px] text-accent1 font-subheading ">
          ◆ Nuevo por aquí
        </span>

        <h1 className="text-[50px] font-heading font-bold leading-tight">
          Crea tu
          <span className="text-accent1"> cuenta</span>
        </h1>

        <p className="font-subheading font-bold text-[16px] text-text-low">
          Únete gratis y empieza en segundos
        </p>
      </section>

      <section className="mt-3.5">
        <div className="mb-4">
          <Input
            variant="outlined"
            p="p-[16px]"
            label="Nombre"
            placeholder="Alejandro"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && (
            <p className="font-body text-[14px] text-red mt-1 ml-1">
              ⚠️ {nameError}
            </p>
          )}
        </div>

        <div className="flex gap-2.5 mb-4">
          <div className="flex-1">
            <Input
              variant="outlined"
              p="p-[16px]"
              label="Apellido"
              placeholder="Rodríguez"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            {surnameError && (
              <p className="font-body text-[14px] text-red mt-1 ml-1">
                ⚠️ {surnameError}
              </p>
            )}
          </div>

          <div className="flex-1">
            <Input
              variant="outlined"
              p="p-[16px]"
              label="Fecha de nacimiento"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            {birthDateError && (
              <p className="font-body text-[14px] text-red mt-1 ml-1">
                ⚠️ {birthDateError}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <Input
            variant="outlined"
            p="p-[16px]"
            label="Correo electrónico"
            placeholder="email@ejemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <p className="font-body text-[14px] text-red mt-1 ml-1">
              ⚠️ {emailError}
            </p>
          )}
        </div>

        <div className="relative mb-4">
          <Input
            variant="outlined"
            p="p-[16px]"
            label="Contraseña"
            placeholder="Tu contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-15 transform -translate-y-1/2 text-text-low hover:text-text-high transition-colors text-[20px]"
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
          {passwordError && (
            <p className="font-body text-[14px] text-red mt-1 ml-1">
              ⚠️ {passwordError}
            </p>
          )}
        </div>

        <div className="relative mb-4">
          <Input
            variant="outlined"
            p="p-[16px]"
            label="Confirmar contraseña"
            placeholder="Repite la contraseña"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-15 transform -translate-y-1/2 text-text-low hover:text-text-high transition-colors text-[20px]"
          >
            {showConfirmPassword ? "👁️" : "🙈"}
          </button>
          {confirmPasswordError && (
            <p className="font-body text-[14px] text-red mt-1 ml-1">
              ⚠️ {confirmPasswordError}
            </p>
          )}
        </div>
      </section>

      <section className="flex gap-3.75 mt-4 items-start">
        <input
          type="checkbox"
          className="w-4.5 h-4.5 mt-1"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />

        <div className="flex-1">
          <p className="font-body text-[16px] text-text-low">
            Acepto los
            <span className="text-primary"> Términos de uso </span>
            y la
            <span className="text-primary"> Política de privacidad </span>
            de Fylios
          </p>
          {termsError && (
            <p className="font-body text-[14px] text-red mt-1">
              ⚠️ {termsError}
            </p>
          )}
        </div>
      </section>

      <section className="mt-4">
        <Button
          variant="filled"
          text="Crear cuenta"
          bgColor="bg-accent1"
          textColor={"text-text-high"}
          borderColor={"border-accent1"}
          w="w-[100%]"
          onClick={handleRegister}
        />

        <p className="font-body text-[16px] text-text-low text-center mt-5">
          o continúa con
        </p>
      </section>

      <section className="flex justify-center gap-2.5 mt-5.5">
        <button className="bg-surface w-42.5 h-15.25 rounded-2xl font-body font-semibold text-[24px] text-text-high">
          Google
        </button>

        <button className="bg-surface w-42.5 h-15.25 rounded-2xl font-body font-semibold text-[24px] text-text-high">
          Apple
        </button>
      </section>

      <section className="mt-5.5">
        <button onClick={() => navigate("/login")} className="w-full">
          <p className="font-body text-[16px] text-text-high text-center">
            ¿Ya tienes cuenta?
            <span className="text-primary"> Vuelve e Inicia Sesión</span>
          </p>
        </button>
      </section>
    </div>
  );
};

export default Register;