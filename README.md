# CRUD Serverless com LocalStack e SNS

Sistema CRUD completo de gerenciamento de produtos utilizando arquitetura serverless com AWS Lambda, DynamoDB, SNS e LocalStack para simulação local.

## 📋 Descrição do Projeto

Este projeto implementa uma API REST serverless para gerenciamento de produtos (shopping list) com as seguintes funcionalidades:

- **CRUD Completo**: Criar, listar, buscar, atualizar e deletar produtos
- **Notificações SNS**: Sistema de mensageria que notifica sobre criação e atualização de produtos
- **Subscriber Lambda**: Função que recebe notificações e simula envio de emails
- **Persistência**: Armazenamento em DynamoDB
- **Ambiente Local**: Simulação completa usando LocalStack

## 🏗️ Arquitetura

```
Cliente → API Gateway → Lambda Functions → DynamoDB
                              ↓
                          SNS Topic
                              ↓
                      Subscriber Lambda
```

## 🛠️ Stack Tecnológica

- **Runtime**: Node.js 18.x
- **Framework**: Serverless Framework v3
- **Cloud Emulator**: LocalStack (Docker)
- **Database**: DynamoDB
- **Messaging**: Amazon SNS
- **API**: API Gateway REST

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **Serverless Framework**: `npm install -g serverless`
- **AWS CLI** (opcional, para testes): `pip install awscli-local`
- **jq** (opcional, para formatar JSON): `brew install jq` (macOS) ou `apt install jq` (Linux)

## 🚀 Instalação e Execução

### 1. Clone e instale as dependências

```bash
# Instalar dependências do Node.js
npm install
```

### 2. Inicie o LocalStack

```bash
# Subir o container do LocalStack
docker-compose up -d

# Verificar se está rodando
docker ps | grep localstack
```

### 3. Deploy da aplicação

```bash
# Deploy no LocalStack (ambiente local)
npm run deploy

# Ou usando o comando direto
serverless deploy --stage local
```

**Importante**: Após o deploy, o Serverless Framework exibirá os endpoints da API. Anote a URL base, pois você precisará dela para fazer as requisições.

Exemplo de saída:
```
endpoints:
  POST - http://localhost:4566/restapis/abc123/local/_user_request/items
  GET - http://localhost:4566/restapis/abc123/local/_user_request/items
  ...
```

### 4. Testar a API

```bash
# Dar permissão de execução ao script
chmod +x scripts/test-api.sh

# Editar o script e substituir API_URL pela URL do seu deploy
# Depois executar:
./scripts/test-api.sh
```

## 📚 Documentação da API

### Base URL

```
http://localhost:4566/restapis/{API_ID}/local/_user_request
```

### Endpoints

#### 1. Criar Produto

**POST** `/items`

Cria um novo produto e envia notificação SNS.

**Request Body**:
```json
{
  "name": "Notebook Dell Inspiron",
  "description": "Notebook com Intel i7, 16GB RAM, 512GB SSD",
  "price": 3499.90,
  "quantity": 15
}
```

**Response** (201 Created):
```json
{
  "message": "Produto criado com sucesso",
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Notebook Dell Inspiron",
    "description": "Notebook com Intel i7, 16GB RAM, 512GB SSD",
    "price": 3499.90,
    "quantity": 15,
    "createdAt": "2025-12-14T10:30:00.000Z",
    "updatedAt": "2025-12-14T10:30:00.000Z"
  }
}
```

#### 2. Listar Todos os Produtos

**GET** `/items`

Retorna lista com todos os produtos cadastrados.

**Response** (200 OK):
```json
{
  "count": 2,
  "products": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Notebook Dell Inspiron",
      "description": "Notebook com Intel i7, 16GB RAM, 512GB SSD",
      "price": 3499.90,
      "quantity": 15,
      "createdAt": "2025-12-14T10:30:00.000Z",
      "updatedAt": "2025-12-14T10:30:00.000Z"
    },
    ...
  ]
}
```

#### 3. Buscar Produto por ID

**GET** `/items/{id}`

Retorna um produto específico.

