import 'dotenv/config';
import { S3 } from 'aws-sdk';
import { ReadStream } from 'node:fs';

const s3 = new S3({});
const s3BucketName = process.env.S3_BUCKET;
const s3FileName = process.env.S3_KEY;

export function getParams() {
  if (!s3BucketName || !s3FileName) {
    throw new Error(
      'S3_BUCKET and S3_KEY must be set in environment variables'
    );
  }
  return {
    Bucket: s3BucketName,
    Key: s3FileName,
  };
}

export async function getFileBuffer(): Promise<Buffer> {
  try {
    const data = await s3.getObject(getParams()).promise();
    return data.Body as Buffer;
  } catch (error) {
    console.error('Error fetching file from S3:', error);
    throw error;
  }
}

export function getFileStream(): ReadStream {
  return s3.getObject(getParams()).createReadStream() as unknown as ReadStream;
}

export function getClient(): S3 {
  return s3;
}
