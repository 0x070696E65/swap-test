import { SymbolService } from '../services/symbol.js';
import sdk from '../../symbol/sdk/javascript/src/index.js';

const netWork = new sdk.symbol.Network(
    'testnet',
    0x98,
    new Date(Date.UTC(2022, 9, 31, 21, 7, 47)),
    new sdk.Hash256('49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4')
)
const symbolService = new SymbolService(netWork, "NODE_URL");

symbolService.secretLockTransaction(
    'PRIVATE_KEY',
    'RECIPIENT_ADDRESS',
    0x72C0212E67A08BCEn, // mosaicId
    1n, // amount
    5760n // duration
).then(r=>console.log(r));

(async()=>{
    symbolService.getLockTransaction('COMPOSITE_HASH')
    .then(async(r)=>console.log(await r.json()));
})()