# Product API Project

A serverless AWS solution for accessing product specifications through REST API endpoints. Built with AWS CDK, API Gateway, Lambda, and DynamoDB.

## Architecture

- **API Gateway**: REST API with CORS support
- **Lambda Functions**: Node.js 22.x runtime for business logic
- **DynamoDB**: NoSQL database with flexible schema support
- **CDK**: Infrastructure as Code deployment

## API Endpoints

### Base URL
```
https://90a0vosqd1.execute-api.us-east-1.amazonaws.com/prod/
```

### GET /products
Retrieve all products with optional filtering.

**Query Parameters:**
- `category` - Filter by product category
- `brand` - Filter by product brand

**Example Requests:**
```bash
# Get all products
curl "https://90a0vosqd1.execute-api.us-east-1.amazonaws.com/prod/products"

# Filter by category
curl "https://90a0vosqd1.execute-api.us-east-1.amazonaws.com/prod/products?category=Electronics"

# Filter by brand
curl "https://90a0vosqd1.execute-api.us-east-1.amazonaws.com/prod/products?brand=Apple"
```

### GET /products/{id}
Retrieve a specific product by ID.

**Example Request:**
```bash
curl "https://90a0vosqd1.execute-api.us-east-1.amazonaws.com/prod/products/PHONE001"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "product_id": "PHONE001",
    "name": "iPhone 15 Pro",
    "category": "Electronics",
    "brand": "Apple",
    "specifications": {
      "price": 999,
      "weight": "187g",
      "color": "Natural Titanium",
      "storage": "128GB"
    },
    "created_at": "2026-04-06T11:07:36.919Z",
    "updated_at": "2026-04-06T11:07:36.921Z"
  },
  "metadata": {
    "timestamp": "2026-04-06T11:08:02.727Z",
    "count": 1,
    "total": 1
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 'xyz' not found"
  },
  "metadata": {
    "timestamp": "2026-04-06T11:08:16.508Z"
  }
}
```

## Sample Data

The system includes 10 sample products across multiple categories:

### Electronics (5 products)
- iPhone 15 Pro (Apple)
- MacBook Pro 14-inch (Apple)
- AirPods Pro (Apple)
- Smartwatch Series 9 (Samsung)
- Galaxy Tab S9 (Samsung)

### Clothing (3 products)
- Classic Cotton T-Shirt (Nike)
- Air Max 270 (Nike)
- Waterproof Hiking Jacket (Patagonia)

### Home & Garden (2 products)
- Ergonomic Office Chair (Herman Miller)
- Espresso Machine (Breville)

## Deployment

### Prerequisites
- AWS CLI configured
- Node.js 18+ installed
- CDK CLI installed globally

### Deploy
```bash
# Set environment variables
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export CDK_DEFAULT_REGION=$(aws configure get region || echo "us-east-1")

# Deploy the stack
cdk deploy --require-approval never
```

### Clean Up
```bash
cdk destroy
```

## AWS Resources Created

- DynamoDB Table: `ProductSpecifications040620261629`
- Lambda Functions:
  - `getProducts040620261629`
  - `getProductById040620261629`
  - `populateData040620261629`
- API Gateway: `Product API 040620261629`
- IAM Roles and Policies for Lambda execution
- CloudWatch Log Groups for monitoring

## Performance Features

- DynamoDB auto-scaling enabled
- Global Secondary Indexes for efficient filtering
- Lambda connection pooling
- API Gateway CORS configuration
- Structured error handling and logging

## Testing

All endpoints have been tested and validated:
- ✅ GET /products returns all 10 sample products
- ✅ GET /products/{id} returns specific product details
- ✅ Category filtering works correctly
- ✅ Brand filtering works correctly
- ✅ 404 error handling for non-existent products
- ✅ Proper JSON response format with metadata
- ✅ CORS headers configured for browser access