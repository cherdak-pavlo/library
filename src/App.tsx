import React from "react";
import { MainPage } from "./components/MainPage";
import { AddEditInfo } from "./components/AddEditInfo";
import { InfoProvider } from "./context/InfoProvider";

export const App: React.FC = () => {
  return (
    <div className="section">
      <InfoProvider>
        <MainPage />
        <AddEditInfo />
      </InfoProvider>
    </div>
  );
};
