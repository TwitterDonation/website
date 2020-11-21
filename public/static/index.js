const generateDepositLink = async (twitterId, currency, amount) => {
    return new Promise((resolve, reject) => {
        const returnUrl = 'https://twittercash-68b84.web.app'
        const cancelUrl = 'https://twittercash-68b84.web.app'
        const corsAnywhere = 'https://cors-anywhere.herokuapp.com/'
        const url = `${corsAnywhere}https://us-central1-twittercash-68b84.cloudfunctions.net/webhook/paypal?currency=${currency}&amount=${amount}&return_url=${returnUrl}&cancel_url=${cancelUrl}&twitter_id=${twitterId}`
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

    const twitterLogin = document.getElementById('login')
    twitterLogin.onclick = () => {
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

            twitterLogin.style.visibility = 'hidden'
            text.innerHTML = `Hello ${displayName}!`
            depositDiv.style.visibility = 'visible'

            deposit.onclick = () => {
                const amount = parseInt(document.getElementById('amount').value)
                const currency = document.getElementById('currency').selectedOptions[0].value
                generateDepositLink(twitterId, currency, amount).then(url => {
                    window.open(url, '_blank')
                }).catch(e => {
                    text.innerHTML = 'Something happened... Try again later.'
                })
            }
        }
    })
}
