const { getProduct, deleteProduct } = require('../utils/dynamodb');

/**
 * Handler para deletar um produto
 * DELETE /items/{id}
 */
exports.handler = async (event) => {
  const productId = event.pathParameters?.id;
  console.log('🗑️ Deletando produto:', productId);

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

    // Deleta o produto
    await deleteProduct(productId);

    console.log('✅ Produto deletado com sucesso:', productId);

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Erro interno ao deletar produto',
        error: error.message
      })
    };
  }
};

