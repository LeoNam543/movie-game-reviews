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

let stars =
    document.getElementsByClassName("star");
let output =
    document.getElementById("rating-text");
let rating = 0;

const reviewInput = document.getElementById("review")
const reviewSubmit = document.getElementById("submit-review")

reviewSubmit.addEventListener('click', async () => {
    const parts = window.location.pathname.split('/')
    const contentId = parts[parts.length - 1]
    const review = reviewInput.value;
    if (!contentId || !review || !rating) {
        errorMessage.innerText = 'Not everything submited.'
        throw new Error('Not everything submited.')
    }
    try {
        const res = await fetch("/api/add_review", {
            verbose: true,
            redirect: 'follow',
            method: "POST",
            body: JSON.stringify({ contentId, review, rating })
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
        wireUpDeleteUserReviewBtn()

    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
})

function wireUpDeleteUserReviewBtn() {
    if (!deleteUserReviewBtn) {
        throw Error('No delete user reivew btn found.')
    }

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
}

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
        return;
    }
    addReviewForm.classList.add('hidden')
    showReviewFormContainer.classList.remove('hidden')

    showReviewForm.innerHTML = `
      <div>
          <div class="username">${r.nickname}</div>
          <div class="star_rating">${r.star_rating}</div>
      </div>
      <div class="review_text">${r.review}</div>
  `
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
        reviewsHtml += `
          <div class="review">
            <div>
                <div class="username">${r.nickname}</div>
                <div class="star_rating">${r.star_rating}</div>
            </div>
            <div class="review_text">${r.review}</div>
        </div>
        `
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

        const { isAdmin } = await res.json()

        if (isAdmin) {
            editContentBTN.style.display = "block"
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
            deleteContent.style.display = "block"
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
    const { content_name, content_description, content_type, img_id } = media;
    if (!img_id || !content_name || !content_type || !content_description) {
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
    element.innerHTML = `
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
