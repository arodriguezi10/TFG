import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import Card from "../components/Card";
import Button from "../components/Button";
import ModalRoutineOptions from "../components/ModalRoutineOptions";

const Routines1 = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [routines, setRoutines] = useState([]);
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [activeTab, setActiveTab] = useState('routines'); // 'routines' o 'progression'
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);


  useEffect(() => {
    if (user) {
      fetchRoutines();
      loadUserSubscription();
    }
  }, [user]);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error cargando suscripción:', error);
        setSubscriptionTier('free');
      } else {
        setSubscriptionTier(data?.subscription_tier || 'free');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubscriptionTier('free');
    }
  };

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

  const handleTabClick = (tab) => {
    if (tab === 'progression' && subscriptionTier === 'free') {
      // Redirigir a suscripción si es free
      navigate('/subscription');
      return;
    }
    
    setActiveTab(tab);
    
    if (tab === 'progression') {
      navigate('/progression');
    }
  };

  const handleOpenOptions = (e, routine) => {
    e.stopPropagation();
    setSelectedRoutine(routine);
    setModalOpen(true);
  };

  const handleDuplicate = async () => {
    try {
      const { data: original } = await supabase
        .from('routines')
        .select(`*, routine_exercises(*)`)
        .eq('id', selectedRoutine.id)
        .single();

      const { data: newRoutine } = await supabase
        .from('routines')
        .insert({ ...original, id: undefined, name: `${original.name} (copia)`, created_at: undefined })
        .select()
        .single();

      if (newRoutine && original.routine_exercises?.length > 0) {
        const newExercises = original.routine_exercises.map(ex => ({
          ...ex,
          id: undefined,
          routine_id: newRoutine.id,
          created_at: undefined
        }));
        await supabase.from('routine_exercises').insert(newExercises);
      }

      await fetchRoutines();
      alert('✅ Rutina duplicada correctamente');
    } catch (err) {
      console.error(err);
      alert('❌ Error al duplicar');
    }
  };

  const handleHistory = () => {
    navigate(`/routineHistory/${selectedRoutine.id}`);
  };

  const handleShare = () => {
    alert('🔗 Función de compartir próximamente');
  };

  const handleHide = () => {
    alert('👁️ Función de ocultar próximamente');
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
    <div className="min-h-screen bg-background flex flex-col mb-2.5 px-4">
      <section className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-1.25">
          <div className="flex gap-3.75">
            <p className="font-subheading text-[12px] text-text-low">
              Biblioteca
            </p>
          </div>

          <h1 className="font-heading font-extrabold text-[28px] text-text-high flex flex-col leading-tight">
            Rutinas
          </h1>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low hover:bg-surface transition-colors cursor-pointer"
          >
            🔍
          </button>

          <div className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-low">
            ⚙️
          </div>

          <button
            onClick={handleCreateRoutine}
            className="bg-accent1 h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center text-text-high cursor-pointer hover:opacity-80 transition-opacity"
          >
            +
          </button>
        </div>
      </section>

      {/* TABS: Rutinas / Progresión */}
      <section className="mt-3 w-full border-b border-text-low">
        <div className="flex gap-8">
          <button
            onClick={() => handleTabClick('routines')}
            className={`pb-2 font-subheading font-semibold text-[15px] transition-all relative ${
              activeTab === 'routines'
                ? 'text-accent1'
                : 'text-text-low hover:text-text-high'
            }`}
          >
            Rutinas
            {activeTab === 'routines' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div>
            )}
          </button>
          
          <button
            onClick={() => handleTabClick('progression')}
            className={`pb-2 font-subheading font-semibold text-[15px] transition-all flex items-center gap-1.5 relative ${
              activeTab === 'progression'
                ? 'text-accent1'
                : subscriptionTier === 'free'
                  ? 'text-text-low/50 cursor-pointer'
                  : 'text-text-low hover:text-text-high'
            }`}
          >
            Progresión
            {subscriptionTier === 'free' && (
              <span className="text-[11px]">🔒</span>
            )}
            {activeTab === 'progression' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent1"></div>
            )}
          </button>
        </div>
      </section>

      {routines.length > 0 && (
        <section className="mt-2">
          <p className="font-body text-[14px] text-text-low">
            {routines.length} {routines.length === 1 ? 'rutina' : 'rutinas'}
          </p>
        </section>
      )}

      {showSearch && (
        <section className="mt-4 w-full">
          <input
            type="text"
            placeholder="Buscar rutina por nombre, tipo o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surf border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high placeholder-text-low outline-none focus:border-accent1 transition-colors"
          />
        </section>
      )}

      {routines.length === 0 ? (
        <>
          <section className="mt-12.5 flex flex-col items-center justify-center gap-3.75">
            <span className="bg-surf h-27.5 w-27.5 px-2.5 rounded-[35px] font-body text-[45px] text-accent1 flex items-center justify-center">
              📋
            </span>

            <p className="mt-5 bg-surf px-3.5 py-0.5 rounded-2xl border border-text-low font-subheading font-semibold text-[16px] text-text-low">
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

          <section className="mt-7.5 flex flex-col gap-2.5">
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
          <section className="mt-6 flex flex-col gap-3">
            {filteredRoutines.length === 0 ? (
              <Card>
                <div className="flex flex-col items-center justify-center py-16 gap-4">
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
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading font-bold text-[20px] text-text-high">
                              {routine.name}
                            </h3>
                            {routine.training_type && (
                              <span className="bg-accent1-bg1 px-2 py-0.5 rounded-xl border border-accent1 font-body text-[11px] text-accent1">
                                {routine.training_type}
                              </span>
                            )}
                          </div>
                          
                          {routine.description && (
                            <p className="font-body text-[13px] text-text-low mb-2">
                              {routine.description}
                            </p>
                          )}

                          <div className="flex gap-3 text-[12px] text-text-low">
                            <span>📅 {parseDays(routine.assigned_days)}</span>
                            <span>⏱️ {stats.duration} min</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleOpenOptions(e, routine)}
                          className="bg-surf h-8 w-8 rounded-lg border border-text-low flex items-center justify-center text-text-low text-[18px] hover:bg-surface transition-colors shrink-0"
                        >
                          ⋮
                        </button>
                      </div>

                      <hr className="border-text-low" />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="font-heading font-bold text-[20px] text-accent1">
                              {stats.exerciseCount}
                            </p>
                            <p className="font-body text-[11px] text-text-low">
                              Ejercicios
                            </p>
                          </div>

                          <div className="w-px bg-text-low"></div>

                          <div className="text-center">
                            <p className="font-heading font-bold text-[20px] text-accent1">
                              {stats.totalSets}
                            </p>
                            <p className="font-body text-[11px] text-text-low">
                              Series
                            </p>
                          </div>

                          <div className="w-px bg-text-low"></div>

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
                          className="bg-accent1 h-9 px-4 rounded-lg font-body text-[13px] text-text-high hover:bg-accent1/80 transition-colors"
                        >
                          Ver
                        </button>
                      </div>

                      {routine.target_muscle_groups && (
                        <div className="bg-surface rounded-lg p-2.5">
                          <p className="font-body text-[11px] text-text-low mb-1">
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

          <section className="mt-4 flex flex-col gap-2.5">
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

      {subscriptionTier !== 'elite' && (
        <section className="mt-4 pb-4">
          <button 
            onClick={handleNavigateToSubscription}
            className="w-full cursor-pointer"
          >
            <Card>
              <div className="flex items-center justify-between gap-3.75 hover:bg-surface/50 transition-colors rounded-2xl -m-4 p-4">
                <span className="bg-orange-bg2 h-15 w-15 px-2.5 rounded-2xl border border-orange font-body text-[25px] text-orange flex items-center justify-center">
                  👑
                </span>

                <div className="w-[70%] flex flex-col gap-px">
                  <div className="flex gap-0.5">
                    <div className="flex">
                      <p className="font-heading font-semibold text-[20px] text-text-high leading-tight text-left">
                        Crear <br />
                        progresión
                      </p>
                    </div>

                    <span className="bg-yellow-bg2 h-5 px-2.5 rounded-2xl border border-yellow font-body text-[12px] text-yellow">
                      ◆ ÉLITE
                    </span>
                  </div>

                  <p className="font-body text-[14px] text-text-low text-left">
                    Planifica la evolución de cargas semana a semana
                  </p>
                </div>

                <div className="bg-orange-bg2 h-9.25 w-9.25 px-2 rounded-lg border border-orange font-body text-[15px] text-orange flex items-center justify-center">
                  →
                </div>
              </div>
            </Card>
          </button>
        </section>
      )}
      <ModalRoutineOptions
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        routine={selectedRoutine}
        onDelete={() => handleDeleteRoutine(selectedRoutine?.id)}
        onDuplicate={handleDuplicate}
        onHistory={handleHistory}
        onShare={handleShare}
        onHide={handleHide}
      />
    </div>
  );
};

export default Routines1;