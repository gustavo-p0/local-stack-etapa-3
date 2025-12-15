const AWS = require('aws-sdk');

// Configuração do DynamoDB para LocalStack
const dynamodbConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// Se estiver rodando no LocalStack, usa endpoint local
if (process.env.AWS_ENDPOINT_URL) {
  dynamodbConfig.endpoint = process.env.AWS_ENDPOINT_URL;
  dynamodbConfig.accessKeyId = 'test';
  dynamodbConfig.secretAccessKey = 'test';
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamodbConfig);
const tableName = process.env.PRODUCTS_TABLE;

/**
 * Salva um produto no DynamoDB
 */
async function putProduct(product) {
  const params = {
    TableName: tableName,
    Item: product
  };
  return dynamodb.put(params).promise();
}

/**
 * Busca um produto por ID
 */
async function getProduct(id) {
  const params = {
    TableName: tableName,
    Key: { id }
  };
  const result = await dynamodb.get(params).promise();
  return result.Item;
}

/**
 * Lista todos os produtos
 */
async function scanProducts() {
  const params = {
    TableName: tableName
  };
  const result = await dynamodb.scan(params).promise();
  return result.Items || [];
}

/**
 * Atualiza um produto existente
 */
async function updateProduct(id, updates) {
  // Constrói a expressão de atualização dinamicamente
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key, index) => {
    const attrName = `#attr${index}`;
    const attrValue = `:val${index}`;
    updateExpressions.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = updates[key];
  });

  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };

  const result = await dynamodb.update(params).promise();
  return result.Attributes;
}

/**
 * Deleta um produto
 */
async function deleteProduct(id) {
  const params = {
    TableName: tableName,
    Key: { id }
  };
  return dynamodb.delete(params).promise();
}

module.exports = {
  putProduct,
  getProduct,
  scanProducts,
  updateProduct,
  deleteProduct
};

