import crypto from 'crypto';
import { sha3_256 } from '../../symbol/sdk/javascript/node_modules/@noble/hashes/sha3.js';

export const calcCompositeHash = (secret, address) => {
    return sha3_256
        .create()
        .update(secret)
        .update(address)
        .digest();
}

function bufToStr(b) {
    return '0x' + b.toString('hex')
};
function sha256(x){
    return crypto
        .createHash('sha256')
        .update(x)
        .digest()
};
function random32() {
    return crypto.randomBytes(32)
};
export const newSecretHashPair = () => {
    const secret = random32()
    const hash =sha256(sha256(secret))
    return {
        secret: bufToStr(secret),
        hash: bufToStr(hash),
    }
}
