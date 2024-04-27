products_disc = document.querySelectorAll(".product_heading");

products_disc.forEach((heading) => {
    heading.addEventListener("click", (e) => {
        heading.classList.toggle("show_desc");
    });
});

products_disc = document.querySelectorAll(".product_desc");

products_disc.forEach((desc) => {
    desc.addEventListener("click", (e) => {
        desc.classList.toggle("show_desc");
    });
});
