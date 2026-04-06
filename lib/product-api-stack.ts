import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export class ProductApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '040620261629';

    // DynamoDB Table
    const productsTable = new dynamodb.Table(this, `ProductsTable${suffix}`, {
      tableName: `ProductSpecifications${suffix}`,
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Add auto scaling
    productsTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    productsTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    // Global Secondary Indexes
    productsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5
    });

    productsTable.addGlobalSecondaryIndex({
      indexName: 'BrandIndex',
      partitionKey: { name: 'brand', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5
    });

    // Lambda Functions
    const getProductsFunction = new lambda.Function(this, `GetProductsFunction${suffix}`, {
      functionName: `getProducts${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda/getProducts'),
      environment: {
        TABLE_NAME: productsTable.tableName
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256
    });

    const getProductByIdFunction = new lambda.Function(this, `GetProductByIdFunction${suffix}`, {
      functionName: `getProductById${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda/getProductById'),
      environment: {
        TABLE_NAME: productsTable.tableName
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256
    });

    // Grant permissions
    productsTable.grantReadData(getProductsFunction);
    productsTable.grantReadData(getProductByIdFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, `ProductApi${suffix}`, {
      restApiName: `Product API ${suffix}`,
      description: 'API for accessing product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key']
      }
    });

    // API Resources and Methods
    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsFunction));

    const productById = products.addResource('{id}');
    productById.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdFunction));

    // Sample Data Population Lambda
    const populateDataFunction = new lambda.Function(this, `PopulateDataFunction${suffix}`, {
      functionName: `populateData${suffix}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda/populateData'),
      environment: {
        TABLE_NAME: productsTable.tableName
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 512
    });

    productsTable.grantWriteData(populateDataFunction);

    // Custom Resource to populate data
    new cr.AwsCustomResource(this, `PopulateDataCustomResource${suffix}`, {
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: populateDataFunction.functionName,
          Payload: JSON.stringify({ action: 'populate' })
        },
        physicalResourceId: cr.PhysicalResourceId.of(`populate-data-${Date.now()}`)
      },
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          resources: [populateDataFunction.functionArn]
        })
      ])
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: productsTable.tableName,
      description: 'DynamoDB Table Name'
    });
  }
}