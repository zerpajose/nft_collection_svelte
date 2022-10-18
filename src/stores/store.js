import { BigNumber } from 'ethers/lib'
import { writable } from 'svelte/store'

const zero = BigNumber.from(0);

export const loading = writable(false)
export const chainConnected = writable('')

export const tokensToBeClaimed = writable(zero)
export const balanceOfCryptoDevTokens = writable(zero)
export const tokenAmount = writable(zero)
export const tokensMinted = writable(zero)

export const isOwner = writable(false)

export const txHash = writable('')