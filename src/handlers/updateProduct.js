const { getProduct, updateProduct } = require('../utils/dynamodb');
const { publishProductNotification } = require('../utils/sns');
const { validateProduct } = require('../utils/validator');

/**
 * Handler para atualizar um produto existente
 * PUT /items/{id}
 */
exports.handler = async (event) => {
  const productId = event.pathParameters?.id;
  console.log('✏️ Atualizando produto:', productId);

  if (!productId) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'ID do produto não fornecido'
      })
    };
  }

  try {
    // Verifica se o produto existe
    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      console.log('❌ Produto não encontrado:', productId);
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Produto não encontrado'
        })
      };
    }

    // Parse do body
    const data = JSON.parse(event.body || '{}');

    // Validação dos dados (modo update - campos opcionais)
    const validation = validateProduct(data, true);
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

    // Prepara os dados para atualização
    const updates = {
      updatedAt: new Date().toISOString()
    };

    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.price !== undefined) updates.price = data.price;
    if (data.quantity !== undefined) updates.quantity = data.quantity;

    // Atualiza no DynamoDB
    const updatedProduct = await updateProduct(productId, updates);

    // Publica notificação SNS
    try {
      await publishProductNotification('updated', updatedProduct);
    } catch (snsError) {
      console.error('⚠️ Erro ao publicar notificação SNS:', snsError);
      // Não falha a requisição se o SNS falhar
    }

    console.log('✅ Produto atualizado com sucesso:', productId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Produto atualizado com sucesso',
        product: updatedProduct
      })
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Erro interno ao atualizar produto',
        error: error.message
      })
    };
  }
};

