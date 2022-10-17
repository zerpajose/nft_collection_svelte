<script>
  import { onMount } from 'svelte'
  import { startPresale, presaleMint, publicMint, getProviderOrSigner } from '../lib/functions'

  import { loading, isOwner, presaleStarted, presaleEnded } from '../stores/store'

  let isOwnerValue, loadingValue, presaleStartedValue, presaleEndedValue

  loading.subscribe((value) => loadingValue = value)
  isOwner.subscribe((value) => isOwnerValue = value)
  presaleStarted.subscribe((value) => presaleStartedValue = value)
  presaleEnded.subscribe((value) => presaleEndedValue = value)

  const startPresaleButton = async () => {
    try {
      const hash = await startPresale()
      console.log(`Start Presale: ${hash}`);

    } catch (err) {
      console.error(err)
    }
  }

  const presaleMintButton = async () => {
    try {
      const hash = await presaleMint()
      console.log(`Presale Mint: ${hash}`);

    } catch (err) {
      console.error(err)
    }
  }

  const publicMintButton = async () => {
    try {
      const hash = await publicMint()
      console.log(`Public Mint: ${hash}`);

    } catch (err) {
      console.error(err)
    }
  }
</script>

{#if loadingValue}
  <button class="button">Loading...</button>
{:else if isOwnerValue}
  <div class="description">You are the owner!</div>
{:else if isOwnerValue && !presaleStartedValue}
  <button class="button" on:click={startPresaleButton}>Start Presale!</button>
{:else if !presaleStartedValue}
  <div class="description">Presale hasnt started!</div>
{:else if presaleStartedValue && !presaleEndedValue}
  <div class="description">
    Presale has started!!! If your address is whitelisted, Mint a CryptoDev 🥳
  </div>
  <button class="button" on:click={presaleMintButton}>
    Presale Mint 🚀
  </button>
{:else if presaleStartedValue && presaleEndedValue}
  <button class="button" on:click={publicMintButton}>Public Mint 🚀</button>
{:else}
  <span>In construction</span>
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