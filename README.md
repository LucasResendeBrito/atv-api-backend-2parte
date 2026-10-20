# Livraria API

API de Livros e Autores com BCrypt, JWT, RBAC e documentação OpenAPI (Swagger UI).

## Como rodar

```
npm install
npm start
```

Copie `.env.example` para `.env` e defina o `JWT_SECRET`. Se não tiver `.env`, a API usa um segredo de desenvolvimento.

## Documentação

- Interface interativa: http://localhost:3000/api/docs
- JSON da especificação OpenAPI: http://localhost:3000/api/docs.json

## Como testar rotas protegidas

1. Crie um usuário em `POST /api/v1/auth/register` (para testar rotas de ADMIN envie `"role": "ADMIN"`).
2. Faça login em `POST /api/v1/auth/login` e copie o `token`.
3. Clique em **Authorize** no Swagger e cole só o token (sem escrever "Bearer").

## Endpoints

| Método | Rota | Acesso |
|---|---|---|
| GET | /api/v1/livros | Público |
| GET | /api/v1/livros/{id} | Público |
| POST | /api/v1/auth/register | Público |
| POST | /api/v1/auth/login | Público |
| POST | /api/v1/livros/{id}/comentarios | USER ou ADMIN |
| POST | /api/v1/autores | ADMIN |
| POST | /api/v1/livros | ADMIN |
