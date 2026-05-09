import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";
import { User, Cake, Phone, Venus, Ruler, Scale, FileText, Globe, Bell, Eye, Smartphone, Trash2, ChevronRight } from "lucide-react";
import { COUNTRIES, loadUserData, saveChanges, deleteAccount } from "../utils/personalSettingsUtils";

const Toggle = ({ value, onToggle }) => (
  <button onClick={onToggle} className={`relative inline-flex h-7.75 w-12.75 shrink-0 items-center rounded-full transition-all ${value ? 'bg-primary' : 'bg-background border-2 border-text-low'}`}>
    <span className={`inline-block h-6.75 w-6.75 transform rounded-full transition-transform ${value ? 'translate-x-5.5 bg-text-high' : 'translate-x-0.5 bg-text-low'}`} />
  </button>
);

const PersonalSettingsMobile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", birthDate: "", sex: "", height_cm: "", initial_weight_kg: "", bio: "", country: "España" });
  const [originalData, setOriginalData] = useState({});
  const [changedFields, setChangedFields] = useState(new Set());
  const [preferences, setPreferences] = useState({ notifications: true, hideCompletedSets: false, keepScreenOn: false });

  useEffect(() => {
    if (user) loadUserData(user.id, setFormData, setOriginalData, setLoading);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setChangedFields(prev => {
      const newSet = new Set(prev);
      value !== originalData[name] ? newSet.add(name) : newSet.delete(name);
      return newSet;
    });
  };

  const handleToggle = (key) => setPreferences(prev => ({ ...prev, [key]: !prev[key] }));

  const fieldClass = (field) => `flex items-center gap-5 ${changedFields.has(field) ? 'bg-primary-bg rounded-lg px-2 py-1' : ''}`;

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="font-body text-text-low">Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col mb-2.5">
      <section className="w-full">
        <Header showback subtitle="perfil" title="Ajustes personales" />
      </section>

      <section className="mt-6.25 flex flex-col items-center gap-3.75">
        <span className="bg-primary-bg h-27.5 w-27.5 px-2.5 rounded-[35px] border border-primary font-heading font-bold text-[50px] text-accent1 flex items-center justify-center">
          {formData.fullName.charAt(0).toUpperCase() || "U"}
        </span>
        <p className="font-subheading font-bold text-[16px] text-primary text-center">Cambiar foto de perfil</p>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-text-low">DATOS PERSONALES</p>
        <Card>
          <div className="flex flex-col gap-3.75">
            {/* NOMBRE */}
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[16px] text-text-low">NOMBRE COMPLETO</label>
              <div className={fieldClass('fullName')}>
                <User size={20} className="text-text-low shrink-0" />
                <input type="text" name="fullName" placeholder="Tu nombre completo" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={formData.fullName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="w-full h-px bg-text-low" />

            {/* FECHA */}
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[16px] text-text-low">FECHA DE NACIMIENTO</label>
              <div className={fieldClass('birthDate')}>
                <Cake size={20} className="text-text-low shrink-0" />
                <input type="date" name="birthDate" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={formData.birthDate} onChange={handleInputChange} />
              </div>
            </div>
            <div className="w-full h-px bg-text-low" />

            {/* TELEFONO */}
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[16px] text-text-low">TELEFONO</label>
              <div className={fieldClass('phone')}>
                <Phone size={20} className="text-text-low shrink-0" />
                <input type="tel" name="phone" placeholder="+34 600 000 000" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>
            <div className="w-full h-px bg-text-low" />

            {/* SEXO */}
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[16px] text-text-low">SEXO</label>
              <div className={fieldClass('sex')}>
                <Venus size={20} className="text-text-low shrink-0" />
                <select name="sex" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" value={formData.sex} onChange={handleInputChange}>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="w-full h-px bg-text-low" />

            {/* ALTURA Y PESO */}
            <div className="flex items-center gap-1.25">
              <div className="flex flex-col gap-1.25 flex-1">
                <label className="font-subheading font-bold text-[16px] text-text-low">ALTURA (CM)</label>
                <div className={fieldClass('height_cm')}>
                  <Ruler size={20} className="text-text-low shrink-0" />
                  <input type="number" name="height_cm" placeholder="178" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={formData.height_cm} onChange={handleInputChange} />
                </div>
              </div>
              <div className="w-px h-12.5 bg-text-low" />
              <div className="flex flex-col gap-1.25 flex-1">
                <label className="font-subheading font-bold text-[16px] text-text-low">PESO (KG)</label>
                <div className={fieldClass('initial_weight_kg')}>
                  <Scale size={20} className="text-text-low shrink-0" />
                  <input type="number" name="initial_weight_kg" step="0.1" placeholder="75.5" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full" value={formData.initial_weight_kg} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-text-low" />

            {/* BIO */}
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[16px] text-text-low">BIO</label>
              <div className={`flex items-start gap-5 ${changedFields.has('bio') ? 'bg-primary-bg rounded-lg px-2 py-1' : ''}`}>
                <FileText size={20} className="text-text-low shrink-0 mt-1" />
                <textarea name="bio" placeholder="Cuentanos sobre ti..." rows="3" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full resize-none" value={formData.bio} onChange={handleInputChange} />
              </div>
            </div>
            <div className="w-full h-px bg-text-low" />

            {/* PAIS */}
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[16px] text-text-low">PAIS</label>
              <div className={fieldClass('country')}>
                <Globe size={20} className="text-text-low shrink-0" />
                <select name="country" className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" value={formData.country} onChange={handleInputChange}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                <div className="bg-primary-bg h-10 w-10 rounded-lg flex items-center justify-center shrink-0"><Bell size={18} className="text-primary" /></div>
                <div className="flex flex-col">
                  <p className="font-subheading font-bold text-[16px] text-text-high">Notificaciones</p>
                  <p className="font-subheading font-bold text-[14px] text-text-low">Aviso de entrenos</p>
                </div>
              </div>
              <Toggle value={preferences.notifications} onToggle={() => handleToggle('notifications')} />
            </div>
            <div className="w-full h-px bg-text-low" />
            <div className="flex items-center justify-between">
              <div className="flex gap-3.75 items-center flex-1">
                <div className="bg-accent2-bg2 h-10 w-10 rounded-lg flex items-center justify-center shrink-0"><Eye size={18} className="text-accent2" /></div>
                <div className="flex flex-col">
                  <p className="font-subheading font-bold text-[16px] text-text-high">Ocultar series hechas</p>
                  <p className="font-subheading font-bold text-[14px] text-text-low">Limpia la pantalla al marcar</p>
                </div>
              </div>
              <Toggle value={preferences.hideCompletedSets} onToggle={() => handleToggle('hideCompletedSets')} />
            </div>
            <div className="w-full h-px bg-text-low" />
            <div className="flex items-center justify-between">
              <div className="flex gap-3.75 items-center flex-1">
                <div className="bg-orange-bg4 h-10 w-10 rounded-lg flex items-center justify-center shrink-0"><Smartphone size={18} className="text-orange" /></div>
                <div className="flex flex-col">
                  <p className="font-subheading font-bold text-[16px] text-text-high">Pantalla siempre activa</p>
                  <p className="font-subheading font-bold text-[14px] text-text-low">Evita que se bloquee</p>
                </div>
              </div>
              <Toggle value={preferences.keepScreenOn} onToggle={() => handleToggle('keepScreenOn')} />
            </div>
            <div className="w-full h-px bg-text-low" />
            <div className="flex flex-col gap-1.25">
              <label className="font-subheading font-bold text-[16px] text-text-low">IDIOMA DE LA APP</label>
              <div className="flex items-center gap-5">
                <Globe size={20} className="text-text-low shrink-0" />
                <select className="font-subheading font-bold text-[16px] text-text-high bg-transparent border-none outline-none w-full cursor-pointer appearance-none" defaultValue="Español">
                  <option value="Español">Español</option>
                  <option value="Inglés">Ingles</option>
                  <option value="Francés">Frances</option>
                  <option value="Portugués">Portugues</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <Button variant="outlined" text="Cambiar contrasena" bgColor="bg-surf" textColor="text-primary" borderColor="border-primary" w="w-[100%]" onClick={() => navigate("/forgotPassword")} />
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <Button variant="outlined" text={saving ? "Guardando..." : "Guardar cambios"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-[100%]" onClick={() => saveChanges(user.id, formData, changedFields, setOriginalData, setChangedFields, setSaving)} disabled={saving || changedFields.size === 0} />
      </section>

      <section className="mt-4 w-full px-4 flex flex-col gap-2.5">
        <p className="font-subheading font-bold text-[16px] text-red">ZONA DE PELIGRO</p>
        <Card>
          <button className="w-full" onClick={() => deleteAccount(navigate)}>
            <div className="flex items-center justify-between">
              <div className="flex gap-5 items-center">
                <div className="bg-red-bg1 h-10 w-10 rounded-lg flex items-center justify-center"><Trash2 size={18} className="text-red" /></div>
                <p className="font-heading font-semibold text-[20px] text-red">Eliminar cuenta</p>
              </div>
              <ChevronRight size={18} className="text-red" />
            </div>
          </button>
        </Card>
      </section>
    </div>
  );
};

export default PersonalSettingsMobile;