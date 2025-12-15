const { scanProducts } = require('../utils/dynamodb');

/**
 * Handler para listar todos os produtos
 * GET /items
 */
exports.handler = async (event) => {
  console.log('📋 Listando todos os produtos');

  try {
    const products = await scanProducts();

    console.log(`✅ ${products.length} produto(s) encontrado(s)`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        count: products.length,
        products
      })
    };
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Erro interno ao listar produtos',
        error: error.message
      })
    };
  }
};

