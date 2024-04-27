if (localStorage.getItem("detailed_cart") != null) {
    detailed_cart = JSON.parse(localStorage.getItem("detailed_cart"));

    content = "";
    i = 0;
    total_qauntity = 0;
    total_price = 0;
    for (product_id in detailed_cart) {
        i += 1;
        id = product_id.split("_")[2];
        product_quantity = detailed_cart[product_id][0];
        product_name = detailed_cart[product_id][1];
        product_price = detailed_cart[product_id][2];
        float_price = parseFloat(product_price.split(",").join(""));

        total_qauntity += parseInt(product_quantity);
        total_price += float_price * parseInt(product_quantity);

        content +=
            "<a href='/products/" +
            id +
            "' class='product_links'>" +
            "<li class='list-group-item d-flex gap-2 justify-content-between align-items-center product_review_list'>" +
            "<div class='checkout_product_left_side checkout_product_left_side_normal_row'>" +
            "<span class=' checkout_product_number'> " +
            i +
            ".</span>" +
            "<span class=' checkout_product_name'>" +
            product_name +
            "</span>" +
            "</div>" +
            "<div class='checkout_product_right_side checkout_product_right_side_normal_row'>" +
            "<div class='d-flex checkout_product_price_div'>" +
            "<span class='checkout_product_ruppes'> Rs.</span>" +
            "<span class='checkout_product_price'>" +
            product_price +
            "</span>" +
            "</div>" +
            "<span class='checkout_product_x'> x </span>" +
            "<span class='badge text-bg-primary rounded-pill checkout_product_quantity'>" +
            product_quantity +
            "</span>" +
            "</div>" +
            "</li>" +
            "</a>";
    }

    total_price = total_price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    content +=
        "<li class='list-group-item d-flex gap-2 py-3 justify-content-between align-items-center product_final_list'>" +
        "<div class='checkout_product_left_side checkout_product_total_items_div'>" +
        "<span class='checkout_product_total_items_title'>Total Items:</span>" +
        "<span class='badge text-bg-success rounded-pill checkout_product_quantity checkout_product_total_items_number'>" +
        total_qauntity +
        "</span>" +
        "</div>" +
        "<div class='checkout_product_right_side checkout_product_total_price_div'>" +
        "<span class='checkout_product_total_price_title'>Payble Amount: </span>" +
        "<span class='checkout_product_total_price_nubmer'>" +
        total_price +
        "</span>" +
        "</div>" +
        "</li>";

    checkout_first_step_ul = document.getElementById(
        "checkout_first_step_ul_id"
    );
    checkout_first_step_ul.innerHTML = content;
}

var contact_form = document.getElementById("checkout_second_step_form");
var all_input = document.querySelectorAll(".required_input");
var item_json_tag = document.getElementById("item_json");
item_json_tag.value = localStorage.getItem("cart");

all_input.forEach((cur_input) => {
    cur_input.addEventListener("input", () => {
        const nextSibling = cur_input.nextElementSibling;
        if (nextSibling) {
            const error_id = nextSibling.id;
            document.getElementById(error_id).innerText = "";
        }
    });
});

function email_verification() {
    let isValid = true;
    all_input.forEach((cur_input) => {
        const nextSibling = cur_input.nextElementSibling;
        if (nextSibling) {
            const error_id = nextSibling.id;
            if (cur_input.value.trim() === "") {
                document.getElementById(error_id).innerText =
                    "This field is required.";
                document
                    .getElementById(error_id)
                    .classList.add("error-message");
                isValid = false;
            } else {
                document.getElementById(error_id).innerText = "";
                document
                    .getElementById(error_id)
                    .classList.remove("error-message");
            }
        }
    });
    return isValid;
}

function clearallcart() {
    carts = {};
    localStorage.setItem("cart", JSON.stringify(carts));
    localStorage.setItem("detailed_cart", JSON.stringify(carts));
}

contact_form.addEventListener("submit", function (event) {
    if (!email_verification()) {
        event.preventDefault();
    } else {
        if (
            Object.keys(JSON.parse(localStorage.getItem("detailed_cart")))
                .length !== 0
        ) {
            event.preventDefault();
            clearallcart();
            contact_form.submit();
        } else {
            event.preventDefault();
            alert_tag = document.getElementById("checkout_alert");
            alert_tag.classList.remove("d-none");
            alert_tag.classList.add("d-flex");

            // setTimeout(() => {
            //     alert_tag.classList.remove('d-flex');
            //     alert_tag.classList.add('d-none');
            // }, 2000);
        }
    }
});
