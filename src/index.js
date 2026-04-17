import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PortfolioProvider } from "./context/PortfolioContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { CompareProvider } from "./context/CompareContext";
import "./styles/variables.css";
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <UserProfileProvider>
    <PortfolioProvider>
      <CompareProvider>
        <App />
      </CompareProvider>
    </PortfolioProvider>
  </UserProfileProvider>
);