-- 1. Creación de la tabla MESOCYCLES (Bloques completos)
CREATE TABLE mesocycles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    objective TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Creación de la tabla MICROCYCLES (Semanas específicas)
CREATE TABLE microcycles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mesocycle_id BIGINT UNSIGNED NOT NULL,
    week_number INT NOT NULL,
    focus_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mesocycle_id) REFERENCES mesocycles(id) ON DELETE CASCADE
);

-- 3. Conexión de TRAINING_SESSIONS al microciclo
ALTER TABLE training_sessions 
ADD COLUMN microcycle_id BIGINT UNSIGNED NULL,
ADD CONSTRAINT fk_session_microcycle FOREIGN KEY (microcycle_id) REFERENCES microcycles(id) ON DELETE SET NULL;