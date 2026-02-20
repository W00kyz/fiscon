# API Reference - Fiscon Backend

Documentacao completa dos endpoints REST que o backend precisa implementar para substituir a camada mock (`src/api/*.api.ts`).

**Base URL:** `/api/v1`
**Content-Type:** `application/json` (exceto upload de arquivos)
**Autenticacao:** Bearer token via header `Authorization: Bearer <token>`
**Timestamps:** ISO 8601 (`2025-03-05T11:00:00Z`)

---

## Indice

1. [Autenticacao](#1-autenticacao)
2. [Perfil](#2-perfil)
3. [Usuarios](#3-usuarios)
4. [Empresas](#4-empresas)
5. [Contratos](#5-contratos)
6. [Fiscalizacoes](#6-fiscalizacoes)
7. [Funcionarios](#7-funcionarios)
8. [Notificacoes](#8-notificacoes)
9. [Relatorios](#9-relatorios)
10. [Tipos Auxiliares](#10-tipos-auxiliares)
11. [Fluxo de Status das Fiscalizacoes](#11-fluxo-de-status-das-fiscalizacoes)
12. [Controle de Acesso](#12-controle-de-acesso)

---

## 1. Autenticacao

### `POST /auth/login`

Autentica o usuario e retorna os dados + token.

**Request Body:**

```json
{
  "email": "admin@fiscon.com",
  "senha": "admin"
}
```

| Campo   | Tipo     | Validacao                          |
| ------- | -------- | ---------------------------------- |
| `email` | `string` | Email valido, obrigatorio          |
| `senha` | `string` | Min 4 caracteres, obrigatorio      |

**Response `200 OK`:**

```json
{
  "id": "usr-1",
  "nome": "Admin Sistema",
  "email": "admin@fiscon.com",
  "role": "administrador",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

| Campo   | Tipo                                  | Descricao                  |
| ------- | ------------------------------------- | -------------------------- |
| `id`    | `string`                              | ID do usuario              |
| `nome`  | `string`                              | Nome completo              |
| `email` | `string`                              | Email                      |
| `role`  | `"fiscal" \| "administrador"`         | Papel do usuario           |
| `token` | `string`                              | JWT para requisicoes       |

**Erros:**

| Status | Mensagem                             |
| ------ | ------------------------------------ |
| `401`  | Email ou senha invalidos             |
| `403`  | Usuario inativo ou nao encontrado    |

---

## 2. Perfil

### `PATCH /perfil/senha`

Altera a senha do usuario autenticado.

**Request Body:**

```json
{
  "senhaAtual": "admin",
  "novaSenha": "novaSenha123"
}
```

| Campo        | Tipo     | Validacao                          |
| ------------ | -------- | ---------------------------------- |
| `senhaAtual` | `string` | Obrigatorio                        |
| `novaSenha`  | `string` | Min 6 caracteres, obrigatorio      |

**Response `204 No Content`**

**Erros:**

| Status | Mensagem                  |
| ------ | ------------------------- |
| `400`  | Senha atual incorreta     |
| `401`  | Nao autenticado           |

---

## 3. Usuarios

> Acesso restrito: **administrador**

### `GET /usuarios`

Lista todos os usuarios.

**Response `200 OK`:**

```json
[
  {
    "id": "usr-1",
    "nome": "Admin Sistema",
    "email": "admin@fiscon.com",
    "role": "administrador",
    "ativo": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

---

### `GET /usuarios/:id`

Retorna um usuario pelo ID.

**Path Params:**

| Param | Tipo     | Descricao     |
| ----- | -------- | ------------- |
| `id`  | `string` | ID do usuario |

**Response `200 OK`:**

```json
{
  "id": "usr-1",
  "nome": "Admin Sistema",
  "email": "admin@fiscon.com",
  "role": "administrador",
  "ativo": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

**Erros:**

| Status | Mensagem                    |
| ------ | --------------------------- |
| `404`  | Usuario nao encontrado      |

---

### `POST /usuarios`

Cria um novo usuario.

**Request Body:**

```json
{
  "nome": "Carlos Oliveira",
  "email": "carlos@fiscon.com",
  "role": "fiscal",
  "ativo": true
}
```

| Campo   | Tipo                              | Validacao                          |
| ------- | --------------------------------- | ---------------------------------- |
| `nome`  | `string`                          | Min 2 caracteres                   |
| `email` | `string`                          | Email valido                       |
| `role`  | `"fiscal" \| "administrador"`     | Obrigatorio                        |
| `ativo` | `boolean`                         | Obrigatorio                        |

**Response `201 Created`:**

```json
{
  "id": "usr-a1b2c3d4",
  "nome": "Carlos Oliveira",
  "email": "carlos@fiscon.com",
  "role": "fiscal",
  "ativo": true,
  "createdAt": "2025-03-10T10:00:00Z",
  "updatedAt": "2025-03-10T10:00:00Z"
}
```

---

### `PATCH /usuarios/:id`

Atualiza um usuario existente.

**Path Params:**

| Param | Tipo     | Descricao     |
| ----- | -------- | ------------- |
| `id`  | `string` | ID do usuario |

**Request Body:**

```json
{
  "nome": "Carlos Oliveira Silva",
  "email": "carlos@fiscon.com",
  "role": "fiscal",
  "ativo": true
}
```

| Campo   | Tipo                              | Validacao                          |
| ------- | --------------------------------- | ---------------------------------- |
| `nome`  | `string`                          | Min 2 caracteres                   |
| `email` | `string`                          | Email valido                       |
| `role`  | `"fiscal" \| "administrador"`     | Obrigatorio                        |
| `ativo` | `boolean`                         | Obrigatorio                        |

**Response `200 OK`:** Retorna o usuario atualizado (mesmo schema do GET).

---

### `DELETE /usuarios/:id`

Remove um usuario.

**Path Params:**

| Param | Tipo     | Descricao     |
| ----- | -------- | ------------- |
| `id`  | `string` | ID do usuario |

**Response `204 No Content`**

---

## 4. Empresas

> Acesso restrito: **administrador**

### `GET /empresas`

Lista todas as empresas terceirizadas.

**Response `200 OK`:**

```json
[
  {
    "id": "emp-1",
    "nome": "Limpeza Total Ltda",
    "cnpj": "12.345.678/0001-90",
    "endereco": "Rua das Flores, 100 - Centro",
    "telefone": "(61) 3333-4444",
    "email": "contato@limpezatotal.com.br",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
]
```

---

### `GET /empresas/:id`

Retorna uma empresa pelo ID.

**Path Params:**

| Param | Tipo     | Descricao     |
| ----- | -------- | ------------- |
| `id`  | `string` | ID da empresa |

**Response `200 OK`:**

```json
{
  "id": "emp-1",
  "nome": "Limpeza Total Ltda",
  "cnpj": "12.345.678/0001-90",
  "endereco": "Rua das Flores, 100 - Centro",
  "telefone": "(61) 3333-4444",
  "email": "contato@limpezatotal.com.br",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**Erros:**

| Status | Mensagem                    |
| ------ | --------------------------- |
| `404`  | Empresa nao encontrada      |

---

### `POST /empresas`

Cria uma nova empresa.

**Request Body:**

```json
{
  "nome": "Nova Empresa Ltda",
  "cnpj": "98.765.432/0001-10",
  "endereco": "Av. Brasil, 500",
  "telefone": "(61) 9999-8888",
  "email": "contato@novaempresa.com.br"
}
```

| Campo      | Tipo     | Validacao                                     |
| ---------- | -------- | --------------------------------------------- |
| `nome`     | `string` | Min 2 caracteres                              |
| `cnpj`     | `string` | Formato: `XX.XXX.XXX/XXXX-XX`                 |
| `endereco` | `string` | Min 5 caracteres                              |
| `telefone` | `string` | Min 10 caracteres                             |
| `email`    | `string` | Email valido                                  |

**Response `201 Created`:** Retorna a empresa criada (mesmo schema do GET).

---

### `PATCH /empresas/:id`

Atualiza uma empresa existente.

**Path Params:**

| Param | Tipo     | Descricao     |
| ----- | -------- | ------------- |
| `id`  | `string` | ID da empresa |

**Request Body:** Mesmo schema do POST.

**Response `200 OK`:** Retorna a empresa atualizada.

---

### `DELETE /empresas/:id`

Remove uma empresa.

**Path Params:**

| Param | Tipo     | Descricao     |
| ----- | -------- | ------------- |
| `id`  | `string` | ID da empresa |

**Response `204 No Content`**

---

## 5. Contratos

### `GET /contratos`

Lista contratos. Aceita filtro opcional por empresa.

**Query Params:**

| Param       | Tipo     | Obrigatorio | Descricao                          |
| ----------- | -------- | ----------- | ---------------------------------- |
| `empresaId` | `string` | Nao         | Filtra contratos de uma empresa    |

**Response `200 OK`:**

```json
[
  {
    "id": "ctr-1",
    "empresaId": "emp-1",
    "numero": "CT-2024/001",
    "descricao": "Servicos de limpeza predial",
    "dataInicio": "2024-01-01",
    "dataFim": "2025-12-31",
    "valor": 150000.00,
    "ativo": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### `GET /contratos/:id`

Retorna um contrato pelo ID.

**Path Params:**

| Param | Tipo     | Descricao      |
| ----- | -------- | -------------- |
| `id`  | `string` | ID do contrato |

**Response `200 OK`:** Mesmo schema do item na listagem.

**Erros:**

| Status | Mensagem                     |
| ------ | ---------------------------- |
| `404`  | Contrato nao encontrado      |

---

### `POST /contratos`

Cria um novo contrato.

**Request Body:**

```json
{
  "empresaId": "emp-1",
  "numero": "CT-2025/010",
  "descricao": "Servicos de vigilancia",
  "dataInicio": "2025-01-01",
  "dataFim": "2026-12-31",
  "valor": 250000.00,
  "ativo": true
}
```

| Campo        | Tipo      | Validacao                     |
| ------------ | --------- | ----------------------------- |
| `empresaId`  | `string`  | Obrigatorio, empresa valida   |
| `numero`     | `string`  | Obrigatorio                   |
| `descricao`  | `string`  | Min 5 caracteres              |
| `dataInicio` | `string`  | Obrigatorio (AAAA-MM-DD)      |
| `dataFim`    | `string`  | Obrigatorio (AAAA-MM-DD)      |
| `valor`      | `number`  | Positivo                      |
| `ativo`      | `boolean` | Obrigatorio                   |

**Response `201 Created`:** Retorna o contrato criado (mesmo schema do GET).

---

### `PATCH /contratos/:id`

Atualiza um contrato existente.

**Path Params:**

| Param | Tipo     | Descricao      |
| ----- | -------- | -------------- |
| `id`  | `string` | ID do contrato |

**Request Body:** Mesmo schema do POST.

**Response `200 OK`:** Retorna o contrato atualizado.

---

### `DELETE /contratos/:id`

Remove um contrato.

**Path Params:**

| Param | Tipo     | Descricao      |
| ----- | -------- | -------------- |
| `id`  | `string` | ID do contrato |

**Response `204 No Content`**

---

## 6. Fiscalizacoes

### `GET /fiscalizacoes`

Lista todas as fiscalizacoes, ordenadas por `createdAt` descendente.

**Response `200 OK`:**

```json
[
  {
    "id": "fis-1",
    "protocolo": "FISC-2025-0001",
    "mesAno": "2025-01",
    "empresaId": "emp-1",
    "contratoId": "ctr-1",
    "empresaNome": "Limpeza Total Ltda",
    "contratoNumero": "CT-2024/001",
    "status": "finalizado",
    "documentos": [
      {
        "id": "doc-1",
        "tipo": "cartao_ponto_fixos",
        "nomeArquivo": "folha_ponto_jan2025.pdf",
        "tamanho": 320000,
        "uploadedAt": "2025-02-05T10:02:00Z"
      }
    ],
    "fiscalizadorId": "usr-2",
    "fiscalizadorNome": "Carlos Oliveira",
    "createdAt": "2025-02-05T10:00:00Z",
    "updatedAt": "2025-02-10T15:30:00Z",
    "relatorioUrl": "/relatorios/fis-1-conformidade.pdf"
  }
]
```

---

### `GET /fiscalizacoes/:id`

Retorna uma fiscalizacao pelo ID.

**Path Params:**

| Param | Tipo     | Descricao            |
| ----- | -------- | -------------------- |
| `id`  | `string` | ID da fiscalizacao   |

**Response `200 OK`:** Mesmo schema do item na listagem.

**Erros:**

| Status | Mensagem                          |
| ------ | --------------------------------- |
| `404`  | Fiscalizacao nao encontrada       |

---

### `POST /fiscalizacoes`

Cria uma nova fiscalizacao com upload de documentos.

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Campo        | Tipo       | Validacao                              |
| ------------ | ---------- | -------------------------------------- |
| `empresaId`  | `string`   | Obrigatorio, empresa valida            |
| `contratoId` | `string`   | Obrigatorio, contrato valido           |
| `mesAno`     | `string`   | Formato `AAAA-MM` (ex: `2025-03`)      |
| `files`      | `File[]`   | Arquivos PDF dos documentos            |

**Regras de negocio:**
- O backend gera o `protocolo` automaticamente no formato `FISC-AAAA-NNNN`
- Status inicial: `em_espera`
- O backend deve processar os documentos de forma assincrona (transicao `em_espera` -> `processando` -> `aguardando_analise`)
- O `tipo` do documento pode ser detectado pelo nome do arquivo ou informado explicitamente

**Tipos de documento validos:**

| Valor                               | Descricao                             |
| ----------------------------------- | ------------------------------------- |
| `cartao_ponto_fixos`                | Cartao de Ponto (Fixos)              |
| `cartao_ponto_substitutos`          | Cartao de Ponto (Substitutos)        |
| `contracheque_fixos`                | Contracheque - Extrato Mensal (Fixos)|
| `contracheque_substitutos`          | Contracheque - Extrato Mensal (Sub.) |
| `cesta_basica_fixos`                | Recibos de Cesta Basica (Fixos)      |
| `cesta_basica_substitutos`          | Recibos de Cesta Basica (Sub.)       |
| `relacao_trabalhadores_fixos`       | Relacao de Trabalhadores (Fixos)     |
| `relacao_trabalhadores_substitutos` | Relacao de Trabalhadores (Sub.)      |

**Response `201 Created`:**

```json
{
  "id": "fis-a1b2c3d4",
  "protocolo": "FISC-2025-0007",
  "mesAno": "2025-03",
  "empresaId": "emp-1",
  "contratoId": "ctr-1",
  "empresaNome": "Limpeza Total Ltda",
  "contratoNumero": "CT-2024/001",
  "status": "em_espera",
  "documentos": [
    {
      "id": "doc-x1y2z3",
      "tipo": "cartao_ponto_fixos",
      "nomeArquivo": "folha_ponto_mar2025.pdf",
      "tamanho": 310000,
      "uploadedAt": "2025-04-01T10:00:00Z"
    }
  ],
  "fiscalizadorId": null,
  "fiscalizadorNome": null,
  "createdAt": "2025-04-01T10:00:00Z",
  "updatedAt": "2025-04-01T10:00:00Z",
  "relatorioUrl": null
}
```

---

### `PATCH /fiscalizacoes/:id/status`

Atualiza o status de uma fiscalizacao.

**Path Params:**

| Param | Tipo     | Descricao            |
| ----- | -------- | -------------------- |
| `id`  | `string` | ID da fiscalizacao   |

**Request Body:**

```json
{
  "status": "finalizado"
}
```

| Campo    | Tipo                 | Validacao                                |
| -------- | -------------------- | ---------------------------------------- |
| `status` | `FiscalizacaoStatus` | Ver [status validos](#11-fluxo-de-status-das-fiscalizacoes) |

**Regras de negocio:**
- Quando o status muda para `finalizado`, o backend deve gerar o `relatorioUrl`

**Response `200 OK`:** Retorna a fiscalizacao atualizada (schema completo).

---

### `POST /fiscalizacoes/:id/assign`

Atribui um fiscalizador a uma fiscalizacao.

**Path Params:**

| Param | Tipo     | Descricao            |
| ----- | -------- | -------------------- |
| `id`  | `string` | ID da fiscalizacao   |

**Request Body:**

```json
{
  "fiscalizadorId": "usr-2",
  "fiscalizadorNome": "Carlos Oliveira"
}
```

| Campo              | Tipo     | Validacao                         |
| ------------------ | -------- | --------------------------------- |
| `fiscalizadorId`   | `string` | Obrigatorio, usuario valido       |
| `fiscalizadorNome` | `string` | Obrigatorio, nome do fiscalizador |

**Regras de negocio:**
- Se o status atual for `aguardando_analise`, transiciona automaticamente para `em_analise`
- So permite atribuir se a fiscalizacao nao tiver fiscalizador

**Response `200 OK`:** Retorna a fiscalizacao atualizada.

---

### `POST /fiscalizacoes/:id/unassign`

Remove o fiscalizador de uma fiscalizacao.

**Path Params:**

| Param | Tipo     | Descricao            |
| ----- | -------- | -------------------- |
| `id`  | `string` | ID da fiscalizacao   |

**Request Body:** Nenhum.

**Regras de negocio:**
- Se o status atual for `em_analise`, transiciona automaticamente para `aguardando_analise`
- Limpa `fiscalizadorId` e `fiscalizadorNome` (ambos viram `null`)

**Response `200 OK`:** Retorna a fiscalizacao atualizada.

---

## 7. Funcionarios

### `GET /fiscalizacoes/:fiscalizacaoId/funcionarios`

Lista os funcionarios vinculados a uma fiscalizacao.

**Path Params:**

| Param             | Tipo     | Descricao            |
| ----------------- | -------- | -------------------- |
| `fiscalizacaoId`  | `string` | ID da fiscalizacao   |

**Response `200 OK`:**

```json
[
  {
    "id": "func-a1b2c3d4",
    "fiscalizacaoId": "fis-3",
    "nome": "Ana Beatriz Silva",
    "cargo": "Auxiliar de Limpeza",
    "salario": 1800.00,
    "recebeuVT": true,
    "recebeuFGTS": true,
    "recebeuINSS": true,
    "recebeuCestaBasica": false,
    "substituto": false,
    "horasTrabalhadas": 168,
    "riscoInconformidade": "baixo"
  }
]
```

| Campo                 | Tipo                              | Descricao                          |
| --------------------- | --------------------------------- | ---------------------------------- |
| `id`                  | `string`                          | ID do funcionario                  |
| `fiscalizacaoId`      | `string`                          | ID da fiscalizacao vinculada       |
| `nome`                | `string`                          | Nome completo                      |
| `cargo`               | `string`                          | Cargo/funcao                       |
| `salario`             | `number`                          | Salario (>= 0)                     |
| `recebeuVT`           | `boolean`                         | Recebeu vale-transporte            |
| `recebeuFGTS`         | `boolean`                         | FGTS regular                       |
| `recebeuINSS`         | `boolean`                         | INSS regular                       |
| `recebeuCestaBasica`  | `boolean`                         | Recebeu cesta basica               |
| `substituto`          | `boolean`                         | Se e funcionario substituto        |
| `horasTrabalhadas`    | `number`                          | Horas trabalhadas no mes (>= 0)    |
| `riscoInconformidade` | `"alto" \| "medio" \| "baixo"`    | Nivel de risco de inconformidade   |

---

### `PUT /fiscalizacoes/:fiscalizacaoId/funcionarios`

Substitui todos os funcionarios de uma fiscalizacao (salvar analise).

**Path Params:**

| Param             | Tipo     | Descricao            |
| ----------------- | -------- | -------------------- |
| `fiscalizacaoId`  | `string` | ID da fiscalizacao   |

**Request Body:**

```json
{
  "funcionarios": [
    {
      "id": "func-a1b2c3d4",
      "fiscalizacaoId": "fis-3",
      "nome": "Ana Beatriz Silva",
      "cargo": "Auxiliar de Limpeza",
      "salario": 1800.00,
      "recebeuVT": true,
      "recebeuFGTS": true,
      "recebeuINSS": true,
      "recebeuCestaBasica": true,
      "substituto": false,
      "horasTrabalhadas": 168,
      "riscoInconformidade": "baixo"
    }
  ]
}
```

**Response `200 OK`:** Retorna a lista de funcionarios atualizada (mesmo schema do GET).

---

## 8. Notificacoes

### `GET /notificacoes`

Lista todas as notificacoes do usuario autenticado.

**Response `200 OK`:**

```json
[
  {
    "id": "notif-a1b2c3d4",
    "title": "Fiscalizacao pronta para analise",
    "message": "FISC-2025-0003 (Limpeza Total Ltda - 2025-02) esta pronta para analise.",
    "type": "info",
    "read": false,
    "fiscalizacaoId": "fis-3",
    "createdAt": "2025-03-05T14:00:00Z"
  }
]
```

| Campo             | Tipo                                  | Descricao                          |
| ----------------- | ------------------------------------- | ---------------------------------- |
| `id`              | `string`                              | ID da notificacao                  |
| `title`           | `string`                              | Titulo                             |
| `message`         | `string`                              | Mensagem completa                  |
| `type`            | `"info" \| "warning" \| "success"`    | Tipo/severidade                    |
| `read`            | `boolean`                             | Se foi lida                        |
| `fiscalizacaoId`  | `string \| null`                      | Fiscalizacao relacionada (se houver) |
| `createdAt`       | `string`                              | Data de criacao (ISO 8601)         |

---

### `PATCH /notificacoes/:id/read`

Marca uma notificacao como lida.

**Path Params:**

| Param | Tipo     | Descricao            |
| ----- | -------- | -------------------- |
| `id`  | `string` | ID da notificacao    |

**Response `204 No Content`**

---

### `PATCH /notificacoes/read-all`

Marca todas as notificacoes do usuario como lidas.

**Response `204 No Content`**

---

## 9. Relatorios

### `GET /relatorios`

Retorna relatorio geral de fiscalizacoes com totalizadores por status.

**Query Params:**

| Param        | Tipo     | Obrigatorio | Descricao                         |
| ------------ | -------- | ----------- | --------------------------------- |
| `dataInicio` | `string` | Nao         | Filtro data inicio (ISO 8601)     |
| `dataFim`    | `string` | Nao         | Filtro data fim (ISO 8601)        |
| `empresaId`  | `string` | Nao         | Filtrar por empresa               |
| `contratoId` | `string` | Nao         | Filtrar por contrato              |

**Response `200 OK`:**

```json
{
  "summary": {
    "total": 6,
    "finalizados": 2,
    "emEspera": 2,
    "processando": 1,
    "aguardandoAnalise": 1,
    "emAnalise": 0,
    "cancelados": 0
  },
  "fiscalizacoes": [
    {
      "id": "fis-1",
      "protocolo": "FISC-2025-0001",
      "mesAno": "2025-01",
      "empresaId": "emp-1",
      "contratoId": "ctr-1",
      "empresaNome": "Limpeza Total Ltda",
      "contratoNumero": "CT-2024/001",
      "status": "finalizado",
      "documentos": [],
      "fiscalizadorId": "usr-2",
      "fiscalizadorNome": "Carlos Oliveira",
      "createdAt": "2025-02-05T10:00:00Z",
      "updatedAt": "2025-02-10T15:30:00Z",
      "relatorioUrl": "/relatorios/fis-1-conformidade.pdf"
    }
  ]
}
```

| Campo (summary)      | Tipo     | Descricao                             |
| -------------------- | -------- | ------------------------------------- |
| `total`              | `number` | Total de fiscalizacoes filtradas      |
| `finalizados`        | `number` | Qtd com status `finalizado`           |
| `emEspera`           | `number` | Qtd com status `em_espera`            |
| `processando`        | `number` | Qtd com status `processando`          |
| `aguardandoAnalise`  | `number` | Qtd com status `aguardando_analise`   |
| `emAnalise`          | `number` | Qtd com status `em_analise`           |
| `cancelados`         | `number` | Qtd com status `cancelado`            |

---

### `GET /relatorios/conformidade`

Retorna relatorio de conformidade com analise por empresa, tendencia mensal e problemas comuns.

**Query Params:**

| Param          | Tipo     | Obrigatorio | Descricao                         |
| -------------- | -------- | ----------- | --------------------------------- |
| `empresaId`    | `string` | Nao         | Filtrar por empresa               |
| `mesAnoInicio` | `string` | Nao         | Mes/ano inicio (`AAAA-MM`)        |
| `mesAnoFim`    | `string` | Nao         | Mes/ano fim (`AAAA-MM`)           |

**Response `200 OK`:**

```json
{
  "resumo": {
    "totalEmpresas": 3,
    "totalFiscalizacoes": 6,
    "finalizados": 2
  },
  "empresas": [
    {
      "empresaId": "emp-1",
      "empresaNome": "Limpeza Total Ltda",
      "total": 2,
      "finalizados": 1,
      "emAndamento": 1
    }
  ],
  "tendenciaMensal": [
    {
      "mesAno": "2025-01",
      "total": 2,
      "finalizados": 2
    },
    {
      "mesAno": "2025-02",
      "total": 4,
      "finalizados": 0
    }
  ],
  "problemasComuns": [
    {
      "descricao": "Cesta basica nao comprovada",
      "quantidade": 3,
      "percentual": 60
    },
    {
      "descricao": "Vale-transporte nao comprovado",
      "quantidade": 1,
      "percentual": 20
    }
  ]
}
```

| Campo (resumo)         | Tipo     | Descricao                                 |
| ---------------------- | -------- | ----------------------------------------- |
| `totalEmpresas`        | `number` | Quantidade de empresas no periodo         |
| `totalFiscalizacoes`   | `number` | Total de fiscalizacoes no periodo         |
| `finalizados`          | `number` | Qtd finalizadas                           |

| Campo (empresas[])     | Tipo     | Descricao                                 |
| ---------------------- | -------- | ----------------------------------------- |
| `empresaId`            | `string` | ID da empresa                             |
| `empresaNome`          | `string` | Nome da empresa                           |
| `total`                | `number` | Total de fiscalizacoes da empresa         |
| `finalizados`          | `number` | Qtd finalizadas                           |
| `emAndamento`          | `number` | Qtd em andamento (nao finalizado/cancelado)|

| Campo (tendenciaMensal[]) | Tipo     | Descricao                              |
| ------------------------- | -------- | -------------------------------------- |
| `mesAno`                  | `string` | Mes/ano (`AAAA-MM`)                    |
| `total`                   | `number` | Total no mes                           |
| `finalizados`             | `number` | Finalizados no mes                     |

| Campo (problemasComuns[]) | Tipo     | Descricao                              |
| ------------------------- | -------- | -------------------------------------- |
| `descricao`               | `string` | Descricao do problema                  |
| `quantidade`              | `number` | Qtd de funcionarios afetados           |
| `percentual`              | `number` | Percentual em relacao ao total (0-100) |

**Problemas possiveis:**

| Descricao                          | Campo verificado    |
| ---------------------------------- | ------------------- |
| Vale-transporte nao comprovado     | `recebeuVT`         |
| FGTS irregular                     | `recebeuFGTS`       |
| INSS em atraso                     | `recebeuINSS`       |
| Cesta basica nao comprovada        | `recebeuCestaBasica`|

---

## 10. Tipos Auxiliares

### FiscalizacaoStatus

```
"em_espera" | "processando" | "aguardando_analise" | "em_analise" | "finalizado" | "cancelado"
```

| Valor                 | Label          | Descricao                                      |
| --------------------- | -------------- | ---------------------------------------------- |
| `em_espera`           | Em Espera      | Criada, aguardando inicio do processamento     |
| `processando`         | Processando    | Documentos sendo processados                   |
| `aguardando_analise`  | Ag. Analise    | Pronta para um fiscalizador assumir            |
| `em_analise`          | Em Analise     | Um fiscalizador assumiu e esta analisando      |
| `finalizado`          | Finalizado     | Analise concluida, relatorio gerado            |
| `cancelado`           | Cancelado      | Fiscalizacao cancelada                         |

### UserRole

```
"fiscal" | "administrador"
```

### RiscoInconformidade

```
"alto" | "medio" | "baixo"
```

### DocumentoTipo

```
"cartao_ponto_fixos" | "cartao_ponto_substitutos" | "contracheque_fixos" | "contracheque_substitutos" | "cesta_basica_fixos" | "cesta_basica_substitutos" | "relacao_trabalhadores_fixos" | "relacao_trabalhadores_substitutos"
```

---

## 11. Fluxo de Status das Fiscalizacoes

```
                          +-----------+
                          | cancelado |
                          +-----------+
                            ^       ^
                            |       |
+-----------+  auto   +-----------+  auto   +-------------------+  assign   +------------+  finalizar  +------------+
| em_espera | ------> |processando| ------> | aguardando_analise| --------> | em_analise | ----------> | finalizado |
+-----------+         +-----------+         +-------------------+           +------------+             +------------+
                                                    ^                             |
                                                    |         unassign            |
                                                    +-----------------------------+
```

### Transicoes validas

| De                    | Para                  | Gatilho                              |
| --------------------- | --------------------- | ------------------------------------ |
| `em_espera`           | `processando`         | Automatico (processamento de docs)   |
| `em_espera`           | `cancelado`           | Acao manual do usuario               |
| `processando`         | `aguardando_analise`  | Automatico (processamento concluido) |
| `processando`         | `cancelado`           | Acao manual do usuario               |
| `aguardando_analise`  | `em_analise`          | Fiscalizador assume (assign)         |
| `em_analise`          | `aguardando_analise`  | Fiscalizador desatribui (unassign)   |
| `em_analise`          | `finalizado`          | Fiscalizador finaliza a analise      |

### Efeitos colaterais

| Transicao                                     | Efeito                                                  |
| --------------------------------------------- | ------------------------------------------------------- |
| `processando` -> `aguardando_analise`         | Gera lista de funcionarios; cria notificacao             |
| `aguardando_analise` -> `em_analise` (assign) | Define `fiscalizadorId` e `fiscalizadorNome`             |
| `em_analise` -> `aguardando_analise` (unassign)| Limpa `fiscalizadorId` e `fiscalizadorNome` para `null` |
| `em_analise` -> `finalizado`                  | Gera `relatorioUrl`                                     |

---

## 12. Controle de Acesso

### Permissoes por role

| Recurso                | fiscal | administrador |
| ---------------------- | ------ | ------------- |
| `POST /auth/login`     | sim    | sim           |
| `PATCH /perfil/senha`  | sim    | sim           |
| **Usuarios**           | nao    | CRUD completo |
| **Empresas**           | nao    | CRUD completo |
| **Contratos**          | leitura| CRUD completo |
| **Fiscalizacoes**      | sim    | sim           |
| **Funcionarios**       | sim    | sim           |
| **Notificacoes**       | sim    | sim           |
| **Relatorios**         | sim    | sim           |

### Restricoes adicionais nas fiscalizacoes

| Acao         | Restricao                                                              |
| ------------ | ---------------------------------------------------------------------- |
| Assumir      | Status deve ser `aguardando_analise` e sem fiscalizador atribuido      |
| Desatribuir  | Somente o proprio fiscalizador atribuido pode desatribuir              |
| Analisar     | Status deve ser `em_analise` e o usuario deve ser o fiscalizador atribuido |
| Cancelar     | Status deve ser `em_espera` ou `processando`                           |
| Finalizar    | Status deve ser `em_analise` e o usuario deve ser o fiscalizador atribuido |
| Baixar relatorio | Status deve ser `finalizado`                                       |
