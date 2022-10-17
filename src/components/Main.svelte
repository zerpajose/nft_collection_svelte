<script>
// @ts-nocheck

  import { onMount } from 'svelte'
  import { getProviderOrSigner } from '../lib/functions'

  import Button from './Button.svelte'
  import Logo from './Logo.svelte'

  import { tokenIdsMinted } from '../stores/store'

  let tokenIdsMintedValue, chainID

	tokenIdsMinted.subscribe((value) => {
		tokenIdsMintedValue = value;
	})

  const getChain = async () => {
    const signer = await getProviderOrSigner(true)
    const chainID = await signer.getChainId() 
    return chainID
  }

  onMount(async () => {
    chainID = await getChain()
	})

</script>

{#if chainID === 80001}
<main>
  <section>
    <h1 class="title">Welcome to Crypto Devs!</h1>
    <div class="description">It's a NFT collection for developers in Crypto.</div>
    
    <div class="description">
      {tokenIdsMintedValue}/20 have been minted
    </div>
    <Button />
  </section>
  <section>
    <Logo />
  </section>
</main>
{:else}
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
{/if}

<style>
main {
  min-height: 90vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: "Courier New", Courier, monospace;
}
.title {
  font-size: 2rem;
  margin: 2rem 0;
}

.description {
  line-height: 1;
  margin: 2rem 0;
  font-size: 1.2rem;
}
</style>