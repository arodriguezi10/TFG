import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { User, Cake, Phone, Venus, Ruler, Scale, FileText, Globe, Bell, Eye, Smartphone, Trash2, ChevronLeft, Lock } from "lucide-react";
import { COUNTRIES, loadUserData, saveChanges, deleteAccount } from "../utils/personalSettingsUtils";

const Toggle = ({ value, onToggle }) => (
  <button onClick={onToggle} className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all ${value ? 'bg-primary' : 'bg-background border-2 border-text-low'}`}>
    <span className={`inline-block h-6 w-6 transform rounded-full transition-transform ${value ? 'translate-x-5 bg-text-high' : 'translate-x-0.5 bg-text-low'}`} />
  </button>
);

const FormField = ({ label, icon, children, changed }) => (
  <div className="flex flex-col gap-1.5">
    <label className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide">{label}</label>
    <div className={`flex items-center gap-3 ${changed ? 'bg-primary-bg rounded-lg px-3 py-2' : ''}`}>
      <span className="text-text-low shrink-0">{icon}</span>
      {children}
    </div>
  </div>
);

const PersonalSettingsDesktop = () => {
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

  const inputClass = "font-subheading font-bold text-[14px] text-text-high bg-transparent border-none outline-none w-full";

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="font-body text-text-low">Cargando...</p></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/profile")} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Perfil</p>
            <h1 className="font-heading font-extrabold text-[28px] text-text-high">Ajustes personales</h1>
          </div>
        </div>
        <Button variant="outlined" text={saving ? "Guardando..." : "Guardar cambios"} bgColor="bg-primary" textColor="text-text-high" borderColor="border-primary" w="w-auto px-6" onClick={() => saveChanges(user.id, formData, changedFields, setOriginalData, setChangedFields, setSaving)} disabled={saving || changedFields.size === 0} />
      </div>

      <div className="flex-1 px-8 py-6 grid grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA — AVATAR */}
        <div className="flex flex-col gap-5">
          <Card>
            <div className="flex flex-col items-center gap-4 py-4">
              <span className="bg-primary-bg h-24 w-24 rounded-3xl border border-primary font-heading font-bold text-[48px] text-accent1 flex items-center justify-center">
                {formData.fullName.charAt(0).toUpperCase() || "U"}
              </span>
              <p className="font-subheading font-bold text-[14px] text-primary text-center">Cambiar foto de perfil</p>
            </div>
          </Card>

          {/* PREFERENCIAS */}
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Preferencias</p>
            <div className="flex flex-col gap-4 divide-y divide-text-low/20">
              {[
                { key: 'notifications', icon: <Bell size={16} className="text-primary" />, label: 'Notificaciones', sub: 'Aviso de entrenos', bg: 'bg-primary-bg' },
                { key: 'hideCompletedSets', icon: <Eye size={16} className="text-accent2" />, label: 'Ocultar series hechas', sub: 'Limpia la pantalla', bg: 'bg-accent2-bg2' },
                { key: 'keepScreenOn', icon: <Smartphone size={16} className="text-orange" />, label: 'Pantalla activa', sub: 'Evita que se bloquee', bg: 'bg-orange-bg4' },
              ].map(({ key, icon, label, sub, bg }) => (
                <div key={key} className="flex items-center justify-between pt-3 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className={`${bg} h-8 w-8 rounded-lg flex items-center justify-center shrink-0`}>{icon}</div>
                    <div>
                      <p className="font-subheading font-bold text-[13px] text-text-high">{label}</p>
                      <p className="font-body text-[11px] text-text-low">{sub}</p>
                    </div>
                  </div>
                  <Toggle value={preferences[key]} onToggle={() => handleToggle(key)} />
                </div>
              ))}
            </div>
          </Card>

          {/* ZONA PELIGRO */}
          <Card>
            <p className="font-subheading font-bold text-[12px] text-red uppercase tracking-wide mb-3">Zona de peligro</p>
            <button className="w-full flex items-center gap-3 py-2 hover:bg-red/5 transition-colors rounded-xl" onClick={() => deleteAccount(navigate)}>
              <div className="bg-red-bg1 h-9 w-9 rounded-lg flex items-center justify-center shrink-0"><Trash2 size={16} className="text-red" /></div>
              <p className="font-heading font-semibold text-[15px] text-red">Eliminar cuenta</p>
            </button>
          </Card>
        </div>

        {/* COLUMNA CENTRAL — DATOS PERSONALES */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Datos personales</p>
            <div className="flex flex-col gap-4 divide-y divide-text-low/20">
              <FormField label="Nombre completo" icon={<User size={16} />} changed={changedFields.has('fullName')}>
                <input type="text" name="fullName" placeholder="Tu nombre completo" className={inputClass} value={formData.fullName} onChange={handleInputChange} />
              </FormField>
              <div className="pt-3">
                <FormField label="Fecha de nacimiento" icon={<Cake size={16} />} changed={changedFields.has('birthDate')}>
                  <input type="date" name="birthDate" className={inputClass} value={formData.birthDate} onChange={handleInputChange} />
                </FormField>
              </div>
              <div className="pt-3">
                <FormField label="Telefono" icon={<Phone size={16} />} changed={changedFields.has('phone')}>
                  <input type="tel" name="phone" placeholder="+34 600 000 000" className={inputClass} value={formData.phone} onChange={handleInputChange} />
                </FormField>
              </div>
              <div className="pt-3">
                <FormField label="Sexo" icon={<Venus size={16} />} changed={changedFields.has('sex')}>
                  <select name="sex" className={`${inputClass} cursor-pointer appearance-none`} value={formData.sex} onChange={handleInputChange}>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </FormField>
              </div>
              <div className="pt-3 flex gap-4">
                <div className="flex-1">
                  <FormField label="Altura (cm)" icon={<Ruler size={16} />} changed={changedFields.has('height_cm')}>
                    <input type="number" name="height_cm" placeholder="178" className={inputClass} value={formData.height_cm} onChange={handleInputChange} />
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField label="Peso inicial (kg)" icon={<Scale size={16} />} changed={changedFields.has('initial_weight_kg')}>
                    <input type="number" name="initial_weight_kg" step="0.1" placeholder="75.5" className={inputClass} value={formData.initial_weight_kg} onChange={handleInputChange} />
                  </FormField>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMNA DERECHA — BIO, PAIS, IDIOMA, CONTRASENA */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-4">Perfil publico</p>
            <div className="flex flex-col gap-4 divide-y divide-text-low/20">
              <FormField label="Bio" icon={<FileText size={16} />} changed={changedFields.has('bio')}>
                <textarea name="bio" placeholder="Cuentanos sobre ti..." rows="4" className={`${inputClass} resize-none`} value={formData.bio} onChange={handleInputChange} />
              </FormField>
              <div className="pt-3">
                <FormField label="Pais" icon={<Globe size={16} />} changed={changedFields.has('country')}>
                  <select name="country" className={`${inputClass} cursor-pointer appearance-none`} value={formData.country} onChange={handleInputChange}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="pt-3">
                <FormField label="Idioma de la app" icon={<Globe size={16} />} changed={false}>
                  <select className={`${inputClass} cursor-pointer appearance-none`} defaultValue="Español">
                    <option value="Español">Español</option>
                    <option value="Inglés">Ingles</option>
                    <option value="Francés">Frances</option>
                    <option value="Portugués">Portugues</option>
                  </select>
                </FormField>
              </div>
            </div>
          </Card>

          <Card>
            <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Seguridad</p>
            <button onClick={() => navigate("/forgotPassword")} className="w-full flex items-center gap-3 py-2 hover:bg-surf transition-colors rounded-xl">
              <div className="bg-primary-bg h-9 w-9 rounded-lg flex items-center justify-center shrink-0"><Lock size={16} className="text-primary" /></div>
              <div className="flex flex-col text-left">
                <p className="font-subheading font-bold text-[14px] text-text-high">Cambiar contrasena</p>
                <p className="font-body text-[12px] text-text-low">Actualiza tu contrasena</p>
              </div>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingsDesktop;