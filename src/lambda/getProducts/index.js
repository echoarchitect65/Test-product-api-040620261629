const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

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
    const { category, brand } = event.queryStringParameters || {};
    const tableName = process.env.TABLE_NAME;

    let command;
    let items;

    if (category) {
      command = new QueryCommand({
        TableName: tableName,
        IndexName: 'CategoryIndex',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category
        }
      });
    } else if (brand) {
      command = new QueryCommand({
        TableName: tableName,
        IndexName: 'BrandIndex',
        KeyConditionExpression: 'brand = :brand',
        ExpressionAttributeValues: {
          ':brand': brand
        }
      });
    } else {
      command = new ScanCommand({
        TableName: tableName
      });
    }

    const result = await docClient.send(command);
    items = result.Items || [];

    return createResponse(200, {
      success: true,
      data: items,
      metadata: {
        timestamp: new Date().toISOString(),
        count: items.length,
        total: items.length
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