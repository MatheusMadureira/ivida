# Supabase – como usar

## 1. Variáveis de ambiente

Copie o exemplo e preencha com os dados do seu projeto no [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings** → **API**:

```bash
cp .env.example .env.local
```

Edite `.env.local` e defina:

- **NEXT_PUBLIC_SUPABASE_URL** → URL do projeto (ex.: `https://xxxxx.supabase.co`)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** → chave pública (publishable), usada no frontend e onde RLS se aplica
- **SUPABASE_SERVICE_ROLE_KEY** → chave privilegiada (secret), só no backend; ignora RLS — não exponha no frontend

## 2. Vincular o projeto (link)

Na raiz do repositório, rode **uma vez**:

```bash
npm run supabase:link
```

Ou diretamente:

```bash
npx supabase link --project-ref SEU_PROJECT_REF
```

O **Project Ref** é o ID do projeto na URL do Dashboard (ex.: `https://supabase.com/dashboard/project/abc123xyz` → ref é `abc123xyz`). O CLI vai pedir a senha do banco; se quiser evitar o prompt (ex.: CI), use a variável `SUPABASE_DB_PASSWORD`.

## 3. Subir as migrations (migration up)

Com o projeto linkado, para aplicar as migrations no banco remoto:

```bash
npm run db:push
```

Ou:

```bash
npx supabase db push --linked
```

Isso aplica todos os arquivos em `supabase/migrations/` que ainda não foram aplicados (a tabela `public.profiles` será criada na primeira vez).

Resumo: **link** uma vez → **db:push** sempre que tiver novas migrations.
