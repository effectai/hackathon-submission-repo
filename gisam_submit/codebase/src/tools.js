// const EthCrypto = require('eth-crypto');

// const encode = async (
//   message,
//   publickKey,
// ) => EthCrypto.cipher.stringify(
//   await EthCrypto.encryptWithPublicKey(
//     publickKey,
//     message,
//   ),
// );

// const decode = async (
//   message,
//   privatekey,
// ) => EthCrypto.decryptWithPrivateKey(
//   privatekey,
//   EthCrypto.cipher.parse(message),
// );

// const test = async () => {
//   const identity = EthCrypto.createIdentity();
//   console.log({ identity });
//   const enc = await encode('very secret message', identity.publicKey);
//   const dec = await decode(enc, identity.privateKey);
//   console.log({ enc }, { dec });
// };
// test();
