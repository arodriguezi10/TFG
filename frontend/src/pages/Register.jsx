import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

import { registerUser  } from "../services/auth";

import { useNavigate } from "react-router-dom";

const Register = () => {

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const [name , setName] = useState("");
    const [surname , setSurname] = useState("");
    const [birthDate , setBirthDate] = useState("");

    const navigate = useNavigate();

    /*manejo de registro del usuario*/
    const handleRegister = async () =>{
        if(password !== confirmPassword){
            console.error("Las contraseñas no coinciden");
            return;
        }

        const {data, error} = await registerUser (email, password, name, surname, birthDate)

        if(error) {
            console.error ("Error: " , error )
        }else{
            console.log("Registro exitoso: ", data)
            navigate("/login");
        }
    }

  return (
    <div className="min-h-screen bg-background px-4 flex flex-col text-text-high">

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
            <Input variant="outlined" p="p-[16px]" label="Nombre" placeholder="Alejandro" type="text" value={name} onChange={(e) => setName(e.target.value)}>
      
            </Input>

            <div className="flex gap-2.5">
                <Input variant="outlined" p="p-[16px]" label="Apellido" placeholder="Rodríguez" type="text" value={surname} onChange={(e) => setSurname(e.target.value)}/>

                <Input variant="outlined" p="p-[16px]" label="Fecha de nacimiento" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>

            <Input variant="outlined" p="p-[16px]" label="Correo electrónico" placeholder="email@ejemplo.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)}>
      
            </Input>

            <Input variant="outlined" p="p-[16px]" label="Contraseña" placeholder="Tu contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}>

            </Input>

            <Input variant="outlined" p="p-[16px]" label="Confirmar contraseña" placeholder="Repite la contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>

            </Input>
        </section>

        <section className="flex gap-3.75 mt-4 items-center">
            <input type="checkbox" className="w-4.5 h-4.5"/>

            <p className="font-body text-[16px] text-text-low">
                Acepto los
                <span className="text-primary"> Términos de uso </span>
                y la
                <span className="text-primary"> Política de privacidad </span>
                de Fylios
            </p>
        </section>

        <section className="mt-4">
            <Button variant="filled" text="Crear cuenta" bgColor="bg-accent1" textColor={"text-text-high"} borderColor={"border-accent1"} w="w-[100%]"  onClick={handleRegister}/>

            <p className="font-body text-[16px] text-text-low text-center mt-5">o continúa con</p>
        </section>

        <section className="flex justify-center gap-2.5 mt-5.5">
            <button className="bg-surface w-42.5 h-15.25 rounded-2xl font-body font-semibold text-[24px] text-text-high">Google</button>
            
            <button className="bg-surface w-42.5 h-15.25 rounded-2xl font-body font-semibold text-[24px] text-text-high">Apple</button>
        </section>

        <section className="mt-5.5">
            <p className="font-body text-[16px] text-text-high text-center">
                ¿Ya tienes cuenta?
                <span className="text-primary"> Vuelve e Inicia Sesión</span>
            </p>
        </section>

    </div>
  );
};

export default Register;
