<script>

  import Content from './components/Content.svelte'
  import Modal from 'svelte-simple-modal'

  import Main from './components/Main.svelte'
  import Navbar from './components/Navbar.svelte'
  import TxModal from './components/TXModal.svelte'

  import { getProviderOrSigner } from './lib/functions'

  import { chainConnected } from './stores/store'

  import { getTotalTokensMinted, getBalanceOfCryptoDevTokens, getTokensToBeClaimed, withdrawCoins } from './lib/functions'

  let chainConnectedValue

  chainConnected.subscribe((value) => {
    chainConnectedValue = value
  })

  const getSigner = async() => {
    const signer = await getProviderOrSigner()
    return signer
  }
  let providerOrSigner = getSigner()

  const handleLoad = () => {

    if(window.ethereum.isConnected()){
      
      window.ethereum.request({ method: 'eth_chainId' }).then(
        (chainId) => {
          chainConnected.set(chainId)
        }
      )
      
      window.ethereum.on('chainChanged', (chainId) => {
        chainConnected.set(chainId)
        window.location.reload()
      })

      window.ethereum.on('accountsChanged', ()=>{
        window.location.reload()
      })

      getTotalTokensMinted()
      getBalanceOfCryptoDevTokens()
      getTokensToBeClaimed()
      withdrawCoins()
    }
  }

</script>

<svelte:window on:load={handleLoad}/>

<div>
  {#await providerOrSigner}
    <p>...connecting</p>
  {:then addr}
    <Navbar address={addr['provider']['selectedAddress']} />
    <Main />
  {/await}
</div>
<Modal closeButton={false} closeOnEsc={false} closeOnOuterClick={false}>
  <Content />
</Modal>
<Modal>
  <TxModal />
</Modal>