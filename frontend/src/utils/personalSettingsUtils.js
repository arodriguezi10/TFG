import { supabase } from "../services/supabase";

export const COUNTRIES = [
  "España", "México", "Argentina", "Colombia", "Chile", "Perú",
  "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia",
  "República Dominicana", "Honduras", "Paraguay", "El Salvador",
  "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Puerto Rico"
];

export const loadUserData = async (userId, setFormData, setOriginalData, setLoading) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('first_name, last_name, email, sex, height_cm, initial_weight_kg, bio, phone, country')
      .eq('id', userId).single();

    if (userError) { console.error(userError); setLoading(false); return; }

    const { data: profileData } = await supabase
      .from('user_profiles').select('birth_date').eq('user_id', userId).single();

    const fullName = `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim();

    const loadedData = {
      fullName: fullName || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      birthDate: profileData?.birth_date || "",
      sex: userData?.sex || "Masculino",
      height_cm: userData?.height_cm || "",
      initial_weight_kg: userData?.initial_weight_kg || "",
      bio: userData?.bio || "",
      country: userData?.country || "España"
    };

    setFormData(loadedData);
    setOriginalData(loadedData);
  } catch (err) { console.error(err); }
  finally { setLoading(false); }
};

export const saveChanges = async (userId, formData, changedFields, setOriginalData, setChangedFields, setSaving) => {
  if (changedFields.size === 0) { alert("No hay cambios para guardar"); return; }
  setSaving(true);
  try {
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const { error: userError } = await supabase.from('users').update({
      first_name: firstName, last_name: lastName, email: formData.email,
      sex: formData.sex, height_cm: formData.height_cm || null,
      initial_weight_kg: formData.initial_weight_kg || null,
      bio: formData.bio, phone: formData.phone || null, country: formData.country
    }).eq('id', userId);

    if (userError) { alert("Error al guardar los cambios"); return; }

    if (changedFields.has('birthDate')) {
      await supabase.from('user_profiles').update({ birth_date: formData.birthDate }).eq('user_id', userId);
    }

    setOriginalData(formData);
    setChangedFields(new Set());
    alert("Cambios guardados correctamente");
  } catch (err) { console.error(err); alert("Error al guardar los cambios"); }
  finally { setSaving(false); }
};

export const deleteAccount = async (navigate) => {
  if (!window.confirm("Seguro que quieres eliminar tu cuenta? Esta accion es irreversible.")) return;
  if (!window.confirm("Ultima confirmacion: Realmente quieres eliminar tu cuenta?")) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.functions.invoke("delete-user", {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (error) throw error;
    await supabase.auth.signOut();
    navigate("/login");
  } catch (err) { console.error(err); alert("Error al eliminar la cuenta"); }
};