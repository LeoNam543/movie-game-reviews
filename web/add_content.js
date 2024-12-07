const signOutlogoButton = document.getElementById("signOutlogoButton");

const poster = document.getElementById("selectfile")
const Name = document.getElementById("contentName")
const Desc = document.getElementById("contentDescription")
const Type = document.getElementById("contentType")
const postButton = document.getElementById("createpostbutton")
const errorMessage = document.getElementById("errorMessage")

let fileArrayBufferPromise;
if(poster){
    poster.addEventListener('change', (e) => {
        fileArrayBufferPromise = readFileDataAsBase64(e);
    });    
}



postButton.addEventListener('click', (e) => post());
async function post() {
    const contentName = Name.value
    const contentDesc = Desc.value
    const contentType = Type.value
    const fileArrayBuffer = await fileArrayBufferPromise;

    if (!fileArrayBuffer || !contentName || !contentDesc || !contentType) {
        errorMessage.innerText = 'Fill out the form fully.'
        throw new Error("Fill out the form fully")
    }

    try {
        var fd = new FormData()
        fd.append('fields', JSON.stringify({ contentName, contentDesc, contentType }))
        fd.append('file', new Blob([fileArrayBuffer]))

        const res = await fetch("/api/addcontent", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
            contentType: undefined,
            body: fd,
        });

        if (!res.ok) {
            throw new Error();
        }
        
        if (res.redirected) {
            window.location.href = res.url;
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
}


signOutlogoButton.addEventListener('click', (e) => signOut());
async function signOut() {
    try {
        const res = await fetch("/api/logout", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
        });

        if (!res.ok) {
            throw new Error();
        }

        if (res.redirected) {
            window.location.href = res.url;
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
}

function readFileDataAsBase64(e) {
    const file = e.target.files[0];

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (err) => {
            reject(err);
        };

        reader.readAsArrayBuffer(file);
    });
}

async function loadContent() {
    try {
        const res = await fetch("/api/get_content", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
        });

        if (!res.ok) {
            throw new Error();
        }

        if (res.redirected) {
            window.location.href = res.url;
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
}