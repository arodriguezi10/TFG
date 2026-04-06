import { createContext, useState, useEffect } from "react";

import { supabase } from "../services/supabase";

// creamos el contexto
export const AuthContext = createContext();

//comprobamos que hay un usuario logueado en Supabase y guardamos la informacion
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        
        supabase.auth.onAuthStateChange ((event, session) => {
            setUser(session?.user ?? null);
        });
        
        }, []); 

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}