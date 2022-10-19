<script>
  import { onMount } from 'svelte'
  import { BigNumber } from 'ethers'
  import { getProviderOrSigner, withdrawCoins, claimCryptoDevTokens, mintCryptoDevToken } from '../lib/functions'

  import { loading, isOwner, tokensToBeClaimed, tokenAmount } from '../stores/store'
    import { formatBytes32String } from 'ethers/lib/utils';

  let isOwnerValue, loadingValue, tokensToBeClaimedValue, tokenAmountValue

  loading.subscribe((value) => loadingValue = value)
  isOwner.subscribe((value) => isOwnerValue = value)
  tokensToBeClaimed.subscribe((value) => tokensToBeClaimedValue = value)
  tokenAmount.subscribe((value) => tokenAmountValue = value)

  const withdrawCoinsButton = async () => {
    try {
      await withdrawCoins()
    } catch (err) {
      console.error(err)
    }
  }

  const claimCryptoDevTokensButton = async () => {
    try {
      await claimCryptoDevTokens()
    } catch (err) {
      console.error(err)
    }
  }

  const mintCryptoDevTokenButton = async (amount) => {
    try {
      await mintCryptoDevToken(amount)
    } catch (err) {
      console.error(err)
    }
  }

  const handleInput = (e) => {
    console.log(`e: ${e.target.value}`)
    
    tokenAmount.set(BigNumber.from(e.target.value))
  }
</script>

{#if loadingValue}
  <button class="button">Loading...</button>

{:else if isOwnerValue}
<button class="button" on:click={withdrawCoinsButton}>Start Presale!</button>

{:else if tokensToBeClaimedValue > 0}
  <div class="description">
    {tokensToBeClaimedValue * 10} Tokens can be claimed!
  </div>
  <button class="button" on:click={claimCryptoDevTokensButton}>
    Claim Tokens
  </button>

{:else}
  <div>
    <input type="number" placeholder="Amount of Tokens" class="input"
      on:change={handleInput}
    />
  </div>

  <button
    class="button"
    disabled={!(tokenAmountValue > 0)}
    on:click={() => mintCryptoDevTokenButton(tokenAmountValue)}
  >
    Mint Tokens
  </button>
{/if}


<style>
.button {
  border-radius: 4px;
  background-color: blue;
  border: none;
  color: #ffffff;
  font-size: 15px;
  padding: 20px;
  width: 200px;
  cursor: pointer;
  margin-bottom: 2%;
}
</style>