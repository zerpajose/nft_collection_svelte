<script>
  export let address
</script>

<nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">

    <a class="navbar-brand" href="www.example.org">
      <img src="/src/assets/crypto-devs.svg" alt="Bootstrap" width="30" height="24">
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
      <h4 class="badge bg-secondary">
        <span class="badge bg-light text-dark">collaborator</span> {address.slice(0, 5)}...{address.slice(-4)}
      </h4>
    </div>
  </div>
</nav>