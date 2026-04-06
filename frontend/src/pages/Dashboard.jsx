import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col" >

      <section className="w-[100%] px-[16px]">
        <p className="font-body text-[12px] text-text-low">
          jueves, 13 de enero
        </p>
        <div className="flex justify-between items-center">
          <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight mt-[5px]">
            Hola,
            <span className="text-accent1">Alejandro</span>
          </h1>
          <h1 className="bg-accent1 h-[55px] w-[55px] rounded-[12px] flex items-center justify-center font-heading font-extrabold text-[28px] text-text-high">
            F
          </h1>
        </div>
      </section>

      <section className="mt-[16px] flex flex-col items-center justify-center leading-tight">
        <Card>

          <p className="font-subheading font-bold text-text-low text-[16px]"> 
            · SIGUIENTE EN TU CICLO
          </p>

          <div className="mt-[16px]">
            <p className="font-heading font-extrabold text-text-high text-[28px] mt[]">Push A</p>
            <div className="flex space-x-2">
              <span className="bg-surf h-[30px] py-[2px] px-[10px] rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                8 ejercicios
              </span>
              <span className="bg-surf h-[30px] py-[2px] px-[10px] rounded-[16px] border border-text-low text-[14px] text-text-low font-subheading flex items-center justify-center">
                Pecho · Hombro · Tríceps
              </span>
            </div>
          </div>

          <div className="mt-[16px] w-[95%] flex items-center justify-between">
            <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
              120
              <span className="font-subheading font-semibold text-[14px] text-text-low">
                MINUTOS
              </span>
            </p>
            <div className="w-[1px] h-[40px] bg-text-low"></div>
            <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
              8
              <span className="font-subheading font-semibold text-[14px] text-text-low">
                EJERCICIOS
              </span>
            </p>
            <div className="w-[1px] h-[40px] bg-text-low"></div>
            <p className="flex flex-col items-center font-heading font-bold text-[22px] text-text-high">
              3x
              <span className="font-subheading font-semibold text-[14px] text-text-low">
                SERIES
              </span>
            </p>
          </div>

          <div className="mt-[16px] flex items-center ">
            <Button text="Empezar entrenamiento" color="bg-primary" variant="filled"></Button>
          </div>

        </Card>
      </section>

    </div>
  );
};

export default Dashboard;