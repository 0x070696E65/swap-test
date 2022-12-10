const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const abi = require('./abi/HashedTimelock.json').abi;
const crypto = require('crypto')

const bufToStr = b => '0x' + b.toString('hex')
const sha256 = x =>
  crypto
    .createHash('sha256')
    .update(x)
    .digest()
const random32 = () => crypto.randomBytes(32)


// randomSecretからHASH256()でハッシュ作成
const newSecretHashPair = () => {
  const secret = random32()
  const hash = sha256(sha256(secret))
  return {
    // Symbolで言うところのProof
    secret: bufToStr(secret),
    // Symbolで言うところのSecret、名前ややこしいから変えてもいい
    hash: bufToStr(hash),
  }
}
const nowSeconds = () => Math.floor(Date.now() / 1000)
const hourSeconds = 3600
const timeLock1Hour = nowSeconds() + hourSeconds

// migrateした時のコントラクトアドレスを使う
const contractAddress = "0xE086044a301DdE9910154cd8Bf733c97E9E51E43";
const htlc = new web3.eth.Contract(abi, contractAddress);

// ロックコントラクトの情報取得（Ganacheからでも分かる）
const contractInfo = (contractId) => {
    return htlc.methods.getContract(contractId).call()
}

// 新しいロックコントラクトの作成（Symbolで言うシークレットロック）
const newContract = (sender, receiver, amount) => {
    const hashPair = newSecretHashPair()
    const oneFinney = web3.utils.toWei(web3.utils.toBN(amount), 'finney')
    htlc.methods.newContract(
        receiver,
        hashPair.hash,
        timeLock1Hour,
    )
    .send(
        {
            from: sender,
            value: oneFinney,
            gas: '1000000'
        }
    )
    .on("receipt", function(receipt) {
        console.log(receipt.events.LogHTLCNew.returnValues);
    })
    .on("error", function(error) {
        console.error(error);
    });
    console.log(hashPair);
}

// Secretを使って引き出し（Symbolで言うシークレットプルーフ）
const withDraw = (contractId, secret, receiver)=> {
    htlc.methods.withdraw(
        contractId,
        secret,
    )
    .send(
        {
            from: receiver,
            gas: '1000000'
        }
    )
    .on("receipt", function(receipt) {
        console.log(receipt.events.LogHTLCWithdraw);
    })
    .on("error", function(error) {
        console.error(error);
    });
}
(async()=>{
    const accounts = await web3.eth.getAccounts();
    console.log('accounts: ', accounts);
    newContract(accounts[0], accounts[1], 1);
    //console.log(await contractInfo("0x18d80f36686d946f6357fbba0b77696048eeb12aae341058f76a6486c54b2873"));
    //withDraw("0x5d98283e5a6c31934023e0abf1dad74931e35dfec05ef7be564de5520552c217", "0x2bfeae1bc34e417566e875ea7ee15f7e6ef0065be01a66310605b57fefc92aed", accounts[1]);
})();