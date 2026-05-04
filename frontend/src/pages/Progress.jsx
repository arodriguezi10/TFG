// Progress.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import ProgressCarga from "./ProgressCarga";
import ProgressVolumen from "./ProgressVolumen";
import ProgressCuerpo from "./ProgressCuerpo";

const Progress = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("carga");
  const [subscriptionTier, setSubscriptionTier] = useState("free");


  useEffect(() => {
  if (!user) return;
  const fetchTier = async () => {
    const { data } = await supabase
      .from("users")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();
    setSubscriptionTier(data?.subscription_tier || "free");
  };
  fetchTier();
}, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-3">
      <section className="w-full px-4 pt-4 pb-2">
        <h1 className="font-heading font-extrabold text-[32px] text-text-high">
          Progreso
        </h1>
      </section>

      <section className="px-4 mb-4">
        <div className="flex gap-2 bg-surf border border-text-low rounded-2xl p-1">
          {["Carga", "Volumen", "Cuerpo"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-1.25 rounded-xl transition-colors duration-200 ${
                activeTab === tab.toLowerCase() ? "bg-primary" : "bg-transparent"
              }`}
            >
              <p className={`font-subheading font-bold text-[16px] ${
                activeTab === tab.toLowerCase() ? "text-text-high" : "text-text-low"
              }`}>
                {tab}
              </p>
            </button>
          ))}
        </div>
      </section>

      {activeTab === "carga" && <ProgressCarga subscriptionTier={subscriptionTier} />}
      {activeTab === "volumen" && <ProgressVolumen subscriptionTier={subscriptionTier} />}
      {activeTab === "cuerpo" && <ProgressCuerpo subscriptionTier={subscriptionTier} />}
    </div>
  );
};

export default Progress;