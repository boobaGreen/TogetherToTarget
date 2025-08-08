## Come trovare il Reference ID in Supabase:

1. Dashboard Supabase → Settings (⚙️) → General
2. Cerca "Reference ID" nella sezione "General settings"
3. Sarà un codice alfanumerico tipo: abcd1234efgh5678

## Esempio completo:

Se il tuo Reference ID è: `abcd1234efgh5678`

### Google Console - Authorized redirect URIs:

```
http://localhost:5173
https://abcd1234efgh5678.supabase.co/auth/v1/callback
```

### Supabase Dashboard - Authentication:

- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

## ⚠️ IMPORTANTE:

Non condividere mai il Client Secret pubblicamente!