**Response** (200 OK):
```json
{
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Notebook Dell Inspiron",
    "description": "Notebook com Intel i7, 16GB RAM, 512GB SSD",
    "price": 3499.90,
    "quantity": 15,
    "createdAt": "2025-12-14T10:30:00.000Z",
    "updatedAt": "2025-12-14T10:30:00.000Z"
  }
}
```

**Response** (404 Not Found):
```json
{
  "message": "Produto não encontrado"
}
```

#### 4. Atualizar Produto

**PUT** `/items/{id}`

Atualiza um produto existente e envia notificação SNS.

**Request Body** (todos os campos são opcionais):
```json
{
  "name": "Notebook Dell Inspiron 15",
  "price": 3299.90,
  "quantity": 20
}
```

**Response** (200 OK):
```json
{
  "message": "Produto atualizado com sucesso",
  "product": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Notebook Dell Inspiron 15",
    "description": "Notebook com Intel i7, 16GB RAM, 512GB SSD",
    "price": 3299.90,
    "quantity": 20,
    "createdAt": "2025-12-14T10:30:00.000Z",
    "updatedAt": "2025-12-14T10:35:00.000Z"
  }
}
```

#### 5. Deletar Produto

**DELETE** `/items/{id}`

Remove um produto do sistema.

**Response** (204 No Content)

## 📬 Sistema de Notificações SNS

### Como Funciona

1. Quando um produto é **criado** ou **atualizado**, a função Lambda publica uma mensagem no tópico SNS
2. A função **subscriber** está inscrita no tópico e recebe automaticamente as notificações
3. O subscriber loga os detalhes e simula o envio de um email

### Visualizar Logs do Subscriber

```bash
# Ver logs em tempo real
serverless logs -f subscriber --stage local --tail

# Ver logs das últimas execuções
serverless logs -f subscriber --stage local
```

### Exemplo de Log do Subscriber

```
============================================================
📢 NOTIFICAÇÃO SNS RECEBIDA
============================================================
Timestamp: 2025-12-14T10:30:00.000Z
Subject: Product created: Notebook Dell Inspiron
MessageId: 12345678-1234-1234-1234-123456789012

Ação: created
Timestamp do evento: 2025-12-14T10:30:00.000Z

PRODUTO:
  ID: 550e8400-e29b-41d4-a716-446655440000
  Nome: Notebook Dell Inspiron
  Descrição: Notebook com Intel i7, 16GB RAM, 512GB SSD
  Preço: R$ 3499.90
  Quantidade: 15
  Criado em: 2025-12-14T10:30:00.000Z
  Atualizado em: 2025-12-14T10:30:00.000Z
============================================================

📧 SIMULAÇÃO DE ENVIO DE EMAIL
------------------------------------------------------------
De: noreply@products-crud-service.com
Para: admin@products-crud-service.com
Assunto: Novo Produto Cadastrado - Notebook Dell Inspiron

Corpo do Email:
Olá,

Um novo produto foi cadastrado no sistema:

Nome: Notebook Dell Inspiron
Descrição: Notebook com Intel i7, 16GB RAM, 512GB SSD
Preço: R$ 3499.90
Quantidade em estoque: 15
ID: 550e8400-e29b-41d4-a716-446655440000

Data/Hora: 2025-12-14T10:30:00.000Z

Atenciosamente,
Sistema de Gerenciamento de Produtos
------------------------------------------------------------
✅ Email simulado enviado com sucesso!
```

## ✅ Validações Implementadas

### Create (POST)
- `name`: obrigatório, string não vazia
- `price`: obrigatório, número > 0
- `quantity`: obrigatório, número >= 0
- `description`: opcional, string

### Update (PUT)
- Todos os campos são opcionais
- Validação de tipo aplicada aos campos fornecidos
- Produto deve existir (retorna 404 se não encontrado)

## 🔍 Comandos Úteis

### Verificar recursos no LocalStack

```bash
# Listar tabelas DynamoDB
aws dynamodb list-tables --endpoint-url=http://localhost:4566

# Escanear produtos no DynamoDB
aws dynamodb scan \
  --table-name ProductsTable-local \
  --endpoint-url=http://localhost:4566

# Listar tópicos SNS
aws sns list-topics --endpoint-url=http://localhost:4566

# Ver informações do stack CloudFormation
aws cloudformation describe-stacks \
  --stack-name products-crud-service-local \
  --endpoint-url=http://localhost:4566
```

