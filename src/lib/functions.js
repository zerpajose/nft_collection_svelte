import { Contract, utils, providers } from 'ethers'
import Web3Modal from 'web3modal'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants'

import { loading, presaleStarted, presaleEnded, isOwner, tokenIdsMinted } from '../stores/store'
let presaleStartedValue, loadingValue, presaleEndedValue, isOwnerValue, tokenIdsMintedValue

loading.subscribe((value) => loadingValue = value)
presaleStarted.subscribe((value) => presaleStartedValue = value)
presaleEnded.subscribe((value) => presaleEndedValue = value)
isOwner.subscribe((value) => isOwnerValue = value)
tokenIdsMinted.subscribe((value) => tokenIdsMintedValue = value)

/**
 * Mint an NFT during the presale
 */
const presaleMint = async () => {
  try {
    const signer = await getProviderOrSigner(true)

    const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    const tx = await nftContract.presaleMint({ value: utils.parseEther("0.01") })

    loading.set(true)
    await tx.wait()
    loading.set(false)

    window.alert("You successfully minted a Crypto Dev!")

    return tx.hash

  } catch (err) {
    console.error(err)
  }
}

/**
 * Mint an NFT after the presale
 */
const publicMint = async () => {
  try {
    const signer = await getProviderOrSigner(true)

    const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    const tx = await nftContract.mint({ value: utils.parseEther("0.01") })
    loading.set(true)
    await tx.wait()
    loading.set(false)

    window.alert("You successfully minted a Crypto Dev!")

    return tx.hash

  } catch (err) {
    console.error(err)
  }
}

/*
 * starts the presale for the NFT Collection
 */
 const startPresale = async () => {
  try {
    const signer = await getProviderOrSigner(true)

    const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    
    const tx = await nftContract.startPresale()

    loading.set(true)
    await tx.wait()
    loading.set(false)
    
    await checkIfPresaleStarted()

    return tx.hash

  } catch (err) {
    console.error(err)
  }
}

/*
 * checks if the presale has started by quering the `presaleStarted` variable in the contract
 */
const checkIfPresaleStarted = async () => {
  try {
    const provider = await getProviderOrSigner()

    const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    
    const _presaleStarted = await nftContract.presaleStarted()

    if (!_presaleStarted) {
      await getOwner()
    }

    presaleStarted.set(_presaleStarted)

    return _presaleStarted

  } catch (err) {
    console.error(err)
    return false
  }
}

/**
* checks if the presale has ended by quering the `presaleEnded` variable in the contract
*/
const checkIfPresaleEnded = async () => {
  try {
    const provider = await getProviderOrSigner()

    const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    
    const _presaleEnded = await nftContract.presaleEnded()
    
    const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000))

    if (hasEnded) {
      presaleEnded.set(true)
    } else {
      presaleEnded.set(false)
    }

    return hasEnded

  } catch (err) {
    console.error(err)
    return false
  }
}

/**
 * calls the contract to retrieve the owner
 */
const getOwner = async () => {
  try {

    const provider = await getProviderOrSigner()

    const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    
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
 * gets the number of tokenIds that have been minted
 */
const getTokenIdsMinted = async () => {
  try {
    const provider = await getProviderOrSigner()

    const nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
    
    const _tokenIds = await nftContract.tokenIds()
    
    tokenIdsMinted.set(_tokenIds.toString())
  } catch (err) {
    console.error(err)
  }
};

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

export { presaleMint, publicMint, startPresale, checkIfPresaleStarted, checkIfPresaleEnded, getTokenIdsMinted, getProviderOrSigner }