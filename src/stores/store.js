import { writable } from 'svelte/store'

export const loading = writable(false)
export const chainConnected = writable('')

export const presaleStarted = writable(false)
// presaleEnded keeps track of whether the presale ended
export const presaleEnded = writable(false)
// checks if the currently connected MetaMask wallet is the owner of the contract
export const isOwner = writable(false)
// tokenIdsMinted keeps track of the number of tokenIds that have been minted
export const tokenIdsMinted = writable("0")