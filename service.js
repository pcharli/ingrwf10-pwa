const version = 1.02

self.addEventListener('install', event => {
    console.log("Log from event 'INSTALL' in SW version " + version)
    return self.skipWaiting()
})

self.addEventListener('activate', event => {
    console.log("Log from event 'ACTIVATE' in SW version " + version)
    return self.clients.claim()
})


/* 
//simple fetch général for install btn 
//on écoute chaque requête
self.addEventListener('fetch', event => {
    const requestUrl = new URL(
        event.request.url
    )
})
*/

// définition d'un cache pour les assets
const ASSETS_CACHE_NAME = "assets"
const API_CACHE_NAME = "api"

// 2 méthodes : getter et setter pour le cache

const getResponseFromCache = (
    cacheName,
    request
) => {
    // On ouvre le bon cache
    return caches.open(cacheName)
    // on récupère le cache
    .then( cache => {
        // on retourne le fichier qui correspond à la requête
        return cache.match(request)
    })
}

const setResponseCache = (
    cacheName,
    request,
    response
) => {
    // on ouvre le bon cache
    return caches.open(cacheName)
    .then(cache => {
        return cache.put(request, response)
    })
}

//Stratégies de cache

//Méthode de statégie cacheFirst
const getResponseFromCacheFirst = (
    cacheName,
    request
) => {
    //on exécute le getter en premier
    const response = getResponseFromCache(
        cacheName, request
    )
    .then( response  => {
        // est-ce que la réponse à request existe dans le cache
        if( response ) {
            // on retourne la réponse à la stratégie
            return response
        }
        else { //le fichier correspondant à request n'est pas dans le cache
            return fetch(request)
            .then( response => {
                setResponseCache(
                    cacheName,
                    request,
                    response.clone()
                )
                //on envoie la réponse à la stratégie
                return response
            })
        }
    })
    //renvoie au fetch
    return response
}

//Méthode de statégie netWork first
const getResponseFromNetworkFirst = (
    cacheName,
    request
) => {
    // test si connexion
    return fetch(request)
    .then( response => {
        console.log(response)
        if(response) {
            console.log('internet')
        //exécution du setter
        setResponseCache(
            cacheName,
            request,
            response.clone()
        )
        //on envoie la réponse à la stratégie
        return response
        } else {
            console.log('offline')
            //pas IntersectionObserverEntry, donc on lance le getter
            const responseCache = getResponseFromCache(
                cacheName, request
            )
            .then(responseCache => {
                //si en cache
                if(responseCache) {
                    return responseCache
                } else//sinon, c'est mort
                {
                    return 'error'
                }
            })
        }
    })
    .catch(error => console.log(error))
    
    //return response
}

//end stratégies

/******** REQUESTS  */

//si request, on l'intercepte
self.addEventListener("fetch", event => {
    //on récupère l'url de la request exécutée par le navigateur
    const requestUrl = new URL(
        event.request.url
    )
    //console.log(requestUrl.pathname)

    //on va appliquer la stratégie CacheFirst si le path commence par '/assets'
    if(requestUrl.pathname.startsWith('/assets') || requestUrl.pathname.includes('.css')  || requestUrl.pathname.includes('.js')  || requestUrl.pathname.includes('.html') || requestUrl.pathname.includes('.png')) {
        // renvoi au navigateur
        event.respondWith(
            getResponseFromCacheFirst(ASSETS_CACHE_NAME, event.request)
        )
    }

    //On va appliquer statégie NetworkFirts si path commence par 'https://'
    if(requestUrl.pathname.startsWith('/stations/')) {
        console.log('appel de api')
        // renvoi au navigateur
        event.respondWith(
            getResponseFromNetworkFirst(API_CACHE_NAME, event.request)
        )
    }
    
})
