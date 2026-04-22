import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { sendPasswordResetEmail } from "../services/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

    const [ email, setEmail ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ error, setError ] = useState("");

    const navigate = useNavigate();

    //manejo del envio del email
    const handleSendEmail = async () => {
        //limpiamos los mensajes previos
        setMessage("");
        setError("");

        //validamos que el email no este vacio
        if(!email) {
            setError("Por favor ingresa tu correo electrónico");
            return;
        }

        //validamos el fomato de email basico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            setError("Por favor ingresa un correo electrónico válido");
            return;
        }

        setLoading(true);

        const { error: resetError } = await sendPasswordResetEmail(email);

        setLoading(false);

        if (resetError) {
            console.error("Error al enviar email:", resetError);
            setError("Hubo un error al enviar el correo. Intenta de nuevo.");
        } else {
            setMessage("Te hemos enviado un correo con el enlace de recuperación");
            console.log("Email enviado correctamente");
        }
    };

  return (
    <div className="min-h-screen bg-background px-4 flex flex-col text-text-high">

        <section className="h-15 items-center text-[28px] font-heading font-extrabold flex gap-4 ">
            <h1 className="bg-accent2 h-13.75 w-13.75 rounded-[12px] flex items-center justify-center">
                F
            </h1>

            <h1>FYLIOS</h1>
        </section>

        <section className="mt-9.5 flex flex-col items-center justify-center">
            <span className="bg-surf h-25 w-25 px-2.5 rounded-[30px] border border-s-accent2 font-body text-[45px] text-accent2 flex items-center justify-center">
                & {/*! PONER EL ICONO */}
            </span>
        </section>

        <section className="items-center mt-9.5">
            <span className="bg-surf h-7.5 py-0.5 px-3 rounded-[16px] border border-accent2 text-[16px] text-accent2 font-subheading "> 
                ◆ Recuperación segura
            </span>

            <h1 className="text-[50px] font-heading font-bold leading-tight">
                ¿Olvidaste la
                <span className="text-accent2"> contraseña</span>?
            </h1>

            <p className="font-subheading font-bold text-[16px] text-text-low">
                Ingresa tu correo y te enviaremos un enlace para restablecerla
            </p>
        </section>
        
        <section className="mt-3.5 flex flex-col gap-6.25">
            <Input 
                variant="outlined" 
                p="p-[16px]" 
                label="Correo electrónico" 
                placeholder="email@ejemplo.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <div className="h-19.25 rounded-[16px] bg-primary-bg border border-accent2 p-4 flex gap-2.5 items-center justify-center">
                <span className="text-accent2">&</span>

                <p className="font-body text-[16px] text-text-low">Revisa también tu carpeta de 
                    <span className="text-accent2"> spam. </span>
                    El enlace expira en 
                    <span className="text-accent2"> 1 hora.</span>
                </p>
            </div>              
        </section>

        <section className="mt-4">
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

            {/* Mostrar mensaje de éxito */}
            {message && (
            <section className="mt-4">
                <div className="bg-green-bg2 rounded-[16px] border border-accent2 p-4">
                <p className="font-body text-[14px] text-accent2 text-center">
                    {message}
                </p>
                </div>
            </section>
            )}

            {/* Mostrar mensaje de error */}
            {error && (
            <section className="mt-4">
                <div className="bg-red-500/10 rounded-[16px] border border-red-500 p-4">
                    <p className="font-body text-[14px] text-red-500 text-center">
                        {error}
                    </p>
                </div>
            </section>
            )}

            <p className="font-body text-[16px] text-text-low text-center mt-5">
                ¿No recibiste nada?
                <span className="text-primary"> Reenviar correo</span>
            </p>

            <p className="font-body text-[16px] text-text-low text-center mt-5">
                ¿Recordaste la contraseña?
                <span className="text-accent1" onClick={() => navigate("/login")}> Iniciar sesión</span>
            </p>
        </section>
    </div>
  );
};

export default ForgotPassword;
