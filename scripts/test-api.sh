#!/bin/bash

# Script para testar a API de produtos no LocalStack
# Certifique-se de que o LocalStack está rodando e o deploy foi feito

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# URL base da API (ajuste se necessário)
# Você precisará pegar a URL gerada pelo serverless deploy
echo -e "${YELLOW}==================================================================${NC}"
echo -e "${YELLOW}IMPORTANTE: Substitua API_URL pela URL gerada no 'serverless deploy'${NC}"
echo -e "${YELLOW}==================================================================${NC}"
echo ""

API_URL="http://localhost:4566/restapis/YOUR_API_ID/local/_user_request"

# Verifica se a variável de ambiente foi configurada
if [ "$API_URL" == "http://localhost:4566/restapis/YOUR_API_ID/local/_user_request" ]; then
    echo -e "${RED}❌ Por favor, configure a API_URL com o endpoint correto!${NC}"
    echo -e "${YELLOW}Dica: Execute 'serverless deploy --stage local' e copie a URL dos endpoints${NC}"
    echo ""
    echo -e "${BLUE}Ou defina a variável de ambiente:${NC}"
    echo "export API_URL='http://localhost:4566/restapis/SEU_API_ID/local/_user_request'"
    echo ""
    exit 1
fi

echo -e "${BLUE}📍 URL da API: ${API_URL}${NC}"
echo ""

# Função para fazer pausa
pause() {
    echo ""
    read -p "Pressione ENTER para continuar..."
    echo ""
}

# Variáveis para armazenar IDs dos produtos criados
PRODUCT_ID_1=""
PRODUCT_ID_2=""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}1. Criando Produto 1 (Notebook)${NC}"
echo -e "${GREEN}========================================${NC}"
curl -X POST "${API_URL}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell Inspiron",
    "description": "Notebook com Intel i7, 16GB RAM, 512GB SSD",
    "price": 3499.90,
    "quantity": 15
  }' | jq '.'

# Captura o ID do primeiro produto (você pode precisar ajustar isso)
echo ""
echo -e "${YELLOW}💾 Anote o ID do produto criado acima${NC}"
pause

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}2. Criando Produto 2 (Mouse)${NC}"
echo -e "${GREEN}========================================${NC}"
curl -X POST "${API_URL}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouse Logitech MX Master 3",
    "description": "Mouse ergonômico wireless",
    "price": 449.90,
    "quantity": 50
  }' | jq '.'

echo ""
echo -e "${YELLOW}💾 Anote o ID do produto criado acima${NC}"
pause

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}3. Criando Produto 3 (Teclado)${NC}"
echo -e "${GREEN}========================================${NC}"
curl -X POST "${API_URL}/items" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teclado Mecânico Keychron K2",
    "description": "Teclado mecânico 75% com switch brown",
    "price": 899.90,
    "quantity": 25
  }' | jq '.'

echo ""
pause

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}4. Listando Todos os Produtos${NC}"
echo -e "${BLUE}========================================${NC}"
curl -X GET "${API_URL}/items" \
  -H "Content-Type: application/json" | jq '.'

echo ""
pause

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}5. Buscando Produto por ID${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Digite o ID de um produto para buscar:${NC}"
read PRODUCT_ID

if [ ! -z "$PRODUCT_ID" ]; then
    curl -X GET "${API_URL}/items/${PRODUCT_ID}" \
      -H "Content-Type: application/json" | jq '.'
else
    echo -e "${RED}ID não fornecido, pulando teste...${NC}"
fi

echo ""
pause

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}6. Atualizando Produto${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Digite o ID do produto para atualizar:${NC}"
read UPDATE_PRODUCT_ID

if [ ! -z "$UPDATE_PRODUCT_ID" ]; then
    curl -X PUT "${API_URL}/items/${UPDATE_PRODUCT_ID}" \
      -H "Content-Type: application/json" \
      -d '{
        "price": 3299.90,
        "quantity": 20
      }' | jq '.'
else
    echo -e "${RED}ID não fornecido, pulando teste...${NC}"
fi

echo ""
pause

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}7. Listando Produtos Após Atualização${NC}"
echo -e "${BLUE}========================================${NC}"
curl -X GET "${API_URL}/items" \
  -H "Content-Type: application/json" | jq '.'

echo ""
pause

echo -e "${RED}========================================${NC}"
echo -e "${RED}8. Deletando Produto${NC}"
echo -e "${RED}========================================${NC}"
echo -e "${YELLOW}Digite o ID do produto para deletar:${NC}"
read DELETE_PRODUCT_ID

if [ ! -z "$DELETE_PRODUCT_ID" ]; then
    curl -X DELETE "${API_URL}/items/${DELETE_PRODUCT_ID}" \
      -H "Content-Type: application/json" -v
else
    echo -e "${RED}ID não fornecido, pulando teste...${NC}"
fi

echo ""
pause

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}9. Listando Produtos Após Deleção${NC}"
echo -e "${BLUE}========================================${NC}"
curl -X GET "${API_URL}/items" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Testes Concluídos!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 Para ver os logs do subscriber SNS, execute:${NC}"
echo "serverless logs -f subscriber --stage local --tail"
echo ""
echo -e "${YELLOW}📊 Para verificar os dados no DynamoDB local:${NC}"
echo "aws dynamodb scan --table-name ProductsTable-local --endpoint-url=http://localhost:4566"
echo ""

