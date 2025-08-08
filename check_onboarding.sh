#!/bin/bash

echo "🔍 VERIFICA COMPLETAMENTO ONBOARDING SYSTEM"
echo "============================================"

echo ""
echo "📂 FILES CREATI:"
ls -la webapp/src/services/userProfiles.ts 2>/dev/null && echo "✅ userProfiles.ts" || echo "❌ userProfiles.ts"
ls -la webapp/src/pages/OnboardingSuccessPage.tsx 2>/dev/null && echo "✅ OnboardingSuccessPage.tsx" || echo "❌ OnboardingSuccessPage.tsx"
ls -la webapp/src/styles/onboarding-success.css 2>/dev/null && echo "✅ onboarding-success.css" || echo "❌ onboarding-success.css"
ls -la webapp/sql/create_groups_system.sql 2>/dev/null && echo "✅ create_groups_system.sql" || echo "❌ create_groups_system.sql"

echo ""
echo "📋 SCRIPT SQL DA ESEGUIRE:"
echo "File: webapp/sql/create_groups_system.sql"
echo "Dimensione: $(wc -l < webapp/sql/create_groups_system.sql 2>/dev/null || echo '0') linee"

echo ""
echo "🌐 SERVER STATUS:"
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Server webapp attivo su http://localhost:5173"
else
    echo "❌ Server webapp non raggiungibile"
fi

echo ""
echo "🎯 PROSSIMI PASSI:"
echo "1. Assicurati che il server sia avviato: npm run dev"
echo "2. Vai su: http://localhost:5173"
echo "3. Fai login/signup"
echo "4. Clicca 'Verifica Database' per controllare lo stato"
echo "5. Se necessario, esegui lo script SQL nel dashboard Supabase"
echo "6. Testa l'onboarding completo"

echo ""
echo "📊 DATABASE SETUP:"
echo "URL Supabase: $(grep VITE_SUPABASE_URL webapp/.env.local 2>/dev/null | cut -d'=' -f2 || echo 'Non trovato')"
echo "Dashboard: https://supabase.com/dashboard"
echo ""
