import React from "react";
import { MatchingPreferences } from "../components/matching/MatchingPreferences";
import { MatchingPoolTest } from "../components/test/MatchingPoolTest";
import { ToastContainer } from "../components/common/Toast";
import { useToast } from "../hooks/useToast";
import "./TestMatchingPage.css";

/**
 * Pagina di test per il componente MatchingPreferences e sistema matching pool
 * Da utilizzare temporaneamente per testare le funzionalità
 */
export const TestMatchingPage: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="test-matching-page">
      <div className="test-header">
        <h2>🧪 Test Sistema Matching</h2>
        <p>
          Pagina temporanea per testare le preferenze di matching e il pool
          progressivo
        </p>
      </div>

      <div className="test-content">
        {/* Test del nuovo sistema matching pool */}
        <div className="test-section-wrapper">
          <MatchingPoolTest />
        </div>

        {/* Test delle preferenze (esistente) */}
        <div className="test-section-wrapper">
          <div className="section-header">
            <h3>⚙️ Test Preferenze Matching</h3>
            <p>Configura le tue preferenze per il sistema di matching</p>
          </div>
          <MatchingPreferences />
        </div>
      </div>

      <div className="test-footer">
        <p>
          <strong>Note:</strong> Questa pagina è solo per testing. I componenti
          verranno integrati nel profilo utente e nel sistema di matching.
        </p>
      </div>

      {/* Toast Container globale per la pagina */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
