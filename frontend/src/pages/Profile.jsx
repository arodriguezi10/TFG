import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
      <section className="mt-[10px] flex flex-col items-center justify-center gap-[15px]">
        <span className="bg-accent1 h-[110px] w-[110px] px-[10px] rounded-[35px] font-heading font-bold text-[50px] text-primary flex items-center justify-center">
          & {/*! PONER EL ICONO */}
        </span>

        <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
          Alejandro
          Rodríguez                   
        </p>

        <div className="flex gap-[10px]">
          <span className="bg-surf h-[30px] py-[2px] px-[12px] rounded-[16px] border border-primary text-[16px] text-primary font-subheading font-semibold ">
            & Atleta pro
          </span>
          <span className="bg-orange-bg4 h-[30px] py-[2px] px-[12px] rounded-[16px] border border-orange text-[16px] text-orange font-subheading font-semibold ">
            & Volumen
          </span>
        </div>
      </section>

      <section className="mt-[16px] flex flex-col px-[16px] gap-[12px]">
        <div className="flex gap-[15px]">
          <Card>
            <div className="flex flex-col h-auto ">
                <div className="bg-surface h-[40px] w-[40px] rounded-[8px] text-text-low items-center flex justify-center">&</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[10px]">PLANIFICACIÓN</p>
                <p className="font-heading font-semibold text-primary text-[20px] mt-[5px]">Microciclo 2</p>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[5px]">8 días / 2 sem.</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col h-auto">
                <div className="bg-brown-bg2 h-[40px] w-[40px] rounded-[8px] text-brown  flex items-center justify-center">&</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[10px]">PESO INICIAL</p>
                <p className="font-heading font-semibold text-accent1 text-[20px] mt-[5px]">77,65</p>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[5px]">kg · hace 6 m.</p>
            </div>
          </Card>
        </div>
        <div className="flex gap-[15px]">
          <Card>
            <div className="flex flex-col h-auto ">
                <div className="bg-accent2-bg1 h-[40px] w-[40px] rounded-[8px] text-accent2 flex items-center justify-center">&</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[10px]">ALTURA</p>
                <p className="font-heading font-semibold text-accent2 text-[20px] mt-[5px]">178</p>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[5px]">cm</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col h-auto">
                <div className="bg-orange-bg4 h-[40px] w-[40px] rounded-[8px] text-orange flex items-center justify-center">&</div>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[10px]">EDAD</p>
                <p className="font-heading font-semibold text-orange text-[20px] mt-[5px]">26</p>
                <p className="font-subheading font-bold text-text-low text-[16px] mt-[5px]">años</p>
            </div>
          
          </Card>
        </div>
      </section>

      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">

        <Card>
          <div className="flex flex-col gap-[15px]">
            <div className="flex items-center justify-between">
              <div className="flex gap-[20px] items-center justify-center">
                <div className="bg-primary-bg h-[40px] w-[40px] rounded-[8px] text-primary flex items-center justify-center">&</div>

                <div className="flex flex-col ">
                  <p className="font-subheading font-bold text-[16px] text-text-high">Ajustes y datos personales</p>

                  <p className="font-subheading font-bold text-[16px] text-text-low">Edita tu foto de y métricas</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-[15px] text-text-low">
                    v
              </div>
            </div>

            <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

            <div className="flex items-center justify-between">
              <div className="flex gap-[20px] items-center justify-center">
                <div className="bg-primary-bg h-[40px] w-[40px] rounded-[8px] text-yellow flex items-center justify-center">&</div>

                <div className="flex flex-col ">
                  <p className="font-subheading font-bold text-[16px] text-text-high">Suscripción y pagos</p>

                  <p className="font-subheading font-bold text-[16px] text-text-low">Plan Pro · Activo</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-[15px] text-text-low">
                    v
              </div>
            </div>

            <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

            <div className="flex items-center justify-between">
              <div className="flex gap-[20px] items-center justify-center">
                <div className="bg-primary-bg h-[40px] w-[40px] rounded-[8px] text-accent2 flex items-center justify-center">&</div>

                <div className="flex flex-col ">
                  <p className="font-subheading font-bold text-[16px] text-text-high">Soporte / Ayuda</p>

                  <p className="font-subheading font-bold text-[16px] text-text-low">FAQ y contacto</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-[15px] text-text-low">
                    v
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <button className="w-full">
              <div className="flex items-center justify-between">  
                  <div className="flex gap-[20px] items-center justify-center">
                      <div className="bg-red-bg1 h-[40px] w-[40px] rounded-[8px] text-red flex items-center justify-center">
                          &
                      </div>

                      <div className="flex flex-col">
                          <p className="font-heading font-semibold text-[20px] text-red">
                              Cerrar sesión
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-[15px] text-red">
                      v
                  </div>      
              </div>
          </button>
        </Card>
      </section>
    </div>
  );
};

export default Profile;
