import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { updatePassword } from "../services/auth";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //menejo del reseteo de la contraseña
  const handleResetPassword = async () => {
    //limpiamos los mensajes previos
    setMessage("");
    setError("");

    //validamos que no esten vacios
    if(!password || !confirmPassword){
      setError("Por favor completa ambos campos");
      return;
    }

    //validamos que coincidan
    if(password !== confirmPassword){
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true)

    const { error: updateError } = await updatePassword(password);

    setLoading(false);

    if (updateError) {
      console.error("Error al cambiar contraseña:", updateError);
      setError("Hubo un error al cambiar la contraseña. Intenta de nuevo.");
    } else {
      setMessage("✓ Contraseña actualizada correctamente");
      console.log("Contraseña cambiada correctamente");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background px-[16px] flex flex-col text-text-high">
      
      <section className="h-[60px] items-center text-[28px] font-heading font-extrabold flex gap-4 ">
          <h1 className="bg-accent2 h-[55px] w-[55px] rounded-[12px] flex items-center justify-center">
            F
          </h1>

          <h1>FYLIOS</h1>
      </section>

      <section className="mt-[38px] flex flex-col items-center justify-center">
          <span className="bg-surf h-[100px] w-[100px] px-[10px] rounded-[30px] border border-s-accent2 font-body text-[45px] text-accent2 flex items-center justify-center">
              & {/*! PONER EL ICONO */}
          </span>
      </section>

      <section className="items-center mt-[38px]">
          <span className="bg-surf h-[30px] py-[2px] px-[12px] rounded-[16px] border border-accent2 text-[16px] text-accent2 font-subheading "> 
              ◆ Nueva contraseña
          </span>

          <h1 className="text-[46.96px] font-heading font-bold leading-tight">
              Restablece tu
              <span className="text-accent2"> contraseña</span>
          </h1>

          <p className="font-subheading font-bold text-[16px] text-text-low">
              Ingresa tu nueva contraseña
          </p>
      </section>

      <section className="mt-[14px]">
        <Input
          variant="outlined"
          p="p-[16px]"
          label="NUEVA CONTRASEÑA"
          placeholder="Tu nueva contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          variant="outlined"
          p="p-[16px]"
          label="CONFIRMAR CONTRASEÑA"
          placeholder="Repite la contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </section>

      <section className="mt-[16px]">
        <div className="h-[77px] rounded-[16px] bg-primary-bg border border-accent2 p-[16px] flex gap-[10px] items-center justify-center">
                <span className="text-accent2">&</span>

                <p className="font-body text-[16px] text-text-low">Tu contraseña debe tener al menos  
                    <span className="text-accent2"> 6 caracteres </span>
                    de longitud. 
                </p>
            </div>
      </section>

      <section className="mt-[24px]">
        <Button
          variant="filled"
          text={loading ? "Cambiando..." : "Cambiar contraseña"}
          bgColor="bg-accent2"
          textColor="text-text-high"
          borderColor="border-accent2"
          w="w-[100%]"
          onClick={handleResetPassword}
          disabled={loading}
        />

        {/* Mostrar mensaje de éxito */}
        {message && (
          <section className="mt-[16px]">
            <div className="bg-green-bg2 rounded-[16px] border border-accent2 p-[16px]">
              <p className="font-body text-[14px] text-accent2 text-center">
                {message}
              </p>
            </div>
          </section>
        )}

        {/* Mostrar mensaje de error */}
        {error && (
          <section className="mt-[16px]">
            <div className="bg-red-500/10 rounded-[16px] border border-red-500 p-[16px]">
              <p className="font-body text-[14px] text-red-500 text-center">
                {error}
              </p>
            </div>
          </section>
        )}
      </section>

      <section className="mt-[24px]">
        <p className="font-body text-[16px] text-text-high text-center">
          ¿Recordaste tu contraseña?{" "}
          <span className="text-accent1">Iniciar sesión</span>
        </p>
      </section>
    </div>
  );
};

export default ResetPassword;
