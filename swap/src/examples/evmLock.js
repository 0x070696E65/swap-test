import { EvmService } from '../services/evm.js';
import { ethTestnet } from '../services/config.js';
import { polygonTestnet } from '../services/config.js';

const evmService = new EvmService(ethTestnet);

const PRIVATE_KEY1 = 'PRIVATE_KEY1'
const PRIVATE_KEY2 = 'PRIVATE_KEY2'

evmService.web3.eth.accounts.wallet.add(PRIVATE_KEY1)
evmService.web3.eth.accounts.wallet.add(PRIVATE_KEY2)
const account1 = evmService.web3.eth.accounts.wallet[0].address
const account2 = evmService.web3.eth.accounts.wallet[1].address

evmService.newContract(evmService.htlcContract,account1, account2, 1, 3600, 1000000)
.then(r=>console.log(r))

/*
evmService.contractInfo(evmService.htlcContract, 'CONTRACT_ID')
.then(r=>console.log(r))
*/