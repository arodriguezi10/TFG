import { supabase } from "./supabase";

export const registerUser = async (email, password, name, surname, birthDate) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) return { data, error };

  await supabase.from("users").insert({
    id: data.user.id,
    first_name: name,
    last_name: surname,
    email: email,
  });

  await supabase.from("user_profiles").insert({
    user_id: data.user.id,
    birth_date: birthDate,
  });
  return { data, error };
};

export const loginUser = async (email, password) =>{
    const { data, error } = await supabase.auth.signInWithPassword({email, password});
    return { data, error };
};

export const logoutUser = async() => {
    const { error } = await supabase.auth.signOut();
    return { error};
};