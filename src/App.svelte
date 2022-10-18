<script>

  import Content from './components/Content.svelte'
  import Modal from 'svelte-simple-modal'

  import Main from './components/Main.svelte'
  import Navbar from './components/Navbar.svelte'
  import TxModal from './components/TXModal.svelte'

  import { getProviderOrSigner } from './lib/functions'

  import { chainConnected } from './stores/store'

  import { checkIfPresaleStarted, checkIfPresaleEnded, getTokenIdsMinted } from './lib/functions'

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

      checkIfPresaleStarted().then(async (_presaleStarted)=>{
        if (_presaleStarted) {
          await checkIfPresaleEnded()
        }
      })

      getTokenIdsMinted()

      // Set an interval which gets called every 5 seconds to check presale has ended
      const presaleEndedInterval = setInterval(async function () {
        const _presaleStarted = await checkIfPresaleStarted()
        if (_presaleStarted) {
          const _presaleEnded = await checkIfPresaleEnded()
          if (_presaleEnded) {
            clearInterval(presaleEndedInterval)
          }
        }
      }, 5 * 1000)

      // set an interval to get the number of token Ids minted every 5 seconds
      setInterval(async function () {
        await getTokenIdsMinted()
      }, 5 * 1000)
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