-- Agregar campo is_hidden a la tabla routines
-- Permite a los usuarios ocultar rutinas sin eliminarlas

ALTER TABLE routines
ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;

-- Crear un índice para optimizar las búsquedas
CREATE INDEX idx_routines_user_hidden ON routines(user_id, is_hidden);
