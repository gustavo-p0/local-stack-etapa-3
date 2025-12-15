const AWS = require('aws-sdk');

// Configuração do SNS para LocalStack
const snsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// Se estiver rodando no LocalStack, usa endpoint local
if (process.env.AWS_ENDPOINT_URL) {
  snsConfig.endpoint = process.env.AWS_ENDPOINT_URL;
  snsConfig.accessKeyId = 'test';
  snsConfig.secretAccessKey = 'test';
}

const sns = new AWS.SNS(snsConfig);
const topicArn = process.env.SNS_TOPIC_ARN;

/**
 * Publica uma notificação sobre um produto no tópico SNS
 * @param {string} action - "created" ou "updated"
 * @param {Object} product - Objeto do produto
 */
async function publishProductNotification(action, product) {
  const message = {
    action,
    product,
    timestamp: new Date().toISOString()
  };

  const params = {
    TopicArn: topicArn,
    Message: JSON.stringify(message),
    Subject: `Product ${action}: ${product.name}`,
    MessageAttributes: {
      action: {
        DataType: 'String',
        StringValue: action
      },
      productId: {
        DataType: 'String',
        StringValue: product.id
      }
    }
  };

  console.log('📢 Publicando notificação SNS:', {
    action,
    productId: product.id,
    productName: product.name
  });

  return sns.publish(params).promise();
}

module.exports = {
  publishProductNotification
};

