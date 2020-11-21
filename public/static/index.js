const generateDepositLink = async twitterId => {
    return new Promise((resolve, reject) => {
        const returnUrl = 'https://twittercash-68b84.web.app'
        const cancelUrl = 'https://twittercash-68b84.web.app'
        const corsAnywhere = 'https://cors-anywhere.herokuapp.com/'
        const url = `${corsAnywhere}https://us-central1-twittercash-68b84.cloudfunctions.net/webhook/paypal?currency=EUR&amount=1&return_url=${returnUrl}&cancel_url=${cancelUrl}&twitter_id=${twitterId}`
        $.get(url, (data, status) => {
            if (status == 'success') {
                resolve(data.link)
            } else {
                reject(status)
            }
        })
    })
}

window.onload = () => {
    const auth = firebase.auth()
    const db = firebase.firestore()

    const btn = document.getElementById('login')
    btn.onclick = () => {
        const provider = new firebase.auth.TwitterAuthProvider()
        firebase.auth().signInWithPopup(provider)
            .catch(error => {
                console.log(error)
            })
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            const twitterId = user.providerData[0].uid
            const displayName = user.providerData[0].displayName
            const paypal = document.getElementById('deposit')
            const depositDiv = document.getElementById('deposit-div')
            const text = document.getElementById('hello')

            text.innerHTML = `Hello ${displayName}!`

            generateDepositLink(twitterId).then(url => {
                deposit.onclick = () => {
                    window.open(url, '_blank')
                }
                depositDiv.removeAttribute('hidden')
            }).catch(e => {
                text.innerHTML = 'Something happened... Try again later.'
                depositDiv.removeAttribute('hidden')
            })
        }
    })
}
