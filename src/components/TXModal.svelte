<script>
  import { getContext } from 'svelte'
  import Popup from './Popup.svelte'
  import { txHash } from '../stores/store'

  const { open, close } = getContext('simple-modal')

  let txHashValue

  const closeModal = () => close()

  const showModalTxHash = () => open(
    Popup,
    {
      type: "txhash",
      message: txHashValue
    }
  )

  txHash.subscribe((value) => txHashValue = value)

  $: if(txHashValue){
    showModalTxHash()
  }
  else{
    closeModal()
  }

</script>