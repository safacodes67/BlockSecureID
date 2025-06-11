
// AWS Configuration Service
interface AWSConfig {
  region: string;
  s3BucketName: string;
  sesFromEmail: string;
}

const awsConfig: AWSConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  s3BucketName: process.env.AWS_S3_BUCKET || 'blocksecure-documents',
  sesFromEmail: process.env.AWS_SES_FROM_EMAIL || 'noreply@blocksecure.com'
};

export default awsConfig;
