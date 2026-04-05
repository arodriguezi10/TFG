import React from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white">Pantalla de Inicio</h1>
      <h1 className="font-heading text-primary text-4xl">FYLIOS</h1>
      <Button text="Iniciar sesión" color="bg-primary" variant="filled"/>
      <Button text="Crear cuenta" borderColor="border-primary" variant="outlined"/>
      <Button text="Enviar enlace" color="bg-accent2" variant="filled"/>
      <Card>
        <h2>Push B</h2>
        <p>8 ejercicios
        </p>
      </Card>

      <Input label="Correo electrónico" placeholder="email@ejemplo.com" type="email">
      
      </Input>
    </div>
  );
};

export default Home;
