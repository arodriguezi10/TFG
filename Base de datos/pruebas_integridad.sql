-- PRUEBAS DE INTEGRIDAD

-- 1. Prueba de Unidad (email duplicad)

	-- Creamos al usuario "Original"
INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at) 
VALUES ('Test', 'Uno', 'test@fylios.com', 'pass123', 'athlete', NOW(), NOW());

	-- Intentamos crear al "Clon" (mismo email) -> ESTO DEBE FALLAR
INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at) 
VALUES ('Test', 'Dos', 'test@fylios.com', 'pass456', 'coach', NOW(), NOW());

-- 2. Borrado y relaciones

	-- Creamos un usuario "Víctima"
INSERT INTO users (first_name, last_name, email, password, role, created_at, updated_at) 
VALUES ('Borrar', 'Mí', 'delete@me.com', '1234', 'athlete', NOW(), NOW());

	-- Buscamos su ID (para no fallar)
SET @user_id = (SELECT id FROM users WHERE email = 'delete@me.com');

	-- Le asignamos una rutina
INSERT INTO routines (user_id, name, description, created_at, updated_at) 
VALUES (@user_id, 'Rutina Fantasma', 'Prueba de borrado', NOW(), NOW());

	-- ¡INTENTO DE BORRADO!
DELETE FROM users WHERE id = @user_id;

	-- Comprobamos si queda rastro
SELECT * FROM routines WHERE name = 'Rutina Fantasma';

-- 3. Simulacro de Conversación (Tabla Messages)

	-- Insertamos dos interlocutores (si no existen ya)
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Entrenador', 'Javi', 'coach@chat.com', '123', 'coach');
INSERT INTO users (first_name, last_name, email, password, role) VALUES ('Atleta', 'Ana', 'atleta@chat.com', '123', 'athlete');

	-- Capturamos sus IDs
SET @coach_id = (SELECT id FROM users WHERE email = 'coach@chat.com');
SET @athlete_id = (SELECT id FROM users WHERE email = 'atleta@chat.com');

	-- Simulación de Chat
-- El Coach escribe a la Atleta
INSERT INTO messages (sender_id, receiver_id, content, is_read) 
VALUES (@coach_id, @athlete_id, '¡Hola Ana! ¿Cómo fue el entreno?', 0);

-- La Atleta responde
INSERT INTO messages (sender_id, receiver_id, content, is_read) 
VALUES (@athlete_id, @coach_id, 'Brutal, Javi. Subí marcas en sentadilla.', 0);

	-- LEER LA CONVERSACIÓN
SELECT * FROM messages WHERE sender_id IN (@coach_id, @athlete_id);