import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config/environment.js';
import crypto from 'crypto';
import path from 'path';
import { APIError } from '../utils/api-error.js';

let s3Client;

if (config.aws.accessKeyId && config.aws.secretAccessKey) {
  s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey
    }
  });
}

/**
 * Uploads a file buffer to S3
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} originalName - Original file name
 * @param {string} mimeType - File mime type
 * @returns {Promise<{ key: string, url: string }>}
 */
export const uploadFile = async (fileBuffer, originalName, mimeType) => {
  if (!s3Client) {
    throw new APIError('AWS S3 configuration is missing', 500);
  }

  const extension = path.extname(originalName) || '';
  const fileKey = `media/${crypto.randomUUID()}${extension}`;

  const command = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  try {
    await s3Client.send(command);
    
    // Construct the public URL (assuming public-read access or a CDN)
    const url = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${fileKey}`;
    
    return { key: fileKey, url };
  } catch (error) {
    throw new APIError(`Failed to upload file to S3: ${error.message}`, 500);
  }
};

/**
 * Deletes a file from S3
 * @param {string} fileKey - The S3 object key
 */
export const deleteFile = async (fileKey) => {
  if (!s3Client) {
    throw new APIError('AWS S3 configuration is missing', 500);
  }

  const command = new DeleteObjectCommand({
    Bucket: config.aws.bucket,
    Key: fileKey,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    throw new APIError(`Failed to delete file from S3: ${error.message}`, 500);
  }
};

export default {
  uploadFile,
  deleteFile
};