### Gerenciamento do Serverless

```bash
# Ver informações do deploy
serverless info --stage local

# Ver logs de uma função específica
serverless logs -f createProduct --stage local

# Invocar função diretamente (teste local)
serverless invoke local -f createProduct --data '{"body":"{\"name\":\"Test\",\"price\":10,\"quantity\":5}"}'

# Remover toda a stack
npm run remove
# ou
serverless remove --stage local
```

### Docker e LocalStack

```bash
# Ver logs do LocalStack
docker logs localstack-produtos -f

# Parar LocalStack
docker-compose down

# Reiniciar LocalStack (limpa dados)
docker-compose down && docker-compose up -d
```

## 📊 Estrutura do Projeto

```
local-stack-etapa-3/
├── src/
│   ├── handlers/              # Funções Lambda
│   │   ├── createProduct.js   # POST /items
│   │   ├── getProducts.js     # GET /items
│   │   ├── getProduct.js      # GET /items/{id}
│   │   ├── updateProduct.js   # PUT /items/{id}
│   │   ├── deleteProduct.js   # DELETE /items/{id}
│   │   └── subscriber.js      # SNS Subscriber
│   └── utils/                 # Utilitários
│       ├── dynamodb.js        # Helper DynamoDB
│       ├── sns.js             # Helper SNS
│       └── validator.js       # Validações
├── scripts/
│   └── test-api.sh            # Script de testes
├── docker-compose.yml         # Configuração LocalStack
├── serverless.yml             # Configuração Serverless
├── package.json               # Dependências
└── README.md                  # Este arquivo
```

## 🧪 Evidências de Teste

### Checklist para Demonstração

- [ ] LocalStack rodando (`docker ps`)
- [ ] Deploy realizado com sucesso
- [ ] POST - Criar produto e receber status 201
- [ ] GET - Listar todos os produtos
- [ ] GET - Buscar produto por ID específico
- [ ] PUT - Atualizar produto existente
- [ ] DELETE - Remover produto
- [ ] Logs do subscriber mostrando notificações SNS
- [ ] Verificar dados no DynamoDB via AWS CLI

### Capturando Screenshots

1. **Terminal com deploy**: `serverless deploy --stage local`
2. **Resposta do POST** criando produto
3. **Logs do subscriber** mostrando notificação SNS recebida
4. **GET** listando produtos
5. **Scan do DynamoDB** mostrando dados persistidos

## 🐛 Troubleshooting

### LocalStack não está respondendo

```bash
# Verificar se está rodando
docker ps | grep localstack

# Reiniciar
docker-compose restart

# Ver logs de erros
docker logs localstack-produtos
```

### Erro no deploy

```bash
# Remover stack anterior
serverless remove --stage local

# Tentar deploy novamente
serverless deploy --stage local
```

### Funções Lambda não encontram variáveis de ambiente

Verifique se o `serverless.yml` está configurado corretamente com:
- `PRODUCTS_TABLE`
- `SNS_TOPIC_ARN`
- `AWS_ENDPOINT_URL`

### SNS não está enviando notificações

```bash
# Verificar se o tópico existe
aws sns list-topics --endpoint-url=http://localhost:4566

# Verificar subscriptions
aws sns list-subscriptions --endpoint-url=http://localhost:4566
```

## 👨‍💻 Autor

Projeto desenvolvido para a disciplina de Laboratório de Desenvolvimento de Aplicações Móveis e Distribuídas - PUC Minas

## 📝 Licença

MIT License - Projeto educacional

---

## 🎯 Próximos Passos (Melhorias Possíveis)

- [ ] Adicionar autenticação JWT
- [ ] Implementar paginação na listagem
- [ ] Adicionar filtros e busca
- [ ] Implementar cache com ElastiCache/Redis
- [ ] Upload de imagens dos produtos (S3)
- [ ] Adicionar testes unitários e de integração
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em AWS real (não LocalStack)

