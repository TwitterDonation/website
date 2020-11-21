const generateDepositLink = async twitterId => {
    return new Promise((resolve, reject) => {
        const returnUrl = 'https://twittercash-68b84.web.app'
        const cancelUrl = 'https://twittercash-68b84.web.app'
        const corsAnywhere = 'https://cors-anywhere.herokuapp.com'
        const url = `${corsAnywhere}/https://us-central1-twittercash-68b84.cloudfunctions.net/webhook/paypal?currency=EUR&amount=1&return_url=${returnUrl}&cancel_url=${cancelUrl}&twitter_id=${twitterId}`
        $.get(url, (data, status) => {
            if (status == 'success') {
                resolve(data.link)
            } else {
                reject()
            }
        })
    })
}

const fetchDepositLink = twitterId => {
    generateDepositLink(twitterId).then(url => {
        const link = document.getElementById('link')
        link.setAttribute('href', url)
    }).catch(e => {
        link.innerHTML = 'Something happened... Try again later.'
    })
}

window.onload = () => {
    const auth = firebase.auth()
    const db = firebase.firestore()

    const btn = document.getElementById('login')
    btn.onclick = () => {
        const provider = new firebase.auth.TwitterAuthProvider()
        firebase.auth().signInWithPopup(provider).catch(error => {
            console.log(errorMessage)
        })
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            const twitterId = user.providerData[0].uid
            const displayName = user.providerData[0].displayName
            const text = document.getElementById('hello')
            text.innerHTML = `Hello ${displayName}!`
            fetchDepositLink(twitterId)
        }
    })
}
