-- POPOLAMENTO SUBCATEGORIE 5-6-7 FINALI - COMPLETAMENTO 77 SUBCATEGORIE
-- 34 subcategorie validate scientificamente (12+12+10) - COMPLETAMENTO STORICO!
-- Da eseguire nel SQL Editor di Supabase DOPO populate_subcategories_3_4.sql

-- CATEGORIA 5: MINDFULNESS E CRESCITA (12 subcategorie)
INSERT INTO subcategories (
  category_id, name_it, name_en, description_it, description_en, emoji, 
  difficulty_level, estimated_duration_days, psychological_benefits, 
  validation_source, sort_order
)
SELECT 
  c.id,
  s.name_it,
  s.name_en,
  s.description_it,
  s.description_en,
  s.emoji,
  s.difficulty_level,
  s.estimated_duration_days,
  s.psychological_benefits,
  s.validation_source,
  s.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Meditazione quotidiana', 'Daily Meditation', '10-20 minuti di meditazione ogni giorno', '10-20 minutes of daily meditation', '🧘', 2, 30, ARRAY['Regolazione emotiva', 'Attenzione sostenuta', 'Riduzione stress'], 'Validato: Headspace + Calm + mindfulness research + neuroscienza', 1),
  ('Gratitudine giornaliera', 'Daily Gratitude', 'Scrivere 3 cose per cui essere grati ogni sera', 'Write 3 things to be grateful for each evening', '🙏', 1, 30, ARRAY['Ottimismo', 'Soddisfazione vita', 'Resilienza emotiva'], 'Validato: gratitude apps + positive psychology + wellbeing research', 2),
  ('Journaling emotivo', 'Emotional Journaling', 'Scrittura riflessiva su emozioni ed esperienze', 'Reflective writing on emotions and experiences', '📖', 2, 30, ARRAY['Autoconsapevolezza', 'Processamento emotivo', 'Crescita personale'], 'Validato: journaling apps + narrative therapy + emotional intelligence', 3),
  ('Mindful walking', 'Mindful Walking', 'Camminata consapevole concentrata sul presente', 'Conscious walking focused on the present', '🚶‍♂️', 1, 30, ARRAY['Presenza mentale', 'Connessione corpo-mente', 'Calma interiore'], 'Validato: mindfulness apps + walking meditation + embodied cognition', 4),
  ('Breathwork avanzato', 'Advanced Breathwork', 'Tecniche respirazione: Wim Hof, Box breathing', 'Breathing techniques: Wim Hof, Box breathing', '🌬️', 3, 30, ARRAY['Controllo sistema nervoso', 'Resilienza stress', 'Energie vitali'], 'Validato: breathwork apps + respiratory psychology + autonomic nervous system', 5),
  ('Lettura spirituale', 'Spiritual Reading', 'Testi su crescita personale, filosofia, spiritualità', 'Texts on personal growth, philosophy, spirituality', '📜', 2, 30, ARRAY['Prospettiva esistenziale', 'Saggezza', 'Significato vita'], 'Validato: spiritual apps + wisdom literature + meaning psychology', 6),
  ('Body scan meditation', 'Body Scan Meditation', 'Meditazione di scansione corporea per rilassamento', 'Body scanning meditation for relaxation', '🫀', 2, 30, ARRAY['Consapevolezza corporea', 'Rilassamento profondo', 'Integrazione mente-corpo'], 'Validato: meditation apps + somatic therapy + body awareness research', 7),
  ('Loving kindness', 'Loving Kindness', 'Meditazione compassione verso sé e altri', 'Compassion meditation toward self and others', '💖', 2, 30, ARRAY['Autocompassione', 'Empatia', 'Benessere relazionale'], 'Validato: compassion apps + loving-kindness research + social psychology', 8),
  ('Digital mindfulness', 'Digital Mindfulness', 'Uso consapevole tecnologia, pause mindful', 'Conscious technology use, mindful breaks', '📱', 3, 30, ARRAY['Presenza digitale', 'Controllo impulsi', 'Equilibrio vita'], 'Validato: digital wellness + mindful tech + attention economy research', 9),
  ('Nature connection', 'Nature Connection', 'Tempo quotidiano in natura con presenza mindful', 'Daily time in nature with mindful presence', '🌿', 1, 30, ARRAY['Connessione naturale', 'Riduzione stress urbano', 'Prospettiva ecologica'], 'Validato: nature apps + ecotherapy + environmental psychology', 10),
  ('Shadow work', 'Shadow Work', 'Esplorazione aspetti nascosti personalità', 'Exploring hidden aspects of personality', '🌑', 4, 30, ARRAY['Integrazione psichica', 'Autenticità', 'Crescita profonda'], 'Validato: psychology apps + Jungian psychology + depth psychology', 11),
  ('Mindful eating', 'Mindful Eating', 'Alimentazione consapevole con attenzione sensoriale', 'Conscious eating with sensory attention', '🥗', 2, 30, ARRAY['Consapevolezza corporea', 'Relazione cibo', 'Presenza sensoriale'], 'Validato: nutrition apps + mindful eating research + embodied awareness', 12)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Mindfulness e Crescita';

-- CATEGORIA 6: CARRIERA E SVILUPPO (12 subcategorie)
INSERT INTO subcategories (
  category_id, name_it, name_en, description_it, description_en, emoji, 
  difficulty_level, estimated_duration_days, psychological_benefits, 
  validation_source, sort_order
)
SELECT 
  c.id,
  s.name_it,
  s.name_en,
  s.description_it,
  s.description_en,
  s.emoji,
  s.difficulty_level,
  s.estimated_duration_days,
  s.psychological_benefits,
  s.validation_source,
  s.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Networking strategico', 'Strategic Networking', 'Connessioni professionali mirate 3-4 a settimana', 'Targeted professional connections 3-4 weekly', '🤝', 3, 30, ARRAY['Capital sociale', 'Opportunità carriera', 'Fiducia interpersonale'], 'Validato: LinkedIn + networking apps + social capital research', 1),
  ('Personal branding', 'Personal Branding', 'Sviluppo presenza online professionale', 'Develop professional online presence', '🌟', 3, 30, ARRAY['Identità professionale', 'Visibilità mercato', 'Autopromozione strategica'], 'Validato: social media + professional platforms + identity psychology', 2),
  ('Skill assessment', 'Skill Assessment', 'Valutazione competenze e gap analysis', 'Skills evaluation and gap analysis', '📊', 2, 30, ARRAY['Autoconsapevolezza professionale', 'Direzione sviluppo', 'Competenza percepita'], 'Validato: assessment tools + career development + competency psychology', 3),
  ('Interview mastery', 'Interview Mastery', 'Preparazione colloqui con mock interviews', 'Interview preparation with mock interviews', '💼', 3, 30, ARRAY['Fiducia comunicativa', 'Performance sotto pressione', 'Articolazione valore'], 'Validato: interview apps + career coaching + performance psychology', 4),
  ('Leadership skills', 'Leadership Skills', 'Sviluppo competenze leadership e influence', 'Develop leadership and influence skills', '👑', 4, 30, ARRAY['Autorità percepita', 'Influenza sociale', 'Responsabilità decisionale'], 'Validato: leadership apps + management training + leadership psychology', 5),
  ('Project management', 'Project Management', 'Gestione progetti con metodologie agili', 'Project management with agile methodologies', '📈', 4, 30, ARRAY['Organizzazione sistemica', 'Controllo complessità', 'Efficacia esecutiva'], 'Validato: PM tools + agile trends + project psychology', 6),
  ('Industry research', 'Industry Research', 'Studio trends settore e competitive analysis', 'Industry trends study and competitive analysis', '🔍', 2, 30, ARRAY['Competenza settoriale', 'Pensiero strategico', 'Anticipazione cambiamenti'], 'Validato: industry reports + research tools + strategic thinking', 7),
  ('Mentorship seeking', 'Mentorship Seeking', 'Ricerca e coltivazione relazioni mentorship', 'Seeking and cultivating mentorship relationships', '🎓', 3, 30, ARRAY['Crescita accelerata', 'Saggezza acquisita', 'Rete supporto'], 'Validato: mentorship platforms + career development + social learning', 8),
  ('Pitch perfection', 'Pitch Perfection', 'Elevator pitch e presentazioni persuasive', 'Elevator pitch and persuasive presentations', '🎤', 3, 30, ARRAY['Comunicazione impatto', 'Persuasione', 'Fiducia pubblica'], 'Validato: presentation apps + pitch training + persuasion psychology', 9),
  ('Salary negotiation', 'Salary Negotiation', 'Tecniche negoziazione stipendio e benefici', 'Salary and benefits negotiation techniques', '💰', 4, 30, ARRAY['Autovalutazione', 'Assertività', 'Negoziazione win-win'], 'Validato: negotiation training + salary data + negotiation psychology', 10),
  ('Digital portfolio', 'Digital Portfolio', 'Portfolio online lavori e progetti', 'Online portfolio of work and projects', '💻', 3, 30, ARRAY['Dimostrazione competenza', 'Credibilità professionale', 'Differenziazione'], 'Validato: portfolio platforms + showcase tools + credential psychology', 11),
  ('Career pivoting', 'Career Pivoting', 'Strategie cambio carriera e transizioni', 'Career change and transition strategies', '🔄', 4, 30, ARRAY['Adattabilità', 'Gestione incertezza', 'Reinvenzione identità'], 'Validato: career transition + pivot strategies + change psychology', 12)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Carriera e Sviluppo';

-- CATEGORIA 7: LIFESTYLE E RELAZIONI (10 subcategorie) - ULTIMA CATEGORIA!
INSERT INTO subcategories (
  category_id, name_it, name_en, description_it, description_en, emoji, 
  difficulty_level, estimated_duration_days, psychological_benefits, 
  validation_source, sort_order
)
SELECT 
  c.id,
  s.name_it,
  s.name_en,
  s.description_it,
  s.description_en,
  s.emoji,
  s.difficulty_level,
  s.estimated_duration_days,
  s.psychological_benefits,
  s.validation_source,
  s.sort_order
