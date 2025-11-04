import { encryptMessage, decryptMessage } from '../utils/crypto';
import { config } from '../config/config';

describe('Crypto Utility', () => {
  const originalEncryptionKey = config.encryptionKey;

  beforeAll(() => {
    config.encryptionKey = 'test_encryption_key';
  });

  afterAll(() => {
    config.encryptionKey = originalEncryptionKey;
  });

  it('should encrypt and decrypt a message successfully', () => {
    const plaintext = 'This is a secret message';
    const { ciphertext, iv, authTag } = encryptMessage(plaintext);

    expect(ciphertext).not.toBe(plaintext);
    expect(iv).toBeDefined();
    expect(authTag).toBeDefined();

    const decrypted = decryptMessage(ciphertext, iv, authTag);
    expect(decrypted).toBe(plaintext);
  });
});
