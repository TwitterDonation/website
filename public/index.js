window.onload = () => {
    const auth = firebase.auth()
    const db = firebase.firestore()

    const div = document.getElementById('main')
    div.innerHTML = 'hello, world'

    auth.onAuthStateChanged(user => {
        console.log(user);
    })
}
