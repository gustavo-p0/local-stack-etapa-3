const { v4: uuidv4 } = require('uuid');
const { putProduct } = require('../utils/dynamodb');
const { publishProductNotification } = require('../utils/sns');
const { validateProduct } = require('../utils/validator');

/**
 * Handler para criar um novo produto
 * POST /items
 */
exports.handler = async (event) => {
  console.log('📝 Criando novo produto');

  try {
    // Parse do body
    const data = JSON.parse(event.body || '{}');

    // Validação dos dados
    const validation = validateProduct(data, false);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Dados inválidos',
          errors: validation.errors
        })
      };
    }

    // Cria o produto com UUID e timestamps
    const now = new Date().toISOString();
    const product = {
      id: uuidv4(),
      name: data.name,
      description: data.description || '',
      price: data.price,
      quantity: data.quantity,
      createdAt: now,
      updatedAt: now
    };

    // Salva no DynamoDB
    await putProduct(product);

    // Publica notificação SNS
    try {
      await publishProductNotification('created', product);
    } catch (snsError) {
      console.error('⚠️ Erro ao publicar notificação SNS:', snsError);
      // Não falha a requisição se o SNS falhar
    }

    console.log('✅ Produto criado com sucesso:', product.id);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Produto criado com sucesso',
        product
      })
    };
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Erro interno ao criar produto',
        error: error.message
      })
    };
  }
};

