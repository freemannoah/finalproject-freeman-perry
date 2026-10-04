"use client";
import React, { createContext, useContext } from "react";
import { Model } from '../types/model.ts';
import type { AlertColor } from "@mui/material";

type ModelContextType = {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;

  alertOpen: boolean;
  alertText: string;
  alertSeverity: AlertColor;

  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertText: React.Dispatch<React.SetStateAction<string>>;
  setAlertSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;

  triggerAlert: (severity: AlertColor, text: string) => void;
};

const ModelContext = createContext<ModelContextType | null>(null);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = React.useState(new Model());

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertText, setAlertText] = React.useState("");
  const [alertSeverity, setAlertSeverity] = React.useState<AlertColor>("success");

  const triggerAlert = (severity: AlertColor, text: string) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };

  return (
    <ModelContext.Provider
      value={{
        model,
        setModel,
        alertOpen,
        alertText,
        alertSeverity,
        setAlertOpen,
        setAlertText,
        setAlertSeverity,
        triggerAlert
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  return useContext(ModelContext)!;
}
