const testBtn = document.getElementById("test-btn");

testBtn.addEventListener('click', async () => {
    const response = await fetch("/api/test", {
        method: "POST",
        body: JSON.stringify({}),
    });
    if (!response.ok) {
        throw new Error()
    }

})


