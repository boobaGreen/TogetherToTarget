import React from "react";
import { MatchingPreferences } from "../components/matching/MatchingPreferences";
import "./TestMatchingPage.css";

/**
 * Pagina di test per il componente MatchingPreferences
 * Da utilizzare temporaneamente per testare le funzionalità
 */
export const TestMatchingPage: React.FC = () => {
  return (
    <div className="test-matching-page">
      <div className="test-header">
        <h2>🧪 Test Sistema Matching</h2>
        <p>Pagina temporanea per testare le preferenze di matching</p>
      </div>

      <div className="test-content">
        <MatchingPreferences />
      </div>

      <div className="test-footer">
        <p>
          <strong>Note:</strong> Questa pagina è solo per testing. Il componente
          verrà integrato nel profilo utente.
        </p>
      </div>
    </div>
  );
};
