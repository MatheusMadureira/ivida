# Regras de Segurança — Projeto IVIDA

Este documento define práticas obrigatórias ao criar ou alterar funcionalidades no projeto (APIs, páginas, autenticação e dados).

---

## 1. Autenticação e sessão

- **Rotas protegidas:** Qualquer rota que exiba ou altere dados do usuário deve ser protegida no **middleware** (incluir em `PROTECTED_PREFIXES` e no `config.matcher`). Não confiar apenas em redirect no cliente.
- **Cookie de sessão:** Usar sempre `sessionCookieOptions()` de `@/lib/session` para definir e para **limpar** o cookie (logout, token inválido), incluindo `secure` em produção.
- **APIs que exigem login:** Validar sessão via `getSessionUser(request)` (ou `requireAdmin` para admin) e retornar 401 se não houver usuário. Não confiar em estado do frontend.
- **Redirect pós-login:** Ao redirecionar para `/login`, enviar o destino desejado em `?next=...`. Na página de login, após sucesso, redirecionar apenas para paths relativos válidos (evitar open redirect: aceitar só path que começa com `/` e não contém `//`).

---

## 2. Senhas

- **Validação server-side:** Toda API que aceita senha (registro, reset, sync-password, etc.) deve validar com `validatePassword()` de `@/lib/auth` e retornar 400 com mensagem clara se a senha não atender às regras (tamanho, número, maiúscula, minúscula, caractere especial).
- **Nunca logar ou expor senhas** (nem em desenvolvimento). Não retornar `password_hash` em respostas de API.
- **Regras de senha:** Manter consistência com `lib/auth.ts` (ex.: mínimo 8 caracteres, número, maiúscula, minúscula, especial).

---

## 3. APIs e autorização

- **Admin:** Rotas de administração devem usar `requireAdmin(request)` e retornar 403 se o usuário não for Admin.
- **Dados do próprio usuário:** Ao atualizar perfil, avatar ou dados sensíveis, garantir que o `user.id` da sessão seja o único autorizado (ex.: `eq("id", user.id)`). Nunca confiar em ID vindo do body ou da URL para alterar outro usuário sem checagem de role.
- **Inputs:** Validar e sanitizar todos os inputs (tipo, tamanho, formato). Para buscas em SQL/Supabase, evitar concatenação direta; usar parâmetros ou builders do cliente.

---

## 4. Variáveis de ambiente e segredos

- **Produção:** `JWT_SECRET` e `CPF_HASH_SECRET` (se usado) devem estar definidos em produção; o código já lança erro se estiverem ausentes. Não usar fallbacks de desenvolvimento em produção.
- **Chaves:** `SUPABASE_SERVICE_ROLE_KEY` e segredos de API nunca devem ser expostos no frontend (nunca em `NEXT_PUBLIC_*`).
- **`.env.example`:** Manter documentação das variáveis necessárias sem valores reais; indicar quais são obrigatórias em produção.

---

## 5. Cookies e CORS

- **Cookies de sessão:** `httpOnly: true`, `sameSite: "lax"`, `path: "/"`, `secure` em produção. Usar sempre os helpers de `@/lib/session`.
- **Fetch que afeta sessão:** Em chamadas de login ou qualquer request que receba `Set-Cookie`, usar `credentials: "include"` para garantir que o cookie seja enviado e armazenado corretamente.

---

## 6. Dados sensíveis e auditoria

- **PII/dados sensíveis:** Acesso apenas quando necessário; não retornar campos desnecessários (ex.: não devolver `cpf_hash` ou `password_hash` em listagens).
- **Auditoria:** Ao alterar perfil ou dados críticos, atualizar `updated_at` (e `last_password_change` quando aplicável) para rastreabilidade.

---

## 7. Frontend e UX de segurança

- **Páginas protegidas:** Além do middleware, páginas que dependem de usuário logado podem redirecionar no cliente (ex.: `if (!user) router.replace("/login")`) como camada extra, nunca como única proteção.
- **Mensagens de erro:** Em login, registro e reset de senha, usar mensagens genéricas em caso de falha (“E-mail ou senha incorretos”) para não revelar se o e-mail existe ou não.
- **Hooks que usam `useSearchParams()`:** Envolver em `<Suspense>` para evitar erro de build no Next.js (pré-render).

---

## 8. Checklist rápido para novas funcionalidades

- [ ] Rota protegida? → Incluída no middleware.
- [ ] API recebe senha? → Validação com `validatePassword()` no backend.
- [ ] API altera dados de usuário? → Sessão validada e escopo por `user.id` ou role.
- [ ] Rota de admin? → `requireAdmin()` e 403.
- [ ] Cookie sendo setado/limpo? → Usar `sessionCookieOptions()` (e `sessionCookieOptions(0)` ao limpar).
- [ ] Redirect após login? → Usar `next` seguro (path relativo).
- [ ] Novas env vars? → Documentar em `.env.example` e não expor segredos no client.
