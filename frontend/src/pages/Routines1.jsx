import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";

const Routines1 = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [routines, setRoutines] = useState([]);
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRoutines();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRoutines(routines);
    } else {
      const filtered = routines.filter(routine =>
        routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.training_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRoutines(filtered);
    }
  }, [searchQuery, routines]);

  const fetchRoutines = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('routines')
        .select(`
          *,
          routine_exercises (
            id,
            exercise_id,
            order_index,
            target_sets,
            exercises (
              name,
              muscle_group
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar rutinas:', error);
        return;
      }

      setRoutines(data || []);
      setFilteredRoutines(data || []);
    } catch (err) {
      console.error('Error inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoutine = () => {
    navigate("/createRoutines1");
  };

  const handleNavigateToSubscription = () => {
    navigate("/subscription");
  };

  const handleEditRoutine = (routineId) => {
    navigate(`/editRoutine/${routineId}`);
  };

  const handleDeleteRoutine = async (routineId) => {
    if (window.confirm("⚠️ ¿Estás seguro de que quieres eliminar esta rutina permanentemente?\n\nEsta acción no se puede deshacer y se eliminarán todos los ejercicios asociados.")) {
      try {
        const { error } = await supabase
          .from('routines')
          .delete()
          .eq('id', routineId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error al eliminar rutina:', error);
          alert('Error al eliminar la rutina');
          return;
        }

        setRoutines(routines.filter(r => r.id !== routineId));
        setFilteredRoutines(filteredRoutines.filter(r => r.id !== routineId));
        alert('✅ Rutina eliminada correctamente');
      } catch (err) {
        console.error('Error inesperado:', err);
        alert('Error inesperado al eliminar');
      }
    }
  };

  const getRoutineStats = (routine) => {
    const exerciseCount = routine.routine_exercises?.length || 0;
    const totalSets = routine.routine_exercises?.reduce((sum, ex) => sum + (ex.target_sets || 0), 0) || 0;
    const duration = routine.estimated_duration_min || 0;
    
    return { exerciseCount, totalSets, duration };
  };

  const parseDays = (daysJson) => {
    try {
      const days = JSON.parse(daysJson);
      if (Array.isArray(days) && days.length > 0) {
        return days.map(d => d.substring(0, 3)).join(', ');
      }
      return 'No asignado';
    } catch {
      return 'No asignado';
    }
  };

  const parseMuscles = (musclesJson) => {
    try {
      const muscles = JSON.parse(musclesJson);
      if (Array.isArray(muscles) && muscles.length > 0) {
        return muscles.slice(0, 3).join(', ') + (muscles.length > 3 ? '...' : '');
      }
      return 'Sin especificar';
    } catch {
      return 'Sin especificar';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-text-low">Cargando rutinas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px] px-[16px]">
      <section className="w-[100%] flex items-center justify-between">
        <div className="flex flex-col gap-[5px]">
          <div className="flex gap-[15px]">
            <p className="font-subheading text-[12px] text-text-low">
              Biblioteca
            </p>
          </div>

          <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
            Rutinas
            {routines.length > 0 && (
              <span className="font-body text-[14px] text-text-low font-normal">
                {routines.length} {routines.length === 1 ? 'rutina' : 'rutinas'}
              </span>
            )}
          </h1>
        </div>

        <div className="flex gap-[10px]">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-low hover:bg-surface transition-colors cursor-pointer"
          >
            🔍
          </button>

          <div className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-low">
            ⚙️
          </div>

          <button
            onClick={handleCreateRoutine}
            className="bg-accent1 h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center text-text-high cursor-pointer hover:opacity-80 transition-opacity"
          >
            +
          </button>
        </div>
      </section>

      {showSearch && (
        <section className="mt-[16px] w-full">
          <input
            type="text"
            placeholder="Buscar rutina por nombre, tipo o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surf border border-text-low rounded-[12px] px-[16px] py-[12px] font-body text-[14px] text-text-high placeholder-text-low outline-none focus:border-accent1 transition-colors"
          />
        </section>
      )}

      {routines.length === 0 ? (
        <>
          <section className="mt-[50px] flex flex-col items-center justify-center gap-[15px]">
            <span className="bg-surf h-[110px] w-[110px] px-[10px] rounded-[35px] font-body text-[45px] text-accent1 flex items-center justify-center">
              📋
            </span>

            <p className="mt-[20px] bg-surf px-[14px] py-[2px] rounded-[16px] border border-text-low font-subheading font-semibold text-[16px] text-text-low">
              Sin rutinas todavía
            </p>

            <p className="font-heading font-extrabold text-[28px] text-text-high leading-tight flex flex-col items-center justify-center text-center">
              Empieza a construir tu
              <span className="text-accent1">entrenamiento</span>
            </p>

            <p className="font-body text-[16px] text-text-low text-center">
              Crea tu primera rutina y diseña cada sesión con los ejercicios que
              necesitas.
            </p>
          </section>

          <section className="mt-[30px] flex flex-col gap-[10px]">
            <Button
              variant="outlined"
              text="Crear rutina"
              bgColor={"bg-accent1"}
              textColor={"text-text-high"}
              borderColor={"border-accent1"}
              w="w-[100%]"
              onClick={handleCreateRoutine}
            />
          </section>
        </>
      ) : (
        <>
          <section className="mt-[24px] flex flex-col gap-[12px]">
            {filteredRoutines.length === 0 ? (
              <Card>
                <div className="flex flex-col items-center justify-center py-[40px] gap-[16px]">
                  <span className="text-[48px]">🔍</span>
                  <p className="font-heading font-bold text-[18px] text-text-high text-center">
                    No se encontraron rutinas
                  </p>
                  <p className="font-body text-[14px] text-text-low text-center">
                    Intenta con otra búsqueda
                  </p>
                </div>
              </Card>
            ) : (
              filteredRoutines.map((routine) => {
                const stats = getRoutineStats(routine);
                
                return (
                  <Card key={routine.id}>
                    <div className="flex flex-col gap-[12px]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-[8px] mb-[4px]">
                            <h3 className="font-heading font-bold text-[20px] text-text-high">
                              {routine.name}
                            </h3>
                            {routine.training_type && (
                              <span className="bg-accent1-bg1 px-[8px] py-[2px] rounded-[12px] border border-accent1 font-body text-[11px] text-accent1">
                                {routine.training_type}
                              </span>
                            )}
                          </div>
                          
                          {routine.description && (
                            <p className="font-body text-[13px] text-text-low mb-[8px]">
                              {routine.description}
                            </p>
                          )}

                          <div className="flex gap-[12px] text-[12px] text-text-low">
                            <span>📅 {parseDays(routine.assigned_days)}</span>
                            <span>⏱️ {stats.duration} min</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteRoutine(routine.id)}
                          className="bg-surf h-[32px] w-[32px] rounded-[8px] border border-red flex items-center justify-center text-red text-[16px] hover:bg-red/10 transition-colors flex-shrink-0"
                        >
                          🗑️
                        </button>
                      </div>

                      <hr className="border-text-low" />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-[16px]">
                          <div className="text-center">
                            <p className="font-heading font-bold text-[20px] text-accent1">
                              {stats.exerciseCount}
                            </p>
                            <p className="font-body text-[11px] text-text-low">
                              Ejercicios
                            </p>
                          </div>

                          <div className="w-[1px] bg-text-low"></div>

                          <div className="text-center">
                            <p className="font-heading font-bold text-[20px] text-accent1">
                              {stats.totalSets}
                            </p>
                            <p className="font-body text-[11px] text-text-low">
                              Series
                            </p>
                          </div>

                          <div className="w-[1px] bg-text-low"></div>

                          <div className="text-center">
                            <p className="font-heading font-bold text-[20px] text-accent1">
                              {stats.duration}
                            </p>
                            <p className="font-body text-[11px] text-text-low">
                              Minutos
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleEditRoutine(routine.id)}
                          className="bg-accent1 h-[36px] px-[16px] rounded-[8px] font-body text-[13px] text-text-high hover:bg-accent1/80 transition-colors"
                        >
                          Ver
                        </button>
                      </div>

                      {routine.target_muscle_groups && (
                        <div className="bg-surface rounded-[8px] p-[10px]">
                          <p className="font-body text-[11px] text-text-low mb-[4px]">
                            Grupos musculares:
                          </p>
                          <p className="font-body text-[12px] text-text-high">
                            {parseMuscles(routine.target_muscle_groups)}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </section>

          <section className="mt-[16px] flex flex-col gap-[10px]">
            <Button
              variant="outlined"
              text="+ Crear nueva rutina"
              bgColor={"bg-accent1-bg1"}
              textColor={"text-accent1"}
              borderColor={"border-accent1"}
              w="w-[100%]"
              onClick={handleCreateRoutine}
            />
          </section>
        </>
      )}

      <section className="mt-[16px] pb-[16px]">
        <button 
          onClick={handleNavigateToSubscription}
          className="w-full cursor-pointer"
        >
          <Card>
            <div className="flex items-center justify-between gap-[15px] hover:bg-surface/50 transition-colors rounded-[16px] -m-[16px] p-[16px]">
              <span className="bg-orange-bg2 h-[60px] w-[60px] px-[10px] rounded-[16px] border border-orange font-body text-[25px] text-orange flex items-center justify-center">
                👑
              </span>

              <div className="w-[70%] flex flex-col gap-[1px]">
                <div className="flex gap-[2px]">
                  <div className="flex">
                    <p className="font-heading font-semibold text-[20px] text-text-high leading-tight text-left">
                      Crear <br />
                      progresión
                    </p>
                  </div>

                  <span className="bg-yellow-bg2 h-[20px] px-[10px] rounded-[16px] border border-yellow font-body text-[12px] text-yellow">
                    ◆ ÉLITE
                  </span>
                </div>

                <p className="font-body text-[14px] text-text-low text-left">
                  Planifica la evolución de cargas semana a semana
                </p>
              </div>

              <div className="bg-orange-bg2 h-[37px] w-[37px] px-[8px] rounded-[8px] border border-orange font-body text-[15px] text-orange flex items-center justify-center">
                →
              </div>
            </div>
          </Card>
        </button>
      </section>
    </div>
  );
};

export default Routines1;