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
  if ('Notification' in navigator && Notification.permission != 'accordé') {
    console.log('Demander l\'autorisation de l\'utilisateur')
    Notification.requestPermission(status => { 
      console.log('Status:'+status)
      displayNotification(' Notification activée')
     })
     }
     
     const displayNotification = notificationTitle => {
      console.log('display notification')
      if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration()
        .then(reg => { 
          console.log(reg)
          const options = { 
            body : 'Merci d\'avoir autorisé la notification push !',
            icône : '/android-icon-512x512.png',
            vibreur : [100, 50, 100],
            données : { 
              dateOfArrival : Date.now(),
              primaryKey : 0
            }
          }
          reg.showNotification(notificationTitle, options )
        })
      }
    } 