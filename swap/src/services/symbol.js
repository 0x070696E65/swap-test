import sdk from '../../symbol/sdk/javascript/src/index.js';
import fetch from 'node-fetch';
import { newSecretHashPair, calcCompositeHash } from './crypto.js';

export class SymbolService {
    facade;
    node;
    constructor(netWork, node) {
        this.facade = new sdk.facade.SymbolFacade(netWork);
        this.node = node;
    }
    secretLockTransaction = async (senderPrivateKey, recipientAddress, mosaicId, amount, duration) =>{
        const privateKey = new sdk.PrivateKey(senderPrivateKey);
        const keyPair = new sdk.symbol.KeyPair(privateKey);
        const hashPair = newSecretHashPair()
        const deadline = new sdk.symbol.NetworkTimestamp(this.facade.network.fromDatetime(Date.now())).addHours(2).timestamp;
        const secret = hashPair.hash.toUpperCase().replace('0X', '');
        const secretLockTransaction = this.facade.transactionFactory.create({
            type: 'secret_lock_transaction_v1',
            mosaic: { mosaicId, amount },
            signerPublicKey: keyPair.publicKey,
            duration,
            recipientAddress,
            secret,
            hashAlgorithm: 'hash_256',
            deadline
        });
        
        const compositeHash = sdk.utils.uint8ToHex(this.compositeHash(sdk.utils.hexToUint8(secret), new sdk.facade.SymbolFacade.Address(recipientAddress).bytes));
        secretLockTransaction.fee = new sdk.symbol.Amount(BigInt(secretLockTransaction.size * 100));
        const signature = this.facade.signTransaction(keyPair, secretLockTransaction);
        const jsonPayload = this.facade.transactionFactory.constructor.attachSignature(secretLockTransaction, signature);
        const res = await fetch(this.node + '/transactions', {
            method: 'put',
            body: jsonPayload  ,
            headers: {'Content-Type': 'application/json'}
        })
        return {
            message: await res.json(),
            hashPair,
            compositeHash
        }
    }

    secretProofTransaction = async (privateKeyHex, recipientAddress, proof, secret) =>{
        const privateKey = new sdk.PrivateKey(privateKeyHex);
        const keyPair = new sdk.symbol.KeyPair(privateKey);
        const deadline = new sdk.symbol.NetworkTimestamp(this.facade.network.fromDatetime(Date.now())).addHours(2).timestamp;
        const secretProofTransaction = this.facade.transactionFactory.create({
            type: 'secret_proof_transaction_v1',
            signerPublicKey: keyPair.publicKey,
            recipientAddress,
            secret: secret.replace('0x', ''),
            hashAlgorithm: 'hash_256',
            proof: (new sdk.ByteArray(32, proof.replace('0x', ''))).bytes,
            deadline
        });
        secretProofTransaction.fee = new sdk.symbol.Amount(BigInt(secretProofTransaction.size * 100));
        const signature = this.facade.signTransaction(keyPair, secretProofTransaction);
        const jsonPayload = this.facade.transactionFactory.constructor.attachSignature(secretProofTransaction, signature);
        const res = await fetch(this.node + '/transactions', {
            method: 'put',
            body: jsonPayload  ,
            headers: {'Content-Type': 'application/json'}
        })
        return {
            message: await res.json(),
            hashPair: {
                proof,
                secret
            }
        }
    }

    getLockTransaction = async (compositeHash) => {
        return await fetch(this.node + '/lock/secret/' + compositeHash, {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        })
    }

    compositeHash = (secret, address) => {
        return calcCompositeHash(secret, address)
    }
}
