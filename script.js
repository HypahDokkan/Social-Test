var user = {};
console.log(user);

showPosts();

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
    let userLogin = {
        "username": document.getElementById("login-username").value,
        "password": document.getElementById("login-password").value
    }

    await fetch(`http://127.0.0.1:8000/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userLogin)
    })

    .then(fetch => { return fetch.json(); })

    .then(result => {
        console.log(result);
        
        if (result) {
            document.getElementById("signup").reset();
            document.getElementById("login").reset();

            document.getElementById("create-post").classList.value = "forms";
            console.log(document.getElementById("create-post").classList.value)

            //localStorage.setItem("user", result);
            //user = localStorage.getItem("user");
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

async function createPost() {
    let post = {
        "text": document.getElementById("post-text").value,
        "username": user.username
    };
    console.log(post);

    await fetch(`http://127.0.0.1:8000/createPost`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(post)
    })

    .then(fetch => { return fetch.json(); })

    .then(result => {
        console.log(result);
        if (result) {
            document.getElementById("create-post").reset();
            popUp("Post successfully created.");
            showPosts();
        }
    })
}

async function showPosts() {
    await fetch(`http://127.0.0.1:8000/getAllPosts`, {
        method: "GET",
        headers: { "Content-type": "application/json" }
    })

    .then(fetch => { return fetch.json(); })

    .then(result => {
        document.getElementById("posts").innerHTML = "";
        result.forEach(post => {
            console.log(post);

            let postDiv = document.createElement("div");
            postDiv.classList.value = "post";

            let postTitle = document.createElement("h3");
            postTitle.innerText = post.postAuthor + " said:";
            postDiv.appendChild(postTitle);

            let postText = document.createElement("p");
            postText.innerText = post.postText;
            postDiv.appendChild(postText);

            document.getElementById("posts").appendChild(postDiv);
        });
    })

    .catch(error => { console.log("error:", error); });
}


function hideForms() { document.getElementById("signup").classList.value += " hidden"; document.getElementById("login").classList.value += " hidden"; }

function showForms() { document.getElementById("signup").classList.value = "forms"; document.getElementById("login").classList.value = "forms"; }

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
    document.getElementById("create-post").classList.value += " hidden";
    document.getElementById("log-out").classList.value = "hidden";
    showForms();
    popUp("Goodbye!");
}