import { Contract, utils, providers, BigNumber } from 'ethers/lib'
import Web3Modal from 'web3modal'

import { TOKEN_CONTRACT_ABI, TOKEN_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from './constants'

import { loading, isOwner, txHash, tokensToBeClaimed, balanceOfCryptoDevTokens, tokensMinted } from '../stores/store'
let tokensToBeClaimedValue, loadingValue, balanceOfCryptoDevTokensValue, isOwnerValue, tokensMintedValue, txHashValue

loading.subscribe((value) => loadingValue = value)
isOwner.subscribe((value) => isOwnerValue = value)
txHash.subscribe((value) => txHashValue = value)

tokensToBeClaimed.subscribe((value) => tokensToBeClaimedValue = value)
balanceOfCryptoDevTokens.subscribe((value) => balanceOfCryptoDevTokensValue = value)
tokensMinted.subscribe((value) => tokensMintedValue = value)


const zero = BigNumber.from(0);

/**
 * getTokensToBeClaimed: checks the balance of tokens that can be claimed by the user
 */
const getTokensToBeClaimed = async () => {
  try {
    const provider = await getProviderOrSigner()
    
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)
    
    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider)
    
    const signer = await getProviderOrSigner(true)
    
    const address = await signer.getAddress()
    
    const balance = await nftContract.balanceOf(address)
    
    if (balance === zero) {
      tokensToBeClaimed.set(zero)
    } else {
      var amount = 0

      for (var i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(address, i)
        const claimed = await tokenContract.tokenIdsClaimed(tokenId)
        if (!claimed) {
          amount++
        }
      }

      tokensToBeClaimed.set(BigNumber.from(amount))
    }
  } catch (err) {
    console.error(err)
    tokensToBeClaimed.set(zero)
  }
}

/**
 * getBalanceOfCryptoDevTokens: checks the balance of Crypto Dev Tokens's held by an address
 */
const getBalanceOfCryptoDevTokens = async () => {
  try {
    const provider = await getProviderOrSigner()

    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider)

    const signer = await getProviderOrSigner(true)

    const address = await signer.getAddress()

    const balance = await tokenContract.balanceOf(address)

    balanceOfCryptoDevTokens.set(balance)
  } catch (err) {
    console.error(err)
    balanceOfCryptoDevTokens.set(zero)
  }
}

/**
 * mintCryptoDevToken: mints `amount` number of tokens to a given address
 */
const mintCryptoDevToken = async (amount) => {
  try {
    const signer = await getProviderOrSigner(true)

    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer)
    const value = 0.001 * amount
    const tx = await tokenContract.mint(amount, {
      value: utils.parseEther(value.toString()),
    })

    loading.set(true)
    await tx.wait()
    loading.set(false)
    window.alert("Sucessfully minted Crypto Dev Tokens")

    await getBalanceOfCryptoDevTokens()
    await getTotalTokensMinted()
    await getTokensToBeClaimed()

    return tx.hash

  } catch (err) {
    console.error(err)
  }
}

/**
 * claimCryptoDevTokens: Helps the user claim Crypto Dev Tokens
 */
const claimCryptoDevTokens = async () => {
  try {

    const signer = await getProviderOrSigner(true)

    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer)
    const tx = await tokenContract.claim()

    loading.set(true)
    await tx.wait()
    loading.set(false)
    window.alert("Sucessfully claimed Crypto Dev Tokens")

    await getBalanceOfCryptoDevTokens()
    await getTotalTokensMinted()
    await getTokensToBeClaimed()

    return tx.hash

  } catch (err) {
    console.error(err)
  }
}

/**
 * getTotalTokensMinted: Retrieves how many tokens have been minted till now
 * out of the total supply
 */
const getTotalTokensMinted = async () => {
  try {
    const provider = await getProviderOrSigner()

    const tokenContract = new Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_CONTRACT_ABI,
      provider
    )

    const _tokensMinted = await tokenContract.totalSupply()
    tokensMinted.set(_tokensMinted)
  } catch (err) {
    console.error(err)
  }
}

/**
 * getOwner: calls the contract to retrieve the owner
 */
const getOwner = async () => {
  try {

    const provider = await getProviderOrSigner()

    const nftContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider)
    
    const _owner = await nftContract.owner()
    
    const signer = await getProviderOrSigner(true)
    
    const address = await signer.getAddress()

    if (address.toLowerCase() === _owner.toLowerCase()) {
      isOwner.set(true)
    }

  } catch (err) {
    console.error(err.message)
  }
}

/**
 * withdrawCoins: withdraws ether and tokens by calling
 * the withdraw function in the contract
 */
const withdrawCoins = async () => {
  try {
    const signer = await getProviderOrSigner(true)
    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer)

    const tx = await tokenContract.withdraw()
    loading.set(true)
    await tx.wait()
    loading.set(false)
    await getOwner()
  } catch (err) {
    console.error(err)
  }
}

const getProviderOrSigner = async (needSigner = false) => {
  const providerOptions = {
    injected: {
      display: {
        name: 'Injected',
        description: 'Connect with the provider in your Browser'
      },
      package: null
    }
  }
  
  const web3Modal = new Web3Modal({
    network: 'goerli',
    providerOptions  // required
  })
  
  const instance = await web3Modal.connect()
  
  const provider = new providers.Web3Provider(instance)

  if (needSigner) {
    const signer = provider.getSigner()
    return signer
  }
  
  return provider
}

export {
  getProviderOrSigner,
  getOwner,
  getBalanceOfCryptoDevTokens,
  mintCryptoDevToken,
  claimCryptoDevTokens,
  getTotalTokensMinted,
  withdrawCoins,
  getTokensToBeClaimed
}