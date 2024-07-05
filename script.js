var user = JSON.parse(localStorage.getItem("user"));
if (user != null) {
    document.getElementById("login-username").value = user.username;
    document.getElementById("login-password").value = user.password;
    login();
}

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
        if (result) { popUp("Sign up successful!"); }
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
        if (result) {
            document.getElementById("signup").reset();
            document.getElementById("login").reset();

            document.getElementById("user-data").classList.value = "forms";
            document.getElementById("create-post").classList.value = "forms";

            user = result;
            localStorage.setItem("user", JSON.stringify(userLogin));

            document.getElementById("user-username").value = user.username;
            document.getElementById("user-password").value = "********";
            document.getElementById("user-name").value = user.name;
            document.getElementById("user-surname").value = user.surname;

            hideForms();
            document.getElementById("log-out").classList.value = "";
            popUp(`Welcome, ${user.username}!`);
            
            document.getElementById("post-titles").classList.value = "";
            document.getElementById("posts").classList.value = "";

            showPosts();
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

function enableEditing() {
    document.getElementById("user-password").classList.value = "margin-bottom";
    document.getElementById("user-name").classList.value = "margin-bottom";
    document.getElementById("user-surname").classList.value = "margin-bottom";

    document.getElementById("user-password").disabled = false;
    document.getElementById("user-name").disabled = false;
    document.getElementById("user-surname").disabled = false;

    document.getElementById("label-username").innerText = "Username (Can't be changed):";
    
    document.getElementById("user-password").value = "";

    document.getElementById("user-submit").value = "SUBMIT";

    document.getElementById("user-data").setAttribute("onsubmit", "modifyUser(); return(false);");
}

function disableEditing() {
    document.getElementById("user-password").classList.value += " bg-gray";
    document.getElementById("user-name").classList.value += " bg-gray";
    document.getElementById("user-surname").classList.value += " bg-gray";

    document.getElementById("user-password").disabled = true;
    document.getElementById("user-name").disabled = true;
    document.getElementById("user-surname").disabled = true;

    document.getElementById("label-username").innerText = "Username:";

    document.getElementById("user-password").value = "********";

    document.getElementById("user-submit").value = "CHANGE DATA";

    document.getElementById("user-data").setAttribute("onsubmit", "enableEditing(); return(false);");
}

async function modifyUser() {
    user = {
        "username": document.getElementById("user-username").value,
        "password": document.getElementById("user-password").value,
        "name": document.getElementById("user-name").value,
        "surname": document.getElementById("user-surname").value
    }

    await fetch(`http://127.0.0.1:8000/modifyUser`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(user)
    })

    .then(fetch => { return fetch.json(); })

    .then(result => {
        localStorage.setItem("user", JSON.stringify(user));
        if (result) {
            disableEditing();
            popUp("Data changed successfully.");
        }
    })
}


async function showPosts() {
    await fetch(`http://127.0.0.1:8000/getAllPosts`, {
        method: "GET",
        headers: { "Content-type": "application/json" }
    })

    .then(fetch => { return fetch.json(); })

    // For each post in the database, creates a div with the users name that created the post and the text, then appends it to the posts container
    .then(result => {
        document.getElementById("posts").innerHTML = "";
        result.forEach(post => {

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

// A pop up appears on the top of the screen for 5 seconds. The message in the pop up is sent through the message string parameter
function popUp(message) {
    document.getElementById("popup-p").innerText = message;
    document.getElementById("popup").classList.value = "";
    setTimeout(() => {
        document.getElementById("popup").classList.value = "hidden";
        document.getElementById("popup-p").innerText = "";
    }, 5000);
}

function logOut() {
    user = {};
    localStorage.removeItem("user");
    document.getElementById("user-data").reset();
    document.getElementById("user-data").classList.value += " hidden";
    document.getElementById("create-post").reset();
    document.getElementById("create-post").classList.value += " hidden";
    document.getElementById("log-out").classList.value = "hidden";

    document.getElementById("post-titles").classList.value = "hidden";
    document.getElementById("posts").classList.value = "hidden";

    showForms();
    popUp("Goodbye!");
}