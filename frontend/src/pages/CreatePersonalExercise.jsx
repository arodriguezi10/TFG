import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';

const CreatePersonalExercise = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: '',
    equipment: '',
    difficulty: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Validación
    if (!formData.name.trim()) {
      setError('El nombre del ejercicio es obligatorio');
      return;
    }
    if (!formData.muscleGroup) {
      setError('Selecciona un grupo muscular');
      return;
    }
    if (!formData.equipment) {
      setError('Selecciona el tipo de equipamiento');
      return;
    }
    if (!formData.difficulty) {
      setError('Selecciona el nivel de dificultad');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data, error: insertError } = await supabase
        .from('exercises')
        .insert([
          {
            name: formData.name.trim(),
            muscle_group: formData.muscleGroup,
            equipment: formData.equipment,
            difficulty_level: formData.difficulty,
            is_custom: true,
            user_id: user.id, 
          },
        ])
        .select();

      if (insertError) {
        console.error('Error al crear ejercicio:', insertError);
        setError('Error al guardar el ejercicio. Inténtalo de nuevo.');
        return;
      }

      console.log('Ejercicio creado:', data);
      
      // Volver atrás después de crear
      navigate(-1);
      
    } catch (err) {
      console.error('Error inesperado:', err);
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col mb-[10px]">
      
      {/* HEADER */}
      <section className="w-full">
        <Header
          showback
          subtitle="Ejercicios"
          title="Crear ejercicio"
        />
      </section>

      {/* MENSAJE DE ERROR */}
      {error && (
        <section className="mt-[16px] w-full px-[16px]">
          <div className="rounded-[16px] bg-red/10 border border-red p-[14px]">
            <p className="font-body text-[13px] text-red">{error}</p>
          </div>
        </section>
      )}

      {/* FORMULARIO */}
      <section className="mt-[16px] w-full px-[16px] flex flex-col gap-[10px]">
        <Card>
          <div className="flex flex-col gap-[15px]">
            
            {/* Nombre del ejercicio */}
            <div className="flex flex-col gap-[5px]">
            <label className="font-subheading font-bold text-[14px] text-text-low uppercase tracking-wide">
                Nombre del ejercicio
            </label>
            <Input
                variant="outlined"
                type="text"
                name="name" 
                placeholder="Ej: Press inclinado con mancuernas"
                value={formData.name}
                onChange={handleInputChange}
            />
            </div>

            <div className="w-full h-[1px] bg-border"></div>

            {/* Grupo muscular */}
            <div className="flex flex-col gap-[5px]">
              <label className="font-subheading font-bold text-[14px] text-text-low uppercase">
                Grupo muscular principal
              </label>
              
              <div className="flex gap-[8px] flex-wrap">
                {['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Cuádriceps', 'Femoral', 'Glúteo', 'Gemelo', 'Core'].map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => setFormData({ ...formData, muscleGroup: muscle })}
                    className={`px-[12px] py-[6px] rounded-[16px] border font-body text-[14px] transition-colors ${
                      formData.muscleGroup === muscle
                        ? 'bg-primary-bg border-primary text-primary'
                        : 'bg-surf border-text-low text-text-low'
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[1px] bg-border"></div>

            {/* Equipamiento */}
            <div className="flex flex-col gap-[5px]">
              <label className="font-subheading font-bold text-[14px] text-text-low uppercase">
                Tipo de equipamiento
              </label>
              
              <div className="flex gap-[8px] flex-wrap">
                {['Peso libre', 'Máquina', 'Polea', 'Peso corporal', 'Bandas'].map((equip) => (
                  <button
                    key={equip}
                    onClick={() => setFormData({ ...formData, equipment: equip })}
                    className={`px-[12px] py-[6px] rounded-[16px] border font-body text-[14px] transition-colors ${
                      formData.equipment === equip
                        ? 'bg-primary-bg border-primary text-primary'
                        : 'bg-surf border-text-low text-text-low'
                    }`}
                  >
                    {equip}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-[1px] bg-border"></div>

            {/* Nivel de dificultad */}
            <div className="flex flex-col gap-[5px]">
              <label className="font-subheading font-bold text-[14px] text-text-low uppercase">
                Nivel de dificultad
              </label>
              
              <div className="flex gap-[8px]">
                <button
                  onClick={() => setFormData({ ...formData, difficulty: 'Principiante' })}
                  className={`flex-1 px-[12px] py-[8px] rounded-[16px] border font-body text-[14px] transition-colors ${
                    formData.difficulty === 'Principiante'
                      ? 'bg-green-bg2 border-accent2 text-accent2'
                      : 'bg-surf border-text-low text-text-low'
                  }`}
                >
                  Principiante
                </button>

                <button
                  onClick={() => setFormData({ ...formData, difficulty: 'Intermedio' })}
                  className={`flex-1 px-[12px] py-[8px] rounded-[16px] border font-body text-[14px] transition-colors ${
                    formData.difficulty === 'Intermedio'
                      ? 'bg-orange-bg2 border-orange text-orange'
                      : 'bg-surf border-text-low text-text-low'
                  }`}
                >
                  Intermedio
                </button>

                <button
                  onClick={() => setFormData({ ...formData, difficulty: 'Avanzado' })}
                  className={`flex-1 px-[12px] py-[8px] rounded-[16px] border font-body text-[14px] transition-colors ${
                    formData.difficulty === 'Avanzado'
                      ? 'bg-accent1-bg1 border-accent1 text-accent1'
                      : 'bg-surf border-text-low text-text-low'
                  }`}
                >
                  Avanzado
                </button>
              </div>
            </div>

          </div>
        </Card>
      </section>

      {/* INFO CARD */}
      <section className="mt-[16px] w-full px-[16px]">
        <div className="rounded-[16px] bg-primary-bg/50 border border-primary/30 p-[14px] flex items-start gap-[12px]">
          <span className="text-primary text-[20px] flex-shrink-0">ℹ️</span>
          <p className="font-body text-[13px] text-text-low leading-relaxed">
            Los ejercicios personalizados se guardan en tu biblioteca y solo estarán disponibles para ti. Podrás editarlos o eliminarlos en cualquier momento.
          </p>
        </div>
      </section>

      {/* PREVIEW CARD */}
      {formData.name && (
        <section className="mt-[16px] w-full px-[16px]">
          <p className="font-subheading font-bold text-[14px] text-text-low mb-[10px] uppercase">
            Vista previa
          </p>
          <Card>
            <div className="flex items-center justify-between gap-[12px]">
              <div className="flex items-center gap-[10px]">
                <span className="bg-primary-bg h-[50px] w-[50px] rounded-[12px] border border-primary font-heading font-extrabold text-[18px] text-primary flex items-center justify-center">
                  ⚡
                </span>

                <div className="flex flex-col">
                  <p className="font-subheading font-bold text-[16px] text-text-high">
                    {formData.name || 'Nombre del ejercicio'}
                  </p>

                  <p className="font-body text-[12px] text-text-low">
                    {formData.muscleGroup || 'Grupo muscular'} · {formData.equipment || 'Equipamiento'}
                  </p>

                  <div className="mt-[3px] flex gap-[6px]">
                    {formData.difficulty && (
                      <span className={`h-auto px-[10px] rounded-[16px] border font-body text-[12px] ${
                        formData.difficulty === 'Principiante' 
                          ? 'bg-green-bg2 border-accent2 text-accent2'
                          : formData.difficulty === 'Intermedio'
                          ? 'bg-orange-bg2 border-orange text-orange'
                          : 'bg-accent1-bg1 border-accent1 text-accent1'
                      }`}>
                        {formData.difficulty}
                      </span>
                    )}
                    <span className="bg-surface h-auto px-[10px] rounded-[16px] border border-text-low font-body text-[12px] text-text-low">
                      Personalizado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* STICKY BUTTON */}
      <section className="mt-[16px] w-full px-[16px] fixed bottom-1">
        <Button
          variant="outlined"
          text={loading ? "Guardando..." : "Guardar ejercicio"}
          bgColor="bg-primary"
          textColor="text-text-high"
          borderColor="border-primary"
          w="w-full"
          onClick={handleSubmit}
          disabled={loading}
        />
      </section>

    </div>
  );
};

export default CreatePersonalExercise;