const errorMessage = document.getElementById("error_message");
const mainContent = document.getElementById("maincontent");
const deleteContent = document.getElementById("deleteContent")
const signOutlogoButton = document.getElementById("signOutlogoButton");
const editContentBTN = document.getElementById("editContent");
const editContentForm = document.getElementById("edit-content")
const selectFileAdmiinEdit = document.getElementById("selectfile-edit")
const reviewsContainer = document.getElementById("reviews-container")
const addReviewForm = document.getElementById("add-user-review")
const showReviewForm = document.getElementById("show-user-review")
const showReviewFormContainer = document.getElementById("show-user-review-container")
const deleteUserReviewBtn = document.getElementById("delete-user-review-btn")
const reviewTitle = document.getElementById("review-title")
const editreviewTitle = document.getElementById("edit-review-title")

const editUserReview = document.getElementById("submit-edit-review")
const cancelEditUserReview = document.getElementById("cancel-edit-review")

const editUserReviewForm = document.getElementById("edit-user-review")
const showEditUserReviewBtn = document.getElementById("edit-user-review-btn")
const userReviewValue = document.getElementById("edit-review")
const editReviewTitleInput = document.getElementById("edit-review-title")



// EDIT REVIEW
editUserReview.addEventListener('click', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    const timestamp = Date.now()
    const title = editreviewTitle.value;
    
    const review = userReviewValue.value;
    if (!contentId || !review || !editRating || !title ) {
        errorMessage.innerText = 'Not everything submited.'
        throw new Error('Not everything submited.')
    }
    try {
        const res = await fetch("/api/edit_user_review", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
            body: JSON.stringify({ contentId, review, editRating, title, timestamp })
        });

        if (!res.ok) {
            throw new Error();
        }
        location.reload();

    } catch (e) {
        errorMessage.innerText = 'Something went wrong here.'
    }
})

cancelEditUserReview.addEventListener('click', ()=>{
    editUserReviewForm.classList.add('hidden')
    addReviewForm.classList.add('hidden')
    showReviewFormContainer.classList.remove('hidden')
})

