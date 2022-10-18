<script>
  import { getContext } from 'svelte'
  import Popup from './Popup.svelte'
  import { chainConnected } from '../stores/store'

  const { open, close } = getContext('simple-modal')

  let chainConnectedValue

  const showModalConnect = () => open(
    Popup,
    {
      type: "connect",
      message: 'Please connect your wallet to Mumbai Network (Polygon Testnet)'
    }
  )

  const closeModal = () => close()

  chainConnected.subscribe((value) => chainConnectedValue = value)
  
  $: if(chainConnectedValue !== '0x13881' || chainConnectedValue === ''){
    showModalConnect()
  }
  else {
    closeModal()
  }

</script>