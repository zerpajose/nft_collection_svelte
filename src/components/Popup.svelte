<script>
  export let message = 'Hi'
  export let type
</script>

{#if type === 'txhash'}
  <p>π You successfully minted a CryptoDev π</p>
  <p>π <a href="https://mumbai.polygonscan.com/tx/{message}" target=β_blankβ>See transaction on Polygonscan</a> π</p>
{:else}
  <p>{message}</p>
{/if}