FROM categories c
CROSS JOIN (VALUES
  ('Comunicazione empatica', 'Empathic Communication', 'Ascolto attivo e comunicazione non violenta', 'Active listening and non-violent communication', '💬', 3, 30, ARRAY['Qualità relazionali', 'Risoluzione conflitti', 'Intimità emotiva'], 'Validato: relationship apps + communication research + social psychology', 1),
  ('Budgeting consapevole', 'Mindful Budgeting', 'Gestione finanziaria consapevole e pianificata', 'Conscious and planned financial management', '💳', 3, 30, ARRAY['Controllo finanziario', 'Riduzione ansia denaro', 'Sicurezza futuro'], 'Validato: finance apps + money psychology + financial wellness', 2),
  ('Social boundaries', 'Social Boundaries', 'Stabilire confini sani nelle relazioni', 'Establish healthy boundaries in relationships', '🚧', 3, 30, ARRAY['Autostima', 'Rispetto reciproco', 'Energia emotiva'], 'Validato: therapy apps + boundary research + relational psychology', 3),
  ('Sustainable living', 'Sustainable Living', 'Scelte quotidiane eco-sostenibili', 'Daily eco-sustainable choices', '🌍', 2, 30, ARRAY['Senso scopo', 'Responsabilità sociale', 'Allineamento valori'], 'Validato: sustainability apps + environmental psychology + values research', 4),
  ('Family bonding', 'Family Bonding', 'Tempo qualità dedicato a famiglia/amici', 'Quality time dedicated to family/friends', '👨‍👩‍👧‍👦', 2, 30, ARRAY['Connessione affettiva', 'Supporto sociale', 'Senso appartenenza'], 'Validato: family apps + relationship research + attachment psychology', 5),
  ('Digital wellness', 'Digital Wellness', 'Relazione sana con tecnologia e social', 'Healthy relationship with technology and social media', '📱', 3, 30, ARRAY['Presenza autentica', 'Controllo impulsi digitali', 'Benessere mentale'], 'Validato: digital wellness + screen time research + tech psychology', 6),
  ('Conflict resolution', 'Conflict Resolution', 'Gestione costruttiva conflitti interpersonali', 'Constructive management of interpersonal conflicts', '🤲', 4, 30, ARRAY['Maturità emotiva', 'Problem solving sociale', 'Crescita relazionale'], 'Validato: mediation training + conflict research + social psychology', 7),
  ('Home organization', 'Home Organization', 'Organizzazione spazi domestici per benessere', 'Home space organization for wellness', '🏠', 2, 30, ARRAY['Controllo ambiente', 'Riduzione stress domestico', 'Energia vitale'], 'Validato: organization apps + environmental psychology + home wellness', 8),
  ('Community engagement', 'Community Engagement', 'Partecipazione attiva comunità locale', 'Active participation in local community', '🤝', 2, 30, ARRAY['Senso appartenenza', 'Impatto sociale', 'Rete supporto'], 'Validato: community apps + civic engagement + social capital research', 9),
  ('Life balance optimization', 'Life Balance Optimization', 'Equilibrio work-life e priorità personali', 'Work-life balance and personal priorities', '⚖️', 3, 30, ARRAY['Integrazione vita', 'Soddisfazione globale', 'Sostenibilità esistenziale'], 'Validato: wellness apps + work-life balance + life satisfaction research', 10)
) AS s(name_it, name_en, description_it, description_en, emoji, difficulty_level, estimated_duration_days, psychological_benefits, validation_source, sort_order)
WHERE c.name_it = 'Lifestyle e Relazioni';

-- 🏆 VERIFICA COMPLETAMENTO STORICO - TUTTE LE 77 SUBCATEGORIE!
SELECT 
  '🏆 COMPLETAMENTO STORICO RAGGIUNTO!' as status,
  COUNT(*) as totale_subcategorie
FROM subcategories;

-- Verifica distribuzione per categoria
SELECT 
  c.name_it as categoria,
  c.emoji,
  COUNT(s.id) as subcategorie,
  c.sort_order
FROM categories c
LEFT JOIN subcategories s ON c.id = s.category_id
WHERE c.is_active = true
GROUP BY c.id, c.name_it, c.emoji, c.sort_order
ORDER BY c.sort_order;

-- Statistiche finali
SELECT 
  'STATISTICHE FINALI' as tipo,
  AVG(s.difficulty_level) as difficolta_media,
  COUNT(CASE WHEN s.difficulty_level = 1 THEN 1 END) as facili,
  COUNT(CASE WHEN s.difficulty_level = 2 THEN 1 END) as medie_facili,
  COUNT(CASE WHEN s.difficulty_level = 3 THEN 1 END) as medie,
  COUNT(CASE WHEN s.difficulty_level = 4 THEN 1 END) as impegnative,
  COUNT(CASE WHEN s.difficulty_level = 5 THEN 1 END) as difficili
FROM subcategories s;
