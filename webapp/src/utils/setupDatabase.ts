import { supabase } from '../services/supabase';

/**
 * Script per verificare e creare le tabelle del database
 * Da eseguire una volta per setup iniziale
 */

async function setupDatabase() {
  console.log('🚀 Inizio setup database...');

  try {
    // 1. Verifica connessione
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('❌ Errore autenticazione:', authError);
      return;
    }
    console.log('✅ Connesso come:', user?.email || 'utente anonimo');

    // 2. Verifica tabella categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name_it, name_en')
      .limit(5);

    if (catError) {
      console.error('❌ Tabella categories non accessibile:', catError);
      return;
    }
    console.log('✅ Tabella categories OK -', categories.length, 'categorie trovate');

    // 3. Verifica tabella user_profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (profileError) {
      console.error('❌ Tabella user_profiles non esiste:', profileError);
      console.log('💡 AZIONE NECESSARIA: Eseguire lo script SQL create_groups_system.sql nel dashboard Supabase');
      
      // Mostra il comando SQL da eseguire
      console.log(`
📋 ISTRUZIONI PER CREARE LE TABELLE:

1. Vai al dashboard Supabase: https://supabase.com/dashboard
2. Seleziona il tuo progetto
3. Vai nella sezione "SQL Editor"
4. Copia e incolla il contenuto del file:
   webapp/sql/create_groups_system.sql
5. Esegui lo script
6. Ricarica questa pagina

OPPURE esegui questo comando nel terminale:
cd webapp && supabase db push (se hai Supabase CLI installato)
      `);
      return;
    }

    console.log('✅ Tabella user_profiles OK -', profiles.length, 'profili trovati');

    // 4. Test completo schema user_profiles
    const { error: schemaError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        category_id,
        goal_description,
        goal_deadline,
        experience_level,
        preferred_meeting_times,
        timezone,
        availability_hours,
        matching_preferences,
        is_available_for_matching,
        created_at,
        updated_at
      `)
      .limit(0);

    if (schemaError) {
      console.error('❌ Schema user_profiles incompleto:', schemaError);
      console.log('💡 Potrebbe essere necessario aggiornare lo schema della tabella');
      return;
    }

    console.log('✅ Schema user_profiles completo');

    // 5. Verifica che l'utente corrente possa inserire dati
    if (user) {
      console.log('🧪 Test permessi scrittura...');
      
      const testData = {
        id: user.id,
        category_id: 1,
        goal_description: 'TEST - rimuovere',
        experience_level: 'beginner' as const,
        preferred_meeting_times: ['test'],
        timezone: 'Europe/Rome',
        availability_hours: 'flexible',
        matching_preferences: {},
        is_available_for_matching: false // Per identificare come test
      };

      const { error: insertError } = await supabase
        .from('user_profiles')
        .upsert(testData, { onConflict: 'id' });

      if (insertError) {
        console.error('❌ Errore permessi scrittura:', insertError);
        console.log('💡 Verifica le Row Level Security policies nella tabella user_profiles');
        return;
      }

      // Cleanup
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id)
        .eq('goal_description', 'TEST - rimuovere');

      console.log('✅ Permessi scrittura OK');
    }

    console.log('🎉 DATABASE PRONTO! Tutte le verifiche completate con successo.');

  } catch (error) {
    console.error('❌ Errore generale setup database:', error);
  }
}

// Esporta per uso nell'app
export { setupDatabase };

// Se eseguito direttamente
if (typeof window !== 'undefined') {
  (window as any).setupDatabase = setupDatabase;
  console.log('💡 Esegui setupDatabase() nella console per verificare il database');
}
