const errorMessage = document.getElementById("error_message");
const mainContent = document.getElementById("maincontent");
const deleteContent = document.getElementById("deleteContent")

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
