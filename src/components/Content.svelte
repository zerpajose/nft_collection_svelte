<script>
  import { getContext } from 'svelte';
  import Popup from './Popup.svelte';
  import { chainConnected } from '../stores/store'

  const { open, close } = getContext('simple-modal')
  const showModal = () => open(
    Popup,
    {
      message: 'Please connect your wallet to Mumbai Network (Polygon Testnet)'
    }
  )
  const closeModal = () => close()
  let chainConnectedValue

  chainConnected.subscribe((value) => {
    chainConnectedValue = value
  })
  
  $: if(chainConnectedValue !== '0x13881' || chainConnectedValue === ''){
    showModal()
  }
  else {
    closeModal()
  }

</script>