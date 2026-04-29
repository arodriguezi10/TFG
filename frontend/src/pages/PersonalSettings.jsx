import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

const PersonalSettings = () => {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    notifications: true,
    hideCompletedSets: false,
    keepScreenOn: false
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">

        <section className="w-full flex items-center justify-between">
            <Header showback subtitle={"perfil"} title={"Ajustes personales"}/>
        </section>    

        <section className="mt-6.25 flex flex-col items-center justify-center gap-3.75">
            <span className="bg-primary-bg h-27.5 w-27.5 px-2.5 rounded-[35px] border border-primary font-heading font-bold text-[50px] text-accent1 flex items-center justify-center">
                & 
            </span>

            <p className="font-subheading font-bold text-[16px] text-primary leading-tight flex flex-col items-center justify-center text-center">
                Cambiar foto de perfil                  
            </p>
        </section>

        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
            <p className="font-subheading font-bold text-[16px] text-text-low">DATOS PERSONALES</p>

            <Card>
                <div className="flex flex-col gap-3.75">
                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[16px] text-text-low">NOMBRE COMPLETO</label>

                        <div className="flex items-center gap-5">
                            <div className="text-text-low text-[20px] flex items-center justify-center">👤</div>
                            <input 
                              type="text" 
                              placeholder="Tu nombre completo" 
                              className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" 
                              defaultValue="Santiago Segura"
                            />
                        </div>           
                    </div>

                    <div className="w-full h-px bg-text-low"></div>

                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[16px] text-text-low">FECHA DE NACIMIENTO</label>

                        <div className="flex items-center gap-5">
                            <div className="text-text-low text-[20px] flex items-center justify-center">🎂</div>
                            <input 
                              type="date" 
                              className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full"
                            />
                        </div>
                    </div>

                    <div className="w-full h-px bg-text-low"></div>

                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[16px] text-text-low">TELÉFONO</label>

                        <div className="flex items-center gap-5">
                            <div className="text-text-low text-[20px] flex items-center justify-center">📱</div>
                            <input 
                              type="tel" 
                              placeholder="+34 600 000 000" 
                              pattern="[+]{1}[0-9]{2} [0-9]{3} [0-9]{3} [0-9]{3}" 
                              className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" 
                              defaultValue="+34 600 000 000"
                            />
                        </div>
                    </div>

                    <div className="w-full h-px bg-text-low"></div>

                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[16px] text-text-low">SEXO</label>

                        <div className="flex items-center gap-5">
                            <div className="text-text-low text-[20px] flex items-center justify-center">⚧️</div>
                            <select 
                              className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" 
                              defaultValue="Masculino"
                            >
                                <option value="Masculino" className="bg-primary-bg text-text-high">Masculino</option>
                                <option value="Femenino" className="bg-primary-bg text-text-high">Femenino</option>
                                <option value="Otro" className="bg-primary-bg text-text-high">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full h-px bg-text-low"></div>

                    <div className="flex items-center gap-1.25">
                        <div className="flex flex-col gap-1.25 flex-1">
                            <label className="font-subheading font-bold text-[16px] text-text-low">ALTURA (CM)</label>
                            
                            <div className="flex items-center gap-5">
                                <div className="text-text-low text-[20px] flex items-center justify-center">📏</div>
                                <input 
                                  type="number" 
                                  placeholder="178" 
                                  className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full"
                                  defaultValue="178"
                                />
                            </div>
                        </div>
                        
                        <div className="w-px h-12.5 bg-text-low"></div>

                        <div className="flex flex-col gap-1.25 flex-1">
                            <label className="font-subheading font-bold text-[16px] text-text-low">PESO INICIAL (KG)</label>

                            <div className="flex items-center gap-2.5">
                                <div className="text-text-low text-[20px] flex items-center justify-center">⚖️</div>
                                <input 
                                  type="number" 
                                  step="0.1"
                                  placeholder="75.5" 
                                  className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full"
                                  defaultValue="75.5"
                                />
                            </div> 
                        </div>
                    </div>

                    <div className="w-full h-px bg-text-low"></div>

                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[16px] text-text-low">BIO</label>

                        <div className="flex items-start gap-5">
                            <div className="text-text-low text-[20px] flex items-center justify-center mt-1">📝</div>
                            <textarea 
                              placeholder="Cuéntanos sobre ti..." 
                              rows="3"
                              className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full resize-none"
                              defaultValue="Me encanta entrenar y mantenerme en forma"
                            />
                        </div>
                    </div>

                    <div className="w-full h-px bg-text-low"></div>

                    <div className="flex flex-col gap-1.25">
                        <label className="font-subheading font-bold text-[16px] text-text-low">PAÍS</label>

                        <div className="flex items-center gap-5">
                            <div className="text-text-low text-[20px] flex items-center justify-center">🌍</div>

                            <select 
                              className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" 
                              defaultValue="España"
                            >
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
            </Card>            
        </section>

        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
            <p className="font-subheading font-bold text-[16px] text-text-low">PREFERENCIAS</p>

            <Card>
              <div className="flex flex-col gap-3.75">
                <div className="flex items-center justify-between">
                    <div className="flex gap-3.75 items-center flex-1">
                        <div className="bg-primary-bg h-10 w-10 rounded-lg text-primary flex items-center justify-center shrink-0">🔔</div>

                        <div className="flex flex-col">
                            <p className="font-subheading font-bold text-[16px] text-text-high">Notificaciones</p>
                            <p className="font-subheading font-bold text-[14px] text-text-low">Aviso de entrenos</p>
                        </div>
                    </div>

                    <button
                      onClick={() => handleToggle('notifications')}
                      className={`relative inline-flex h-7.75 w-12.75 shrink-0 items-center rounded-full transition-all ${
                        preferences.notifications 
                          ? 'bg-primary' 
                          : 'bg-background border-2 border-text-low'
                      }`}
                    >
                      <span
                        className={`inline-block h-6.75 w-6.75 transform rounded-full transition-transform ${
                          preferences.notifications 
                            ? 'translate-x-5.5 bg-text-high' 
                            : 'translate-x-0.5 bg-text-low'
                        }`}
                      />
                    </button>
                </div>

                <div className="w-full h-px bg-text-low"></div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-3.75 items-center flex-1">
                        <div className="bg-accent2-bg2 h-10 w-10 rounded-lg text-accent2 flex items-center justify-center shrink-0">👁️</div>

                        <div className="flex flex-col">
                          <p className="font-subheading font-bold text-[16px] text-text-high">Ocultar series hechas</p>
                          <p className="font-subheading font-bold text-[14px] text-text-low">Limpia la pantalla al marcar</p>
                        </div>
                    </div>

                    <button
                      onClick={() => handleToggle('hideCompletedSets')}
                      className={`relative inline-flex h-7.75 w-12.75 shrink-0 items-center rounded-full transition-all ${
                        preferences.hideCompletedSets 
                          ? 'bg-primary' 
                          : 'bg-background border-2 border-text-low'
                      }`}
                    >
                      <span
                        className={`inline-block h-6.75 w-6.75 transform rounded-full transition-transform ${
                          preferences.hideCompletedSets 
                            ? 'translate-x-5.5 bg-text-high' 
                            : 'translate-x-0.5 bg-text-low'
                        }`}
                      />
                    </button>
                </div>

                <div className="w-full h-px bg-text-low"></div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-3.75 items-center flex-1">
                        <div className="bg-orange-bg4 h-10 w-10 rounded-lg text-orange flex items-center justify-center shrink-0">📱</div>

                        <div className="flex flex-col">
                          <p className="font-subheading font-bold text-[16px] text-text-high">Pantalla siempre activa</p>
                          <p className="font-subheading font-bold text-[14px] text-text-low">Evita que se bloquee</p>
                        </div>
                    </div>

                    <button
                      onClick={() => handleToggle('keepScreenOn')}
                      className={`relative inline-flex h-7.75 w-12.75 shrink-0 items-center rounded-full transition-all ${
                        preferences.keepScreenOn 
                          ? 'bg-primary' 
                          : 'bg-background border-2 border-text-low'
                      }`}
                    >
                      <span
                        className={`inline-block h-6.75 w-6.75 transform rounded-full transition-transform ${
                          preferences.keepScreenOn 
                            ? 'translate-x-5.5 bg-text-high' 
                            : 'translate-x-0.5 bg-text-low'
                        }`}
                      />
                    </button>
                </div>

                <div className="w-full h-px bg-text-low"></div>

                <div className="flex flex-col gap-1.25">
                    <label className="font-subheading font-bold text-[16px] text-text-low">IDIOMA DE LA APP</label>

                    <div className="flex items-center gap-5">
                        <div className="text-text-low text-[20px] flex items-center justify-center">🌐</div>

                        <select 
                          className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" 
                          defaultValue="Español"
                        >
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

        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
            <Button 
              variant="outlined" 
              text="Cambiar contraseña" 
              bgColor={"bg-surf"} 
              textColor={"text-primary"} 
              borderColor={"border-primary"} 
              w="w-[100%]"
              onClick={() => navigate("/forgotPassword")}
            /> 
        </section>

        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
            <Button 
              variant="outlined" 
              text="Guardar cambios" 
              bgColor={"bg-primary"} 
              textColor={"text-text-high"} 
              borderColor={"border-primary"} 
              w="w-[100%]"
            /> 
        </section>

        <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
            <p className="font-subheading font-bold text-[16px] text-red">ZONA DE PELIGRO</p>

            <Card>
                <button className="w-full">
                    <div className="flex items-center justify-between">  
                        <div className="flex gap-5 items-center justify-center">
                            <div className="bg-red-bg1 h-10 w-10 rounded-lg text-red flex items-center justify-center">
                                🗑️
                            </div>

                            <div className="flex flex-col text-left">
                                <p className="font-heading font-semibold text-[20px] text-red">
                                    Eliminar cuenta
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3.75 text-red">
                            →
                        </div>      
                    </div>
                </button>
            </Card>
        </section>
    </div>
  );
};

export default PersonalSettings;