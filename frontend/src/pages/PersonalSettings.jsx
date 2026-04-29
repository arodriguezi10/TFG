import React from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Button";

const PersonalSettings = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">

        <section className="w-full flex items-center justify-between">
            <Header showback subtitle={"perfil"} title={"Ajustes personales"}/>
        </section>    

        <section className="mt-[25px] flex flex-col items-center justify-center gap-[15px]">
            <span className="bg-primary-bg h-[110px] w-[110px] px-[10px] rounded-[35px] border border-primary font-heading font-bold text-[50px] text-accent1 flex items-center justify-center">
                & {/*! PONER EL ICONO */}
            </span>

            <p className="font-subheading font-bold text-[16px] text-primary leading-tight flex flex-col items-center justify-center text-center">
                Cambiar foto de perfil                  
            </p>
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <p className="font-subheading font-bold text-[16px] text-text-low">DATOS PERSONALES</p>

            <Card>
                <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col gap-[5px]">
                        <label className="font-subheading font-bold text-[16px] text-text-low">NOMBRE COMPLETO</label>

                        <div className="flex items-center gap-[20px]">
                            <div className="text-text-low text-[20px] flex items-center justify-center">&</div>
                            <input type="text" placeholder="Tu nombre completo" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" defaultValue="Santiago Segura"/>
                        </div>           
                    </div>

                    <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

                    <div className="flex flex-col gap-[5px]">
                        <label className="font-subheading font-bold text-[16px] text-text-low">CORREO ELECTRÓNICO</label>

                        <div className="flex items-center gap-[20px]">
                            <div className="text-text-low text-[20px] flex items-center justify-center">&</div>
                            <input type="email" placeholder="Tu email" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" defaultValue="Santiago Segura"/>
                        </div>  
                    </div>

                    <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

                    <div className="flex flex-col gap-[5px]">
                        <label className="font-subheading font-bold text-[16px] text-text-low">TELÉFONO</label>

                        <div className="flex items-center gap-[20px]">
                            <div className="text-text-low text-[20px] flex items-center justify-center">&</div>
                            <input type="tel" placeholder="+34 600 000 000" pattern="[+]{1}[0-9]{2} [0-9]{3} [0-9]{3} [0-9]{3}" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" defaultValue="+34 600 000 000"/>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

                    <div className="flex items-center gap-[5px]">

                        <div className="flex flex-col gap-[5px]">
                            <label className="font-subheading font-bold text-[16px] text-text-low">FECHA DE NACIMIENTO</label>
                            
                            <div className="flex items-center gap-[20px]">
                                <div className="text-text-low text-[20px] flex items-center justify-center">&</div>
                                <input type="date" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full"/>
                            </div>
                        </div>
                        
                        <div className="w-[1px] h-[50px] bg-text-low"></div> {/**Esto es una linea de división */}

                        <div className="flex flex-col gap-[5px]">
                            <label className="font-subheading font-bold text-[16px] text-text-low">PAÍS</label>

                            <div className="flex items-center gap-[10px]">
                                <div className="text-text-low text-[20px] flex items-center justify-center">&</div>

                                <select className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" defaultValue="España">
                                    <option value="España" className="bg-primary-bg text-text-high">España</option>
                                    <option value="México" className="bg-primary-bg text-text-high">México</option>
                                    <option value="Argentina" className="bg-primary-bg text-text-high">Argentina</option>
                                    <option value="Colombia" className="bg-primary-bg text-text-high">Colombia</option>
                                    <option value="Chile" className="bg-primary-bg text-text-high">Chile</option>
                                    <option value="Perú" className="bg-primary-bg text-text-high">Perú</option>
                                    <option value="Venezuela" className="bg-primary-bg text-text-high">Venezuela</option>
                                    <option value="Ecuador" className="bg-primary-bg text-text-high">Ecuador</option>
                                    <option value="Guatemala" className="bg-primary-bg text-text-high">Guatemala</option>
                                    <option value="Cuba" className="bg-primary-bg text-text-high">Cuba</option>
                                    <option value="Bolivia" className="bg-primary-bg text-text-high">Bolivia</option>
                                    <option value="República Dominicana" className="bg-primary-bg text-text-high">República Dominicana</option>
                                    <option value="Honduras" className="bg-primary-bg text-text-high">Honduras</option>
                                    <option value="Paraguay" className="bg-primary-bg text-text-high">Paraguay</option>
                                    <option value="El Salvador" className="bg-primary-bg text-text-high">El Salvador</option>
                                    <option value="Nicaragua" className="bg-primary-bg text-text-high">Nicaragua</option>
                                    <option value="Costa Rica" className="bg-primary-bg text-text-high">Costa Rica</option>
                                    <option value="Panamá" className="bg-primary-bg text-text-high">Panamá</option>
                                    <option value="Uruguay" className="bg-primary-bg text-text-high">Uruguay</option>
                                    <option value="Puerto Rico" className="bg-primary-bg text-text-high">Puerto Rico</option>
                                </select>
                            </div> 
                        </div>
                    </div>
                </div>
            </Card>            
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <p className="font-subheading font-bold text-[16px] text-text-low">PREFERENCIAS</p>

            <Card>
            <div className="flex flex-col gap-[15px]">
                <div className="flex items-center justify-between">
                    <div className="flex gap-[15px] items-center justify-center">
                        <div className="bg-primary-bg h-[40px] w-[40px] rounded-[8px] text-primary flex items-center justify-center">&</div>

                        <div className="flex flex-col ">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Notificaciones</p>

                            <p className="font-subheading font-bold text-[16px] text-text-low">Aviso de entrenos</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-[15px] text-text-low">
                            v
                    </div>
                </div>

                <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

                <div className="flex items-center justify-between">
                    <div className="flex gap-[15px] items-center justify-center">
                        <div className="bg-accent2-bg2 h-[40px] w-[40px] rounded-[8px] text-accent2 flex items-center justify-center">&</div>

                        <div className="flex flex-col ">
                        <p className="font-subheading font-bold text-[16px] text-text-high">Ocultar series hechas</p>

                        <p className="font-subheading font-bold text-[16px] text-text-low">Limpia la pantalla al marcar el check</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-[15px] text-text-low">
                            v
                    </div>
                </div>

                <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

                <div className="flex items-center justify-between">
                    <div className="flex gap-[15px] items-center justify-center">
                        <div className="bg-orange-bg4 h-[40px] w-[40px] rounded-[8px] text-orange flex items-center justify-center">&</div>

                        <div className="flex flex-col ">
                        <p className="font-subheading font-bold text-[16px] text-text-high">Pantalla siempre activa</p>

                        <p className="font-subheading font-bold text-[16px] text-text-low">Evita que el móvil se bloquee mientras entrenas</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-[15px] text-text-low">
                            v
                    </div>
                </div>

                <div className="w-full h-[1px] bg-text-low"></div> {/**Esto es una linea de división */}

                <div className="flex flex-col gap-[5px]">
                    <label className="font-subheading font-bold text-[16px] text-text-low">IDIOMA DE LA APP</label>

                    <div className="flex items-center gap-[20px]">
                        <div className="text-text-low text-[20px] flex items-center justify-center">&</div>

                        <select className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" defaultValue="España">
                            <option value="Español" className="bg-primary-bg text-text-high">Español</option>
                            <option value="Inglés" className="bg-primary-bg text-text-high">Inglés</option>
                            <option value="Francés" className="bg-primary-bg text-text-high">Francés</option>
                            <option value="Alemán" className="bg-primary-bg text-text-high">Alemán</option>
                            <option value="Chino" className="bg-primary-bg text-text-high">Chino</option>
                            <option value="Italiano" className="bg-primary-bg text-text-high">Italiano</option>
                            <option value="Ruso" className="bg-primary-bg text-text-high">Ruso</option>
                        </select>
                    </div>           
                </div>
            </div>
        </Card>

        </section>


        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <Button variant="outlined" text="Crear progresión" bgColor={"bg-surf"} textColor={"text-primary"} borderColor={"border-primary"} w="w-[100%]"/> 
        </section>

        <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
            <p className="font-subheading font-bold text-[16px] text-red">ZONA DE PELIGRO</p>

            <Card>
                <button className="w-full">
                    <div className="flex items-center justify-between">  
                        <div className="flex gap-[20px] items-center justify-center">
                            <div className="bg-red-bg1 h-[40px] w-[40px] rounded-[8px] text-red flex items-center justify-center">
                                &
                            </div>

                            <div className="flex flex-col">
                                <p className="font-heading font-semibold text-[20px] text-red">
                                    Eliminar cuenta
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

export default PersonalSettings;
