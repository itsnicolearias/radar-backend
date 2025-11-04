import crypto from 'crypto';
import { config } from '../config/config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

const key = crypto
  .createHash('sha256')
  .update(config.encryptionKey)
  .digest('base64')
  .slice(0, 32);

export function encryptMessage(plaintext: string): {
  ciphertext: string;
  iv: string;
  authTag: string;
} {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]).toString('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return { ciphertext, iv: iv.toString('hex'), authTag };
}

export function decryptMessage(
  ciphertext: string,
  iv: string,
  authTag: string,
): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, 'hex'),
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  const decrypted =
    decipher.update(ciphertext, 'hex', 'utf8') + decipher.final('utf8');

  return decrypted;
}


const algorithm = "aes-256-cbc"
const key2 = Buffer.from(config.encryptionKey || "", "hex") // debe tener 32 bytes
if (key.length !== 32) {
  throw new Error("MESSAGE_ENCRYPTION_KEY must be a 32-byte hex string")
}

export const encryptText = (text: string) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key2, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return `${iv.toString("hex")}:${encrypted}`
}

export const decryptText = (encryptedText: string) => {
  const [ivHex, content] = encryptedText.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv(algorithm, key2, iv)
  let decrypted = decipher.update(content, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}
