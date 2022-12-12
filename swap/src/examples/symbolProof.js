import { SymbolService } from '../services/symbol.js';
import sdk from '../../symbol/sdk/javascript/src/index.js';

const netWork = new sdk.symbol.Network(
    'testnet',
    0x98,
    new Date(Date.UTC(2022, 9, 31, 21, 7, 47)),
    new sdk.Hash256('49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4')
)
const symbolService = new SymbolService(netWork, "NODE_URL");

symbolService.secretProofTransaction(
    'PRIVATE_KEY',
    'RECEIVER_PLAIN_ADDRESS',
    'PROOF', // 0xf816755c282a446459154e661edddb2eba2de9fd5879f4f271039cd744c5d163
    'SECRET', // 0x44a4bba5f16a91281904d5fef33770a39747dec8cbadfb0619a58e65f57d5c24
).then(r=>console.log(r));