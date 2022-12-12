import crypto from 'crypto';

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