import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

import { loginUser } from "../services/auth";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /*manejo de inicio de sesion*/
  const handleLogin = async () => {
    const { data, error } = await loginUser(email, password);

    if (error) {
      console.error("Error: ", error);
    } else {
      console.log("Login exitoso: ", data);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 flex flex-col text-text-high">
      <section className="h-15 items-center text-[28px] font-heading font-extrabold flex gap-4 ">
        <h1 className="bg-primary h-13.75 w-13.75 rounded-[12px] flex items-center justify-center">
          F
        </h1>

        <h1>FYLIOS</h1>
      </section>

      <section className="items-center mt-5.5">
        <span className="bg-surf h-7.5 py-0.5 px-3 rounded-[16px] border border-primary text-[16px] text-primary font-subheading ">
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
        <Input
          variant="outlined"
          label="Correo electrónico"
          p="p-[16px]"
          placeholder="email@ejemplo.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>

        <Input
          variant="outlined"
          label="Contraseña"
          p="p-[16px]"
          placeholder="Tu contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
      </section>

      <section className="flex justify-between mt-4 items-center">
        <div className="flex gap-1 items-center">
          <input type="checkbox" className="w-4.5 h-4.5"/>

          <p className="font-body text-[16px] text-text-low">Recuérdame</p>
        </div>

        <p className="font-body text-[16px] text-primary">
          ¿Olvidaste la contraseña?
        </p>
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
        <button className="bg-surface w-42.5 h-15.25 rounded-[16px] font-body font-semibold text-[24px] text-text-high">
          Google
        </button>
        
        <button className="bg-surface w-42.5 h-15.25 rounded-[16px] font-body font-semibold text-[24px] text-text-high">
          Apple
        </button>
      </section>

      <section className="mt-5.5">
        <p className="font-body text-[16px] text-text-high text-center">
          ¿No tienes cuenta?
          <span className="text-accent1"> Registrate gratis</span>
        </p>
      </section>
    </div>
  );
};

export default Login;
