if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service.js')
      .then((reg) => {
        console.log('notify', 'Service worker is started @ scope ' + reg.scope)
      })
      .catch( (error) => {
        console.log('alert', 'Service worker registration failed with ' + error)
      })
    })
  }

  // affichage du bouton d'installation
  const installBtn = document.querySelector('.install')
  let deferredPrompt

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault()
    deferredPrompt = event
    installBtn.classList.remove('hidden')
  })

  installBtn.addEventListener('click', event => {
    event.preventDefault()
     installBtn.classList.add('hidden')
    deferredPrompt.prompt()
   
    deferredPrompt.userChoice.then(choice => {
      if(choice === 'accepted') {
        console.log("Installation acceptée")
        
      }
      else {
        console.log("Installation refusée")
      }
      deferredPrompt = null
    })
  })


  // notifications

     
    