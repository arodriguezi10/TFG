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

// fución para enviar el email de recuperación de contraseña
export const sendPasswordResetEmail = async (email) =>{

  const redirectUrl = import.meta.env.PROD 
    ? 'https://tfg-topaz.vercel.app/reset-password'
    : 'http://localhost:5173/reset-password';
    
  const { error } = await supabase.auth.resetPasswordForEmail(email,{
    redirectTo: redirectUrl,
  });
  return { error };
}

//funcion para actualizar la contraseña
export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};