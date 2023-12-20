let headerBtn = document.querySelector(".header__burger");
let headerMenu = document.querySelector(".burger");

headerBtn.addEventListener("click", function () {
    headerBtn.classList.toggle("active");
    headerMenu.classList.toggle("active");
    document.body.classList.toggle("_lock");
});
