const errorMessage = document.getElementById("error_message");
const mainContent = document.getElementById("maincontent");
const deleteContent = document.getElementById("deleteContent")
const signOutlogoButton = document.getElementById("signOutlogoButton");
const editContentBTN = document.getElementById("editContent");
const editContentForm = document.getElementById("edit-content")

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
    try {
        const res = await fetch("/api/is_admin", {
            verbose: true,
            redirect: 'follow',
            method: "GET",
        });

        const { isAdmin } = await res.json()

        if (isAdmin) {
            editContentBTN.style.display="block"
        }


        if (!res.ok) {
            throw new Error();
        }

        if (res.redirected) {
            window.location.href = res.url;
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch("/api/is_admin", {
            verbose: true,
            redirect: 'follow',
            method: "GET",
        });

        const { isAdmin } = await res.json()

        if (isAdmin) {
            deleteContent.style.display="block"
        }


        if (!res.ok) {
            throw new Error();
        }

        if (res.redirected) {
            window.location.href = res.url;
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})

deleteContent.addEventListener('click', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length-1]
    try {
        const res = await fetch("/api/delete-content", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
            body: contentId
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
    


document.addEventListener("DOMContentLoaded", async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length-1]
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
        renderContent(resJson.content)

    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})

editContentBTN.addEventListener('click', async () => {
    try {
        const res = await fetch("/edit/content", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
        });

        if (!res.ok) {
            throw new Error();
        }
        editContentForm.style.display="flex"
        document.getElementById("content-page-wrapper").style.display="none";
        deleteContent.style.display="none";
        editContentBTN.style.display="none";
        
        if (res.redirected) {
            window.location.href = res.url;
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
});


function renderContent(media) {
        const {content_name, content_description, content_type, img_id} = media;
        if (!img_id || !content_name || !content_type || !content_description) {
            throw new Error("Not all content info received")
        }
        if (!mainContent) {
            throw new Error("No content Wrapper")
        }

        let contentType = "Game"
        if (content_type===1) {
            contentType = "Movie"
        }

        const element = document.createElement('div');
        element.innerHTML =  `
        <div class="content-page-wrapper" id="content-page-wrapper">
            <img class="content-page-poster" src="/web/content_img/${img_id}"></img>
            <div class="RHS">
                <div class="content-page-title">
                    <div class="content-page-name">${content_name} ${contentType}</div>
                    <div class="content-page-rating"></div>
                </div>
                <div class="content-page-desc">${content_description}</div>
            </div>
            
        </div>
        
        `
        mainContent.appendChild(element)


    } 
