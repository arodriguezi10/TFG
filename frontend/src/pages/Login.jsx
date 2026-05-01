import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

import { loginUser } from "../services/auth";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // Validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar contraseña (mínimo 6 caracteres)
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  /*manejo de inicio de sesión*/
  const handleLogin = async () => {
    // Resetear errores
    let emailErr = "";
    let passwordErr = "";

    // Validar EMAIL
    if (!email) {
      emailErr = "El email es requerido";
    } else if (!validateEmail(email)) {
      emailErr = "Por favor ingresa un email válido";
    }

    // Validar CONTRASEÑA
    if (!password) {
      passwordErr = "La contraseña es requerida";
    } else if (!validatePassword(password)) {
      passwordErr = "La contraseña debe tener al menos 6 caracteres";
    }

    // Establecer los errores en el estado
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    // Si hay algún error, no continuar
    if (emailErr || passwordErr) {
      return;
    }

    // Intentar login
    const { data, error } = await loginUser(email, password);

    if (error) {
      console.error("Error: ", error);
      
      // Mostrar mensaje de error según el tipo
      if (error.message.includes("Invalid login credentials")) {
        setPasswordError("Email o contraseña incorrectos");
      } else if (error.message.includes("Email not confirmed")) {
        setEmailError("Por favor confirma tu email antes de iniciar sesión");
      } else {
        setEmailError("Error al iniciar sesión. Intenta de nuevo");
      }
    } else {
      console.log("Login exitoso: ", data);
      navigate("/dashboard");
    }
  };

  // Manejar Enter para hacer login
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 flex flex-col text-text-high">
      <section className="h-15 items-center text-[28px] font-heading font-extrabold flex gap-4 ">
        <h1 className="bg-primary h-13.75 w-13.75 rounded-xl flex items-center justify-center">
          F
        </h1>

        <h1>FYLIOS</h1>
      </section>

      <section className="items-center mt-5.5">
        <span className="bg-surf h-7.5 py-0.5 px-3 rounded-2xl border border-primary text-[16px] text-primary font-subheading ">
          ◆ Acceso seguro
        </span>

        <h1 className="text-[50px] font-heading font-bold leading-tight">
          Bienvenido de
          <span className="text-accent1"> vuelta</span>
        </h1>

        <p className="font-subheading font-bold text-[16px] text-text-low">
          Inicia sesión para continuar donde lo dejaste
        </p>
      </section>

      <section className="mt-3.5">
        <div className="mb-4">
          <Input
            variant="outlined"
            label="Correo electrónico"
            p="p-[16px]"
            placeholder="email@ejemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {emailError && (
            <p className="font-body text-[14px] text-red mt-1 ml-1">
              ⚠️ {emailError}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            variant="outlined"
            label="Contraseña"
            p="p-[16px]"
            placeholder="Tu contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          {/* Botón para mostrar/ocultar contraseña */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-16 transform -translate-y-1/2 text-text-low hover:text-text-high transition-colors text-[20px]"
          >
            {showPassword ? "👁️" : "🙈"}
          </button>

          {passwordError && (
            <p className="font-body text-[14px] text-red mt-1 ml-1">
              {passwordError}
            </p>
          )}
        </div>
      </section>

      <section className="flex justify-between mt-4 items-center">
        <div className="flex gap-1 items-center">
          <input type="checkbox" className="w-4.5 h-4.5"/>

          <p className="font-body text-[16px] text-text-low">Recuérdame</p>
        </div>

        <button
          onClick={() => navigate("/forgotPassword")}
          className="font-body text-[16px] text-primary hover:opacity-80 transition-opacity"
        >
          ¿Olvidaste la contraseña?
        </button>
      </section>

      <section className="mt-4">
        <Button
          variant="outlined"
          text="Iniciar sesión"
          bgColor={"bg-primary"}
          textColor={"text-text-high"}
          borderColor={"border-primary"}
          w="w-[100%]"
          onClick={handleLogin}
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
        <button
          onClick={() => navigate("/register")}
          className="w-full"
        >
          <p className="font-body text-[16px] text-text-high text-center">
            ¿No tienes cuenta?
            <span className="text-accent1"> Registrate gratis</span>
          </p>
        </button>
      </section>
    </div>
  );
};

export default Login;