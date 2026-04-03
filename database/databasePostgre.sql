-- ==========================================
-- ESQUEMA DE BASE DE DATOS FYLIOS - V1.0
-- ==========================================

-- 1. CREACIÓN DE TABLAS BASE (Sin dependencias)

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('coach','athlete')) NOT NULL,
  avatar_url VARCHAR(2048) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subscription_tier TEXT CHECK (subscription_tier IN ('gratis','esencial','elite')) DEFAULT 'gratis',
  stripe_id VARCHAR(255) DEFAULT NULL,
  subscription_ends_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE exercises (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  muscle_group VARCHAR(100) NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  difficulty_level TEXT CHECK (difficulty_level IN ('principiante','intermedio','avanzado')) DEFAULT 'principiante'
);

-- 2. CREACIÓN DE TABLAS CON DEPENDENCIA DIRECTA DE USUARIOS

CREATE TABLE user_profiles (
  id BIGSERIAL PRIMARY KEY,
  birth_date DATE DEFAULT NULL,
  height INT DEFAULT NULL,
  gender TEXT CHECK (gender IN ('M','F','Other')) DEFAULT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  main_goal TEXT CHECK (main_goal IN ('hipertrofia','fuerza','perdida_grasa','mantenimiento','rendimiento')) DEFAULT NULL,
  available_equipment JSONB DEFAULT NULL,
  physical_limitations TEXT
);

CREATE TABLE coach_athlete (
  id BIGSERIAL PRIMARY KEY,
  status TEXT CHECK (status IN ('pending','active')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  coach_id BIGINT NOT NULL REFERENCES users(id),
  athlete_id BIGINT NOT NULL REFERENCES users(id)
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sender_id BIGINT NOT NULL REFERENCES users(id),
  receiver_id BIGINT NOT NULL REFERENCES users(id),
  -- Campos multimedia añadidos en el parche
  attachment_url VARCHAR(2048) DEFAULT NULL,
  attachment_type TEXT CHECK (attachment_type IN ('image', 'video', 'document', 'audio')) DEFAULT NULL
);

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type TEXT CHECK (type IN ('chat', 'routine_update', 'system', 'reminder')) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(2048) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mesocycles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  objective TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routines (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  training_type TEXT CHECK (training_type IN ('push','pull','leg','full_body','upper','lower','cardio','otros')) DEFAULT NULL,
  estimated_duration_min INT DEFAULT NULL,
  assigned_days JSONB DEFAULT NULL,
  target_muscle_groups JSONB DEFAULT NULL
);

CREATE TABLE body_measurements (
  id BIGSERIAL PRIMARY KEY,
  weight_kg DECIMAL(5,2) NOT NULL,
  waist_cm DECIMAL(5,2) DEFAULT NULL,
  body_fat_pct DECIMAL(4,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT NOT NULL REFERENCES users(id),
  chest_cm DECIMAL(5,2) DEFAULT NULL,
  arm_cm DECIMAL(5,2) DEFAULT NULL,
  leg_cm DECIMAL(5,2) DEFAULT NULL
);

-- 3. CREACIÓN DE TABLAS DE SEGUNDO NIVEL (Dependencias Múltiples)

CREATE TABLE microcycles (
  id BIGSERIAL PRIMARY KEY,
  mesocycle_id BIGINT NOT NULL REFERENCES mesocycles(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  focus_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routine_exercises (
  id BIGSERIAL PRIMARY KEY,
  order_index INT NOT NULL DEFAULT 0,
  target_sets INT NOT NULL,
  target_reps VARCHAR(50) NOT NULL,
  rest_seconds INT DEFAULT 90,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  routine_id BIGINT NOT NULL REFERENCES routines(id),
  exercise_id BIGINT NOT NULL REFERENCES exercises(id),
  target_rir INT DEFAULT NULL,
  intensity_technique TEXT CHECK (intensity_technique IN ('normal','dropset','rest_pause','superserie','topset_backoff')) DEFAULT 'normal'
);

CREATE TABLE training_sessions (
  id BIGSERIAL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP DEFAULT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  routine_id BIGINT DEFAULT NULL REFERENCES routines(id) ON DELETE SET NULL,
  session_sensations TEXT,
  microcycle_id BIGINT DEFAULT NULL REFERENCES microcycles(id) ON DELETE SET NULL
);

CREATE TABLE session_sets (
  id BIGSERIAL PRIMARY KEY,
  weight_kg DECIMAL(5,2) NOT NULL,
  reps_performed INT NOT NULL,
  rpe INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_id BIGINT NOT NULL REFERENCES training_sessions(id),
  exercise_id BIGINT NOT NULL REFERENCES exercises(id),
  set_sensations TEXT,
  -- Campo de vídeo añadido en el parche
  video_url VARCHAR(2048) DEFAULT NULL
);