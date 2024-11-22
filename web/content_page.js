const errorMessage = document.getElementById("error_message")
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
    } catch (e) {
        errorMessage.innerText = 'Something went wrong.'
    }
    debugger

})