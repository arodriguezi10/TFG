import React from "react";
import { X, Mail, ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    question: "¿Cómo cancelo mi suscripción?",
    answer: "Ve a Perfil → Suscripción y pagos → Cancelar suscripción. Seguirás teniendo acceso hasta el fin del periodo de facturación."
  },
  {
    question: "¿Cómo cambio mi contraseña?",
    answer: "Ve a Perfil → Ajustes y datos personales → Cambiar contraseña. También puedes usar '¿Olvidaste la contraseña?' en la pantalla de login."
  },
  {
    question: "¿Puedo cambiar mi plan en cualquier momento?",
    answer: "Sí, puedes subir o bajar de plan cuando quieras desde Perfil → Suscripción y pagos."
  },
  {
    question: "¿Cómo elimino mi cuenta?",
    answer: "Ve a Perfil → Ajustes y datos personales → Eliminar cuenta. Esta acción es irreversible y eliminará todos tus datos."
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-text-low/20 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3 text-left">
        <p className="font-subheading font-bold text-[14px] text-text-high pr-4">{question}</p>
        {open ? <ChevronUp size={16} className="text-text-low shrink-0" /> : <ChevronDown size={16} className="text-text-low shrink-0" />}
      </button>
      {open && <p className="font-body text-[13px] text-text-low pb-3 leading-relaxed">{answer}</p>}
    </div>
  );
};

const SupportModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-999 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg bg-background rounded-t-3xl p-6 pb-10" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide">Perfil</p>
            <h2 className="font-heading font-extrabold text-[22px] text-text-high">Soporte / Ayuda</h2>
          </div>
          <button onClick={onClose} className="bg-surf h-9 w-9 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* FAQ */}
        <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Preguntas frecuentes</p>
        <div className="bg-surf border border-text-low/20 rounded-2xl px-4 mb-5">
          {FAQS.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </div>

        {/* CONTACTO */}
        <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-3">Contacto</p>
        <button
          onClick={() => window.location.href = "mailto:soporte@fylios.com?subject=Soporte FYLIOS"}
          className="w-full bg-primary border border-primary rounded-2xl py-3.5 font-heading font-bold text-[15px] text-text-high flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Mail size={18} /> Enviar email a soporte
        </button>
        <p className="font-body text-[12px] text-text-low text-center mt-2">soporte@fylios.com · Respondemos en menos de 24h</p>
      </div>
    </div>
  );
};

export default SupportModal;