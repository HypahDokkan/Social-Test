var user = {}

async function signUp() {
    let user = {
        "username": document.getElementById("signup-username").value,
        "password": document.getElementById("signup-password").value,
        "name": document.getElementById("signup-name").value,
        "surname": document.getElementById("signup-surname").value
    };

    await fetch(`http://127.0.0.1:8000/register`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(user)
    })

    .then(fetch => { return fetch.json(); })

    .then(result => {
        console.log(result);
        if (result.success) {
            popUp("Sign up successful!");
        }
    })

    .catch(error => { console.log("error:", error); });
}

async function login() {
    let user = {
        "username": document.getElementById("login-username").value,
        "password": document.getElementById("login-password").value
    }

    await fetch(`http://127.0.0.1:8000/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(user)
    })

    .then(fetch => { return fetch.json(); })

    .then(result => {
        console.log(result);
        
        if (result) {
            document.getElementById("signup").reset();
            document.getElementById("login").reset();
            user = result;
            console.log(user);
            hideForms();
            document.getElementById("log-out").classList.value = "";
            popUp(`Welcome, ${user.username}!`);
            //loginSuccessful();
            //showPosts();
        }
        
        else { popUp("Error: account inexistent or user info incorrect."); }
    })

    .catch(error => { console.log("error:", error); });
}


function hideForms() { document.getElementById("both-boxes").classList.value = "hidden" }

function showForms() { document.getElementById("both-boxes").classList.value = "" }

function popUp(message) {
    // Checks if the action was successfull: if it was, it makes the div that shows its successfull visible alongside text in the p. After 5 seconds, it removes the text and makes the div hidden.
    document.getElementById("popup-p").innerText = message
    document.getElementById("popup").classList.value = "";
    setTimeout(() => {
        document.getElementById("popup").classList.value = "hidden";
        document.getElementById("popup-p").innerText = ""
    }, 5000)
}

function logOut() {
    user = {};
    console.log(user);
    document.getElementById("log-out").classList.value = "hidden";
    showForms();
    popUp("Goodbye!");
}