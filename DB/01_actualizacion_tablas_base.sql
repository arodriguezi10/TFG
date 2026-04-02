-- 1. Modificaciones en USERS (Freemium)
ALTER TABLE users 
ADD COLUMN subscription_tier ENUM('gratis', 'esencial', 'elite') DEFAULT 'gratis',
ADD COLUMN stripe_id VARCHAR(255) NULL,
ADD COLUMN subscription_ends_at DATETIME NULL;

-- 2. Modificaciones en USER_PROFILES (Personalización)
ALTER TABLE user_profiles
ADD COLUMN main_goal ENUM('hipertrofia', 'fuerza', 'perdida_grasa', 'mantenimiento', 'rendimiento') NULL,
ADD COLUMN available_equipment JSON NULL,
ADD COLUMN physical_limitations TEXT NULL;

-- 3. Modificaciones en EXERCISES (Niveles)
ALTER TABLE exercises 
ADD COLUMN difficulty_level ENUM('principiante', 'intermedio', 'avanzado') DEFAULT 'principiante';

-- 4. Modificaciones en ROUTINES (Metadatos de la pantalla Crear Rutina)
ALTER TABLE routines
ADD COLUMN training_type ENUM('push', 'pull', 'leg', 'full_body', 'upper', 'lower', 'cardio', 'otros') NULL,
ADD COLUMN estimated_duration_min INT NULL,
ADD COLUMN assigned_days JSON NULL,
ADD COLUMN target_muscle_groups JSON NULL;

-- 5. Modificaciones en ROUTINE_EXERCISES (Intensidad Avanzada)
ALTER TABLE routine_exercises 
ADD COLUMN target_rir INT NULL,
ADD COLUMN intensity_technique ENUM('normal', 'dropset', 'rest_pause', 'superserie', 'topset_backoff') DEFAULT 'normal';

-- 6. Modificaciones en TRAINING_SESSIONS y SESSION_SETS (Feedback)
ALTER TABLE training_sessions
ADD COLUMN session_sensations TEXT NULL;

ALTER TABLE session_sets
ADD COLUMN set_sensations TEXT NULL;

-- 7. Modificaciones en BODY_MEASUREMENTS (Métricas Élite)
ALTER TABLE body_measurements 
ADD COLUMN chest_cm DECIMAL(5,2) NULL,
ADD COLUMN arm_cm DECIMAL(5,2) NULL,
ADD COLUMN leg_cm DECIMAL(5,2) NULL;