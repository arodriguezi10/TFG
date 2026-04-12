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
        const { data, error } = await loginUser (email, password);

        if(error) {
            console.error ("Error: " , error )
        }else{
            console.log("Login exitoso: ", data)
            navigate("/dashboard");
        }
    };

  return (
    <div className="min-h-screen bg-background px-[16px] flex flex-col text-text-high">
      <section className="h-[60px] items-center text-[28px] font-heading font-extrabold flex gap-4 ">
        <h1 className="bg-primary h-[55px] w-[55px] rounded-[12px] flex items-center justify-center">
          F
        </h1>
        <h1>FYLIOS</h1>
      </section>

      <section className="items-center mt-[22px]">
        <span className="bg-surf h-[30px] py-[2px] px-[12px] rounded-[16px] border border-primary text-[16px] text-primary font-subheading ">
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

      <section className="mt-[14px]">
        <Input
          label="Correo electrónico"
          placeholder="email@ejemplo.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <Input
          label="Contraseña"
          placeholder="Tu contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
      </section>

      <section className="flex justify-between mt-[16px] items-center">
        <div className="flex gap-1 items-center">
          <input type="checkbox" className="w-[18px] h-[18px]" />
          <p className="font-body text-[16px] text-text-low">Recuérdame</p>
        </div>
        <p className="font-body text-[16px] text-primary">
          ¿Olvidaste la contraseña?
        </p>
      </section>

      <section className="mt-[16px]">
        <Button variant="outlined" text="Iniciar sesión" bgColor={"bg-primary"} textColor={"text-text-high"} borderColor={"border-primary"} w="w-[100%]"  onClick={handleLogin} />
        <p className="font-body text-[16px] text-text-low text-center mt-[20px]">
          o continúa con
        </p>
      </section>

      <section className="flex justify-center gap-[10px] mt-[22px]">
        <button className="bg-surface w-[170px] h-[61px] rounded-[16px] font-body font-semibold text-[24px] text-text-high">
          Google
        </button>
        <button className="bg-surface w-[170px] h-[61px] rounded-[16px] font-body font-semibold text-[24px] text-text-high">
          Apple
        </button>
      </section>

      <section className="mt-[22px]">
        <p className="font-body text-[16px] text-text-high text-center">
          ¿No tienes cuenta?
          <span className="text-accent1"> Registrate gratis</span>
        </p>
      </section>
    </div>
  );
};

export default Login;
