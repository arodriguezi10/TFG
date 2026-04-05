import { supabase } from "./supabase";

export const registerUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
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