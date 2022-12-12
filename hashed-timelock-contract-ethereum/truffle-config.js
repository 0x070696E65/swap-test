const HDWalletProvider = require('@truffle/hdwallet-provider')
const privateKeys = ['09a30c3ffac631be9bf11495819fbaadf036f08a2cc90ae1fde061df2653126c']

module.exports = {
  networks: {
    development: {
      provider: () => new
      HDWalletProvider(privateKeys, `https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd`),
      network_id: 11155111,
    },
    polygonTestnet: {
      provider: () => new
      HDWalletProvider(privateKeys, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
    }
  }
}
