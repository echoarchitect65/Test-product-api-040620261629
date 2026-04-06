const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  try {
    const productId = event.pathParameters?.id;
    
    if (!productId) {
      return createResponse(400, {
        success: false,
        error: {
          code: 'MISSING_PRODUCT_ID',
          message: 'Product ID is required'
        },
        metadata: {
          timestamp: new Date().toISOString()
        }
      });
    }

    const command = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        product_id: productId
      }
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID '${productId}' not found`
        },
        metadata: {
          timestamp: new Date().toISOString()
        }
      });
    }

    return createResponse(200, {
      success: true,
      data: result.Item,
      metadata: {
        timestamp: new Date().toISOString(),
        count: 1,
        total: 1
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      },
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  }
};