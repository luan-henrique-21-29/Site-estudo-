# Ativar login e sincronização

1. Crie um projeto no Supabase.
2. Rode `supabase/schema.sql` no SQL Editor.
3. Em GitHub → Settings → Secrets and variables → Actions, crie:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Faça novo deploy.

Depois disso, a página **Conta** permite criar conta, entrar com e-mail/senha ou receber link mágico. O progresso continua salvo localmente e também sincroniza com a conta.
