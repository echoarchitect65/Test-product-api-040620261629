const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const sampleProducts = [
  {
    product_id: 'PHONE001',
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    brand: 'Apple',
    specifications: {
      price: 999,
      weight: '187g',
      dimensions: { length: '146.6mm', width: '70.6mm', depth: '8.25mm' },
      color: 'Natural Titanium',
      storage: '128GB',
      display: '6.1-inch Super Retina XDR',
      warranty: '1 year'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'LAPTOP001',
    name: 'MacBook Pro 14-inch',
    category: 'Electronics',
    brand: 'Apple',
    specifications: {
      price: 1999,
      weight: '1.6kg',
      dimensions: { length: '312.6mm', width: '221.2mm', depth: '15.5mm' },
      color: 'Space Gray',
      processor: 'M3 Pro',
      memory: '18GB',
      storage: '512GB SSD',
      warranty: '1 year'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'HEADPHONE001',
    name: 'AirPods Pro',
    category: 'Electronics',
    brand: 'Apple',
    specifications: {
      price: 249,
      weight: '5.4g each',
      color: 'White',
      battery_life: '6 hours',
      noise_cancellation: true,
      wireless: true,
      warranty: '1 year'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'SHIRT001',
    name: 'Classic Cotton T-Shirt',
    category: 'Clothing',
    brand: 'Nike',
    specifications: {
      price: 29.99,
      material: '100% Cotton',
      color: 'Navy Blue',
      sizes: ['S', 'M', 'L', 'XL'],
      care_instructions: 'Machine wash cold',
      warranty: '30 days'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'SHOES001',
    name: 'Air Max 270',
    category: 'Clothing',
    brand: 'Nike',
    specifications: {
      price: 150,
      material: 'Mesh and synthetic',
      color: 'Black/White',
      sizes: ['7', '8', '9', '10', '11', '12'],
      type: 'Running shoes',
      warranty: '2 years'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'WATCH001',
    name: 'Smartwatch Series 9',
    category: 'Electronics',
    brand: 'Samsung',
    specifications: {
      price: 399,
      weight: '38.7g',
      dimensions: { diameter: '44mm', thickness: '10.5mm' },
      color: 'Midnight',
      battery_life: '18 hours',
      water_resistance: '50m',
      warranty: '1 year'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'CHAIR001',
    name: 'Ergonomic Office Chair',
    category: 'Home & Garden',
    brand: 'Herman Miller',
    specifications: {
      price: 695,
      weight: '18kg',
      dimensions: { height: '965-1041mm', width: '686mm', depth: '686mm' },
      color: 'Graphite',
      material: 'Mesh and aluminum',
      adjustable: true,
      warranty: '12 years'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'COFFEE001',
    name: 'Espresso Machine',
    category: 'Home & Garden',
    brand: 'Breville',
    specifications: {
      price: 599,
      weight: '12.7kg',
      dimensions: { height: '406mm', width: '330mm', depth: '381mm' },
      color: 'Stainless Steel',
      capacity: '2L water tank',
      pressure: '15 bar',
      warranty: '2 years'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'TABLET001',
    name: 'Galaxy Tab S9',
    category: 'Electronics',
    brand: 'Samsung',
    specifications: {
      price: 799,
      weight: '498g',
      dimensions: { length: '254.3mm', width: '165.8mm', depth: '5.9mm' },
      color: 'Graphite',
      display: '11-inch Dynamic AMOLED 2X',
      storage: '128GB',
      warranty: '1 year'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    product_id: 'JACKET001',
    name: 'Waterproof Hiking Jacket',
    category: 'Clothing',
    brand: 'Patagonia',
    specifications: {
      price: 249,
      material: 'H2No Performance Standard shell',
      color: 'Forest Green',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      waterproof: true,
      breathable: true,
      warranty: 'Lifetime'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

exports.handler = async (event) => {
  try {
    console.log('Starting sample data population...');
    
    const tableName = process.env.TABLE_NAME;
    
    for (const product of sampleProducts) {
      const command = new PutCommand({
        TableName: tableName,
        Item: product
      });
      
      await docClient.send(command);
      console.log(`Inserted product: ${product.product_id}`);
    }
    
    console.log('Sample data population completed successfully');
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Sample data populated successfully',
        count: sampleProducts.length
      })
    };
    
  } catch (error) {
    console.error('Error populating sample data:', error);
    throw error;
  }
};