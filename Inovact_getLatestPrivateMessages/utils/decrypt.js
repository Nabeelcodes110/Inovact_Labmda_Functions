const {
  KmsKeyringNode,
  buildClient,
  CommitmentPolicy,
} = require('@aws-crypto/client-node');

const { decrypt } = buildClient(
  CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
);

async function KMSDecrypter(data) {
  const generatorKeyId = process.env.KMS_GENERATOR_KEY_ID;

  const keyIds = [process.env.KMS_KEY_ID];

  const keyring = new KmsKeyringNode({ generatorKeyId, keyIds });

  const context = {
    stage: 'demo',
    purpose: 'simple demonstration app',
    origin: 'ap-south-1',
  };

  const { plaintext, messageHeader } = await decrypt(keyring, data);

  const { encryptionContext } = messageHeader;

  Object.entries(context).forEach(([key, value]) => {
    if (encryptionContext[key] !== value)
      throw new Error('Encryption Context does not match expected values');
  });

  return plaintext;
}

module.exports = {
  KMSDecrypter,
};
