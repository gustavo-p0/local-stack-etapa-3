const { getProduct } = require('../utils/dynamodb');

/**
 * Handler para buscar um produto por ID
 * GET /items/{id}
 */
exports.handler = async (event) => {
  const productId = event.pathParameters?.id;
  console.log('🔍 Buscando produto:', productId);

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
    const product = await getProduct(productId);

    if (!product) {
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

    console.log('✅ Produto encontrado:', productId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        product
      })
    };
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Erro interno ao buscar produto',
        error: error.message
      })
    };
  }
};

