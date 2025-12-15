/**
 * Handler Lambda que recebe notificações SNS sobre produtos
 * Loga as informações e simula envio de email
 */
exports.handler = async (event) => {
  console.log('📬 Subscriber recebeu notificação SNS');

  try {
    // Processa cada registro SNS (pode haver múltiplas mensagens)
    for (const record of event.Records) {
      if (record.Sns) {
        const snsMessage = record.Sns;
        const messageData = JSON.parse(snsMessage.Message);

        console.log('='.repeat(60));
        console.log('📢 NOTIFICAÇÃO SNS RECEBIDA');
        console.log('='.repeat(60));
        console.log('Timestamp:', snsMessage.Timestamp);
        console.log('Subject:', snsMessage.Subject);
        console.log('MessageId:', snsMessage.MessageId);
        console.log('');
        console.log('Ação:', messageData.action);
        console.log('Timestamp do evento:', messageData.timestamp);
        console.log('');
        console.log('PRODUTO:');
        console.log('  ID:', messageData.product.id);
        console.log('  Nome:', messageData.product.name);
        console.log('  Descrição:', messageData.product.description || '(sem descrição)');
        console.log('  Preço: R$', messageData.product.price.toFixed(2));
        console.log('  Quantidade:', messageData.product.quantity);
        console.log('  Criado em:', messageData.product.createdAt);
        console.log('  Atualizado em:', messageData.product.updatedAt);
        console.log('='.repeat(60));

        // Simula envio de email
        simulateEmailNotification(messageData);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Notificação processada com sucesso'
      })
    };
  } catch (error) {
    console.error('❌ Erro ao processar notificação SNS:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erro ao processar notificação',
        error: error.message
      })
    };
  }
};

/**
 * Simula o envio de um email de notificação
 */
function simulateEmailNotification(messageData) {
  const { action, product } = messageData;
  
  console.log('');
  console.log('📧 SIMULAÇÃO DE ENVIO DE EMAIL');
  console.log('-'.repeat(60));
  console.log('De: noreply@products-crud-service.com');
  console.log('Para: admin@products-crud-service.com');
  
  if (action === 'created') {
    console.log('Assunto: Novo Produto Cadastrado - ' + product.name);
    console.log('');
    console.log('Corpo do Email:');
    console.log(`Olá,

Um novo produto foi cadastrado no sistema:

Nome: ${product.name}
Descrição: ${product.description || 'N/A'}
Preço: R$ ${product.price.toFixed(2)}
Quantidade em estoque: ${product.quantity}
ID: ${product.id}

Data/Hora: ${product.createdAt}

Atenciosamente,
Sistema de Gerenciamento de Produtos`);
  } else if (action === 'updated') {
    console.log('Assunto: Produto Atualizado - ' + product.name);
    console.log('');
    console.log('Corpo do Email:');
    console.log(`Olá,

O produto ${product.name} foi atualizado:

Nome: ${product.name}
Descrição: ${product.description || 'N/A'}
Preço: R$ ${product.price.toFixed(2)}
Quantidade em estoque: ${product.quantity}
ID: ${product.id}

Última atualização: ${product.updatedAt}

Atenciosamente,
Sistema de Gerenciamento de Produtos`);
  }
  
  console.log('-'.repeat(60));
  console.log('✅ Email simulado enviado com sucesso!');
  console.log('');
}

