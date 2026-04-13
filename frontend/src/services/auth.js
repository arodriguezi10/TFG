import { supabase } from "./supabase";

export const registerUser = async (email, password, name, surname, birthDate) => {
  // 1. Crear usuario en auth
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        first_name: name,
        last_name: surname,
        birth_date: birthDate
      }
    }
  });

  if (error) {
    console.error("Error en signUp:", error);
    return { data, error };
  }

  console.log("✅ Usuario creado en auth:", data.user.id);
  return { data, error: null };
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};