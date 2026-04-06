#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductApiStack } from '../lib/product-api-stack';

const app = new cdk.App();

// Extract suffix from project folder name
const suffix = '040620261629';

new ProductApiStack(app, `ProductApiStack${suffix}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  }
});