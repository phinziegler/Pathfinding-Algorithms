let buttonClose = document.getElementById("infoPageClose");
let page = document.getElementById("infoPage");
let buttonOpen = document.getElementById("infoPageOpen");

buttonClose.addEventListener("click", () => {
    if(!page.classList.contains("invisible")) {
        page.classList.toggle("invisible");
    }
});

buttonOpen.addEventListener("click", () => {
    if(page.classList.contains("invisible")) {
        page.classList.toggle("invisible");
    }
});

