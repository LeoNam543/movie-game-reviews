const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signin_btn = document.getElementById("signin_btn");
const errorMessage = document.getElementById("error-message");

if (!emailInput || !passwordInput || !signin_btn) {
    throw new Error("Element not found");
}

signin_btn.addEventListener("click", (e) => onSignin())

async function onSignin() {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        errorMessage.innerText = 'not all credentials entered.'
        throw new Error("not all credentials entered")
    }

    try{
        const response = await fetch("/api/signin", {
            redirect: 'follow',
            method: "POST",
            body: JSON.stringify({email, password}),
        });
        if (!response.ok){
            throw new Error()
        }
        if (response.redirected) {
            window.location.href = response.url;
        }
    }
    catch (error) {
        errorMessage.innerText = 'User not found.'
    }
}

