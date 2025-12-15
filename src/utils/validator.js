/**
 * Valida os dados de um produto
 * @param {Object} data - Dados do produto
 * @param {boolean} isUpdate - Se é uma operação de atualização (campos opcionais)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateProduct(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    // Validações para CREATE (campos obrigatórios)
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Campo "name" é obrigatório e deve ser uma string não vazia');
    }

    if (data.price === undefined || data.price === null) {
      errors.push('Campo "price" é obrigatório');
    } else if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Campo "price" deve ser um número maior que 0');
    }

    if (data.quantity === undefined || data.quantity === null) {
      errors.push('Campo "quantity" é obrigatório');
    } else if (typeof data.quantity !== 'number' || data.quantity < 0) {
      errors.push('Campo "quantity" deve ser um número maior ou igual a 0');
    }
  } else {
    // Validações para UPDATE (campos opcionais mas com validação de tipo)
    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('Campo "name" deve ser uma string não vazia');
      }
    }

    if (data.price !== undefined) {
      if (typeof data.price !== 'number' || data.price <= 0) {
        errors.push('Campo "price" deve ser um número maior que 0');
      }
    }

    if (data.quantity !== undefined) {
      if (typeof data.quantity !== 'number' || data.quantity < 0) {
        errors.push('Campo "quantity" deve ser um número maior ou igual a 0');
      }
    }
  }

  // Validação opcional para description (se fornecido)
  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Campo "description" deve ser uma string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = { validateProduct };

