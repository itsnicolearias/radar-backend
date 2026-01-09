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

const getExtensionFromMimeType = (mimeType: string) => {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'audio/mpeg':
      return 'mp3';
    case 'audio/wav':
      return 'wav';
    case 'audio/ogg':
      return 'ogg';
    default:
      return '';
  }
};

export async function generateUploadUrl(fileType: string, userId: string, context: 'profile' | 'chat' = 'profile', chatId?: string) {
  try {
    const fileExtension = getExtensionFromMimeType(fileType);
    let key: string;

    if (context === 'profile') {
      key = `profiles/${userId}/${crypto.randomUUID()}.${fileExtension}`;
    } else if (context === 'chat') {
      if (!chatId) {
        throw new Error("Chat ID is required for chat uploads.");
      }
      key = `chats/${chatId}/${crypto.randomUUID()}.${fileExtension}`;
    } else {
      throw new Error("Invalid upload context.");
    }

    const command = new PutObjectCommand({
      Bucket: config.awsS3Bucket,
      Key: key,
      ContentType: fileType
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const fileUrl = `https://${config.awsS3Bucket}.s3.${config.awsRegion}.amazonaws.com/${key}`;

    return { signedUrl, fileUrl, key };
  } catch (error) {
    throw Boom.badRequest(error)
  }
  
}
