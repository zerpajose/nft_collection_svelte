<script>
  export let message = 'Hi'
  export let type
</script>

{#if type === 'txhash'}
  <p>🚀 You successfully minted a CryptoDev 🚀</p>
  <p>🌐 <a href="https://mumbai.polygonscan.com/tx/{message}" target=”_blank”>See transaction on Polygonscan</a> 🌐</p>
{:else}
  <p>{message}</p>
{/if}
