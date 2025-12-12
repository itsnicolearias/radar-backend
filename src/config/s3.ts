import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Boom from "@hapi/boom";
import { config } from "./config";

const s3 = new S3Client({
  region: config.awsRegion!,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

export async function generateUploadUrl(fileName: string, fileType: string) {
  try {
    const command = new PutObjectCommand({
    Bucket: config.awsS3Bucket,
    Key: fileName,
    ContentType: fileType
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const fileUrl = `https://${config.awsS3Bucket}.s3.${config.awsRegion}.amazonaws.com/${fileName}`;

   return {signedUrl, fileUrl};
  } catch (error) {
    throw Boom.badRequest(error)
  }
  
}