showEditUserReviewBtn.addEventListener('click', async () => {
    editUserReviewForm.classList.remove('hidden')
    addReviewForm.classList.add('hidden')
    showReviewFormContainer.classList.add('hidden')

    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    try {
        const res = await fetch("/api/get_specific_review", {
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

        userReviewValue.value = resJson.content.review
        editReviewTitleInput.value = resJson.content.title;
        editupdateRating(resJson.content.star_rating)

    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})


let stars =
    document.getElementsByClassName("star");
let edstars =
    document.getElementsByClassName("edstar");

let output =
    document.getElementById("rating-text");
let edoutput =
    document.getElementById("edit-rating-text");

let rating = 0;
let editRating = 0;

function editupdateRating(n) {
    // Max amount of stars.
    const maxN = 5;
    edremove(maxN);
    for (let i = 0; i < n; i++) {
        edstars[i].className = "edstar colored";
    }
    edoutput.innerText = "Rating: " + n + "/5";
    editRating = n
}

// To remove the pre-applied styling
function edremove(maxN) {
    for (let i = 0; i < maxN; i++) {
        edstars[i].className = "edstar";
    }
}

const reviewInput = document.getElementById("review")
const reviewSubmit = document.getElementById("submit-review")

reviewSubmit.addEventListener('click', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    const review = reviewInput.value;
    const title = reviewTitle.value;
    const timestamp = Date.now()

    if (!contentId || !review || !rating || !title) {
        errorMessage.innerText = 'Not everything submited.'
        throw new Error('Not everything submited.')
    }
    try {
        const res = await fetch("/api/add_review", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
            body: JSON.stringify({ contentId, review, rating, title, timestamp })
        });

        if (!res.ok) {
            throw new Error();
        }
        location.reload();

    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await showAllContentReviews()
        await showUserContentReview()

    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})



deleteUserReviewBtn.addEventListener('click', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    if (!contentId) {
        throw new Error()
    }

    const res = await fetch("/api/delete_user_review_for_content", {
        verbose: true,
        redirect: 'follow',
        method: "POST",
        body: JSON.stringify({ contentId })
    });

    if (!res.ok) {
        throw new Error();
    }
    location.reload();
})




async function showUserContentReview() {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    if (!contentId) {
        throw new Error()
    }

    const res = await fetch("/api/get_user_review_for_content", {
        verbose: true,
        redirect: 'follow',
        method: "POST",
        body: JSON.stringify({ contentId })
    });

    if (!res.ok) {
        throw new Error();
    }
    const { review } = await res.json()

    renderUserReviewSection(review);
}

function renderUserReviewSection(r) {
    if (!addReviewForm) {
        throw new Error('No add review form found.')
    }
    if (!showReviewFormContainer) {
        throw new Error('No show review form container found.')
    }
    if (!showReviewForm) {
        throw new Error('No show review form found.')
    }

    if (!r) {
        addReviewForm.classList.remove('hidden')
        showReviewFormContainer.classList.add('hidden')
        editUserReviewForm.classList.add('hidden')
        return;
    }
    addReviewForm.classList.add('hidden')
    showReviewFormContainer.classList.remove('hidden')
    editUserReviewForm.classList.add('hidden')
    const date = new Date(r.time).toLocaleString()

    showReviewForm.innerHTML = getReviewHtml(r.title, r.star_rating, r.review, r.nickname, date)
}

async function showAllContentReviews() {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    if (!contentId) {
        throw new Error()
    }

    const res = await fetch("/api/reviews_get", {
        verbose: true,
        redirect: 'follow',
        method: "POST",
        body: JSON.stringify({ contentId })
    });

    if (!res.ok) {
        throw new Error();
    }
    const reviews = await res.json()

    renderReviews(reviews)
}

function renderReviews(reviews) {
    if (!reviewsContainer) {
        throw new Error('No reviews contaner found')
    }

    if (!reviews.length) {
        reviewsContainer.innerHTML = '<div>No other reviews found.</div>'
        return;
    }

    let reviewsHtml = '';
    for (const r of reviews) {
        const date = new Date(r.time).toLocaleString()
        reviewsHtml += getReviewHtml(r.title, r.star_rating, r.review, r.nickname, date)
    }
    reviewsContainer.innerHTML = reviewsHtml;
}


// Funtion to update rating
function updateRating(n) {
    // Max amount of stars.
    const maxN = 5;
    remove(maxN);
    for (let i = 0; i < n; i++) {
        stars[i].className = "star colored";
    }
    output.innerText = "Rating: " + n + "/5";
    rating = n
}

// To remove the pre-applied styling
function remove(maxN) {
    for (let i = 0; i < maxN; i++) {
        stars[i].className = "star";
    }
}

let fileArrayBufferPromise;
if (selectFileAdmiinEdit) {
    selectFileAdmiinEdit.addEventListener('change', (e) => {
        fileArrayBufferPromise = readFileDataAsBase64(e);
    });
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
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch("/api/is_admin", {
            verbose: true,
            redirect: 'follow',
            method: "GET",
        });

        if (!res.ok) {
            throw new Error();
        }

        const { isAdmin } = await res.json()

        if (isAdmin) {
            editContentBTN.style.display = "block"
            deleteContent.style.display = "block"
        }
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})

deleteContent.addEventListener('click', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
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
        renderContent(resJson.content)

    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})

editContentBTN.addEventListener('click', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    window.location.href = `/editcontent/${contentId}`;
});


function renderContent(media) {
    const { content_name, content_description, content_type, img_id, average_rating } = media;
    if (!img_id || !content_name || !content_type || !content_description || average_rating == null) {
        throw new Error("Not all content info received")
    }
    if (!mainContent) {
        throw new Error("No content Wrapper")
    }

    let contentType = "Game"
    if (content_type === 1) {
        contentType = "Movie"
    }

    const element = document.createElement('div');
    element.classList.add('content-container')
    element.innerHTML = `
        <div class="content-page-wrapper" id="content-page-wrapper">
            <div class='img-container'>
                <img class="content-page-poster" src="/web/content_img/${img_id}"></img>
            </div>
            <div class="RHS">
                <div class="content-page-title">
                    <div class="content-page-name">${content_name} ${contentType}</div>
                    <div class="content-page-rating">★${average_rating}</div>
                </div>
                <div class="content-page-desc">${content_description}</div>
            </div>
            
        </div>
        
        `
    mainContent.appendChild(element)


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

function getReviewHtml(title, star_rating, review, nickname, date){
    return (`
    <div class='rows'>
        <div class="username-star-container">
            <div class='review-header'>
                <h1 class="title">${title}</h1>
                <h2 class="star_rating">${star_rating}/5</h2>
            </div>
        </div>
        <div class="review_text">${review}</div>
        <div class="review-footer">
            <div class="username">Author: ${nickname}</div>
            <div class="time">Date: ${date}</div>
        </div>
    </div>
    `)
}