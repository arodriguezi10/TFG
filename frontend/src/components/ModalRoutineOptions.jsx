import React from "react";

const ModalRoutineOptions = ({ isOpen, onClose, routine, onDelete, onDuplicate, onHistory, onShare, onHide }) => {
  if (!isOpen) return null;

  const options = [
    {
      icon: "📋",
      label: "Duplicar rutina",
      sublabel: "Crea una copia exacta",
      color: "text-text-high",
      borderColor: "border-text-low",
      bgColor: "bg-surf",
      onClick: () => { onDuplicate(); onClose(); }
    },
    {
      icon: "📊",
      label: "Ver historial",
      sublabel: "Sesiones completadas",
      color: "text-text-high",
      borderColor: "border-text-low",
      bgColor: "bg-surf",
      onClick: () => { onHistory(); onClose(); }
    },
    {
      icon: "🔗",
      label: "Compartir rutina",
      sublabel: "Exporta o comparte",
      color: "text-text-high",
      borderColor: "border-text-low",
      bgColor: "bg-surf",
      onClick: () => { onShare(); onClose(); }
    },
    {
      icon: "👁️",
      label: "Ocultar rutina",
      sublabel: "No aparecerá en el panel",
      color: "text-text-high",
      borderColor: "border-text-low",
      bgColor: "bg-surf",
      onClick: () => { onHide(); onClose(); }
    },
    {
      icon: "🗑️",
      label: "Eliminar rutina",
      sublabel: "Esta acción no se puede deshacer",
      color: "text-red",
      borderColor: "border-red",
      bgColor: "bg-red/5",
      onClick: () => { onDelete(); onClose(); }
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
  <div
    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
    onClick={onClose}
  />
  <div className="relative w-[90%] max-w-md bg-surf border border-text-low rounded-3xl overflow-hidden">
    {/* Handle */}
    <div className="flex justify-center pt-3 pb-1">
      <div className="w-10 h-1 bg-text-low/40 rounded-full" />
    </div>

    {/* Header */}
    <div className="px-5 pt-2 pb-4 border-b border-text-low">
      <p className="font-subheading text-[11px] text-text-low uppercase tracking-wide mb-0.5">
        Rutina
      </p>
      <h2 className="font-heading font-bold text-[18px] text-text-high">
        {routine?.name}
      </h2>
    </div>

    {/* Options */}
    <div className="p-4 flex flex-col gap-2 pb-6">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={option.onClick}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border ${option.borderColor} ${option.bgColor} hover:opacity-80 transition-opacity text-left`}
        >
          <span className="text-[22px] w-8 flex items-center justify-center shrink-0">
            {option.icon}
          </span>
          <div className="flex-1">
            <p className={`font-heading font-semibold text-[15px] ${option.color}`}>
              {option.label}
            </p>
            <p className="font-body text-[12px] text-text-low">
              {option.sublabel}
            </p>
          </div>
          <span className={`text-[16px] ${option.color} opacity-50`}>›</span>
        </button>
      ))}
    </div>
  </div>
    </div>
  );
};

export default ModalRoutineOptions;