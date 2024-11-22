const signOutlogoButton = document.getElementById("signOutlogoButton");
const addContentButton = document.getElementById("addcontentbtn")
const contentContainer = document.getElementById("content_container")


addContentButton.addEventListener('click', (e) => {
    window.location.href = "/addcontent"
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
    try {
        const res = await fetch("/api/is_admin", {
            verbose: true,
            redirect: 'follow',
            method: "GET",
        });

        const { isAdmin } = await res.json()

        if (isAdmin) {
            addContentButton.style.display="block"
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
        const res = await fetch("/api/get_content", {
            verbose: true,
            redirect: 'follow',
            method: "GET",
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



function renderContent(content) {
    for (const media of content) {
        const {id, img_id, content_name, content_type} = media;
        if (!id || !img_id || !content_name || !content_type) {
            throw new Error("Not all content info received")
        }
        if (!contentContainer) {
            throw new Error("No content container")
        }

        let contentType = "Game"
        if (content_type===1) {
            contentType = "Movie"
        }

        const element = document.createElement('div');
        element.innerHTML =  `
        <div id="moviecard 1" class="moviecard 1">
            <div class="content-type" >${contentType}</div>
            <img class="movie-card-image" src="/web/content_img/${img_id}" ></img>
            <div class="movie-card-text">${content_name} ${contentType}</div>
        </div>
        `

    

        contentContainer.appendChild(element)


    } 
}