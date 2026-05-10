import React, { createContext, useState } from "react";

export const CoachContext = createContext(null);

export const CoachProvider = ({ children }) => {
  const [activeClient, setActiveClient] = useState(null);

  const enterClientView = (client) => setActiveClient(client);
  const exitClientView = () => setActiveClient(null);
  const isCoachMode = activeClient !== null;
  const targetUserId = activeClient?.id || null;

  return (
    <CoachContext.Provider value={{ activeClient, enterClientView, exitClientView, isCoachMode, targetUserId }}>
      {children}
    </CoachContext.Provider>
  );
};