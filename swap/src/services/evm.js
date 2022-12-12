import Web3 from 'web3';
import { newSecretHashPair } from './crypto.js';
import htlc from '../abi/HashedTimelock.json' assert { type: "json" };
import htlcErc20 from '../abi/HashedTimelockERC20.json' assert { type: "json" };
import htlcErc721 from '../abi/HashedTimelockERC721.json' assert { type: "json" };

const abi = {
    htlc,
    htlcErc20,
    htlcErc721,
}

export class EvmService {
    web3;
    provider;
    htlcContract;
    htlcERC20Contract;
    htlcERC721Contract;

    constructor(config){
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
        this.htlcContract = new this.web3.eth.Contract(abi.htlc.abi, config.htlcContractAddress);
        this.htlcERC20Contract = new this.web3.eth.Contract(abi.htlcErc20.abi, config.htlcErc20ContractAddress);
        this.htlcERC721Contract = new this.web3.eth.Contract(abi.htlcErc721.abi, config.htlcErc721ContractAddress);
    }

    contractInfo = (htlc, contractId) => {
        return htlc.methods.getContract(contractId).call()
    }

    newContract = (htlc, sender, receiver, amount, seconds, gas) => {
        const hashPair = newSecretHashPair();
        const oneFinney = this.web3.utils.toWei(this.web3.utils.toBN(amount), 'finney')
        return htlc.methods.newContract(
            receiver,
            hashPair.hash,
            this.nowSeconds() + seconds,
        )
        .send(
            {
                from: sender,
                value: oneFinney,
                gas: gas.toString()
            }
        )
        .then(function(receipt){
            return [receipt.events.LogHTLCNew.returnValues, hashPair];
        })
    }

    withDraw = (htlc, contractId, secret, receiver, gas)=> {
        return htlc.methods.withdraw(
            contractId,
            secret,
        )
        .send(
            {
                from: receiver,
                gas: gas.toString()
            }
        )
        .then(function(receipt){
            return receipt.events.LogHTLCWithdraw;
        })
    }
    nowSeconds = () => Math.floor(Date.now() / 1000)
}
