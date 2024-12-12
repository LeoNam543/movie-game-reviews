const errorMessage = document.getElementById("error_message");
const mainContent = document.getElementById("maincontent");
const deleteContent = document.getElementById("deleteContent")
const signOutlogoButton = document.getElementById("signOutlogoButton");
const editContentBTN = document.getElementById("editContent");
const editContentForm = document.getElementById("edit-content")

const submitAdminEdit = document.getElementById("submit-edit")
const contentTypeAdminEdit = document.getElementById("contentType-edit")
const contentDescAdminEdit = document.getElementById("contentDescription-edit")
const contentNameAdminEdit = document.getElementById("contentName-edit")
const selectFileAdmiinEdit = document.getElementById("selectfile-edit")


let fileArrayBufferPromise;
if (selectFileAdmiinEdit) {
    selectFileAdmiinEdit.addEventListener('change', (e) => {
        fileArrayBufferPromise = readFileDataAsBase64(e);
    });
}

submitAdminEdit.addEventListener('click', async (e) => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    contentType = contentTypeAdminEdit.value
    contentDesc = contentDescAdminEdit.value
    contentName = contentNameAdminEdit.value
    const fileArrayBuffer = await fileArrayBufferPromise;

    if (!contentName || !contentDesc || !contentType) {
        errorMessage.innerText = 'Fill out the form fully.'
        throw new Error("Fill out the form fully")
    }

    try {
        var fd = new FormData()
        fd.append('fields', JSON.stringify({ contentName, contentDesc, contentType, contentId }))
        if(fileArrayBuffer){
            fd.append('file', new Blob([fileArrayBuffer]))
        }

        const res = await fetch("/api/editcontent", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
            body: fd
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
});

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

document.addEventListener('DOMContentLoaded', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    try {
        const res = await fetch("/api/get_specific_content", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
            body: contentId
        });

        if (!res.ok) {
            throw new Error();
        }
        const resJson = await res.json()
        console.log(resJson)

        contentDescAdminEdit.value = resJson.content.content_description
        contentNameAdminEdit.value = resJson.content.content_name
        contentTypeAdminEdit.value = resJson.content.content_type

    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})


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
