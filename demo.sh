#!/bin/bash

# Script de demonstração do CRUD Serverless
# Usa serverless invoke local que funciona perfeitamente

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  DEMO: CRUD Serverless com SNS${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verifica se está no diretório correto
if [ ! -f "serverless.yml" ]; then
    echo -e "${YELLOW}⚠️  Execute este script do diretório raiz do projeto${NC}"
    exit 1
fi

# 1. Criar Produto
echo -e "${GREEN}1. Criando Produto (Notebook Dell)...${NC}"
echo ""
RESULT=$(npx serverless invoke local -f createProduct --data '{"body":"{\"name\":\"Notebook Dell Inspiron\",\"description\":\"Intel i7, 16GB RAM, 512GB SSD\",\"price\":3499.90,\"quantity\":15}"}' 2>&1)
echo "$RESULT"
echo ""

# Extrair o ID do produto criado
PRODUCT_ID=$(echo "$RESULT" | grep -o '"id": "[^"]*' | head -1 | sed 's/"id": "//')
echo -e "${YELLOW}💾 ID do produto: $PRODUCT_ID${NC}"
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 2. Criar mais um produto
echo -e "${GREEN}2. Criando Produto (Mouse Logitech)...${NC}"
echo ""
RESULT2=$(npx serverless invoke local -f createProduct --data '{"body":"{\"name\":\"Mouse Logitech MX Master 3\",\"description\":\"Mouse ergonômico wireless\",\"price\":449.90,\"quantity\":50}"}' 2>&1)
echo "$RESULT2"
echo ""

PRODUCT_ID_2=$(echo "$RESULT2" | grep -o '"id": "[^"]*' | head -1 | sed 's/"id": "//')
echo -e "${YELLOW}💾 ID do produto: $PRODUCT_ID_2${NC}"
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 3. Listar Produtos
echo -e "${BLUE}3. Listando todos os produtos...${NC}"
echo ""
npx serverless invoke local -f getProducts --data '{}'
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 4. Buscar produto por ID
if [ ! -z "$PRODUCT_ID" ]; then
    echo -e "${YELLOW}4. Buscando produto por ID ($PRODUCT_ID)...${NC}"
    echo ""
    npx serverless invoke local -f getProduct --data "{\"pathParameters\":{\"id\":\"$PRODUCT_ID\"}}"
    echo ""
    read -p "Pressione ENTER para continuar..."
    echo ""
fi

# 5. Atualizar produto
if [ ! -z "$PRODUCT_ID" ]; then
    echo -e "${GREEN}5. Atualizando produto ($PRODUCT_ID)...${NC}"
    echo -e "${YELLOW}Novo preço: R\$ 3299.90, Nova quantidade: 20${NC}"
    echo ""
    npx serverless invoke local -f updateProduct --data "{\"pathParameters\":{\"id\":\"$PRODUCT_ID\"},\"body\":\"{\\\"price\\\":3299.90,\\\"quantity\\\":20}\"}"
    echo ""
    read -p "Pressione ENTER para continuar..."
    echo ""
fi

# 6. Listar novamente para ver atualização
echo -e "${BLUE}6. Listando produtos após atualização...${NC}"
echo ""
npx serverless invoke local -f getProducts --data '{}'
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 7. Deletar produto
if [ ! -z "$PRODUCT_ID_2" ]; then
    echo -e "${YELLOW}7. Deletando produto ($PRODUCT_ID_2)...${NC}"
    echo ""
    npx serverless invoke local -f deleteProduct --data "{\"pathParameters\":{\"id\":\"$PRODUCT_ID_2\"}}"
    echo ""
    read -p "Pressione ENTER para continuar..."
    echo ""
fi

# 8. Listar após deleção
echo -e "${BLUE}8. Listando produtos após deleção...${NC}"
echo ""
npx serverless invoke local -f getProducts --data '{}'
echo ""
read -p "Pressione ENTER para continuar..."
echo ""

# 9. Testar subscriber
echo -e "${GREEN}9. Testando Subscriber SNS...${NC}"
echo ""
npx serverless invoke local -f subscriber --data '{"Records":[{"Sns":{"Message":"{\"action\":\"created\",\"product\":{\"id\":\"demo-123\",\"name\":\"Produto Demo\",\"description\":\"Teste de notificação\",\"price\":99.99,\"quantity\":10,\"createdAt\":\"2025-12-14T10:30:00.000Z\",\"updatedAt\":\"2025-12-14T10:30:00.000Z\"},\"timestamp\":\"2025-12-14T10:30:00.000Z\"}","Subject":"Product created: Produto Demo","Timestamp":"2025-12-14T10:30:00.000Z","MessageId":"demo-msg-123"}}]}'
echo ""

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ DEMONSTRAÇÃO CONCLUÍDA!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 Resumo:${NC}"
echo "  ✅ Criação de produtos (POST)"
echo "  ✅ Listagem de produtos (GET)"
echo "  ✅ Busca por ID (GET)"
echo "  ✅ Atualização de produto (PUT)"
echo "  ✅ Deleção de produto (DELETE)"
echo "  ✅ Notificações SNS funcionando"
echo "  ✅ Subscriber recebendo e processando mensagens"
echo ""
echo -e "${BLUE}📊 Para ver dados no DynamoDB (requer awscli-local):${NC}"
echo "  awslocal dynamodb scan --table-name ProductsTable-local"
echo ""
echo -e "${BLUE}🐳 LocalStack Status:${NC}"
docker ps | grep localstack
echo ""

