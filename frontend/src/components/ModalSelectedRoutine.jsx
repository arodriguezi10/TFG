import React from "react";

const ModalSelectRoutine = ({ isOpen, onClose, routines, onSelectRoutine, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-surf border border-text-low rounded-2xl w-[90%] max-w-md max-h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-text-low flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-[18px] text-text-high">
              Seleccionar rutina
            </h2>
            <p className="font-body text-[12px] text-text-low">
              {routines.length} rutinas disponibles
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-background h-9 w-9 rounded-lg border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Lista de rutinas */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-body text-text-low">Cargando rutinas...</p>
            </div>
          ) : routines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="text-[48px]">📋</span>
              <p className="font-heading font-bold text-[16px] text-text-high">
                No tienes rutinas
              </p>
              <p className="font-body text-[13px] text-text-low text-center">
                Crea una rutina primero para poder añadirla al bloque
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {routines.map((routine) => (
                <button
                  key={routine.id}
                  onClick={() => onSelectRoutine(routine)}
                  className="w-full bg-background border border-text-low rounded-xl p-3 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-heading font-bold text-[15px] text-text-high mb-1">
                        {routine.name}
                      </p>
                      <div className="flex gap-3 text-[11px] text-text-low">
                        <span>💪 {routine.routine_exercises?.length || 0} ejercicios</span>
                        {routine.target_muscle_groups && (
                          <span>🎯 {routine.target_muscle_groups.slice(0, 20)}...</span>
                        )}
                      </div>
                    </div>
                    <div className="text-[20px]">→</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalSelectRoutine;