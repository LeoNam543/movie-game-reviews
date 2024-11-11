
const nicknameInput = document.getElementById('nickname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const errorMessage = document.getElementById('error-message');

if (!nicknameInput || !emailInput || !passwordInput || !registerBtn) {
    throw new Error("Element not found");
}

registerBtn.addEventListener('click', (e) => onRegister());

async function onRegister() {
    const nickname = nicknameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!nickname || !email || !password) {
        throw new Error("not all credentials entered")
    }

    try {
        console.log('calling fetch')
        //TODO Figure out how to redirect after successful registration!!!
        const response = await fetch("/api/register", {
            redirect: 'follow',
            method: "POST",
            body: JSON.stringify({ nickname, email, password }),
        });

        if (!response.ok) {
            throw new Error();
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
}