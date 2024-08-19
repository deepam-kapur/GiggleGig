import crypto from 'crypto';

import config from '../config';

const algorithm = 'aes-256-cbc';

const { CRYPT_KEYS } = config;

const CRYPTIONS = CRYPT_KEYS.split(':').map((keys) => ({
  version: keys.split('_')[0],
  key: keys.split('_')[1],
}));

const DECRYPTIONS = CRYPT_KEYS.split(':').reduce(
  (data, keys) => ({
    ...data,
    [keys.split('_')[0]]: keys.split('_')[1],
  }),
  {},
);

// Encrypt function
const encrypt = (text: string): { encrypted: string; version: string } => {
  const crypt = CRYPTIONS[Math.floor(Math.random() * CRYPTIONS.length)];

  const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(crypt.key, 'hex'),
    iv,
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    encrypted: `${iv.toString('hex')}:${encrypted.toString('hex')}`,
    version: crypt.version,
  };
};

// Decrypt function
const decrypt = (encryptedText: string, version: string): string => {
  if (!DECRYPTIONS[version]) {
    throw new Error('Version not present! There is an issue.');
  }

  const [ivHex, encryptedHex] = encryptedText.split(':');
  const ivBuffer = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(DECRYPTIONS[version], 'hex'),
    ivBuffer,
  );
  let decrypted = decipher.update(encryptedBuffer);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

export default {
  encrypt,
  decrypt,
};
