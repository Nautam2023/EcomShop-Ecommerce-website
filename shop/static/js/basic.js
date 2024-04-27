
// For Admin Panel:
var adminlink = document.getElementById('admin_link');
adminlink.addEventListener('click', function (event) {
    event.preventDefault();
    adminlink.href = '/admin/shop';
    window.location.href = adminlink.href;
});

// For Form:
var searchForm = document.getElementById('search_from');
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchForm.action = '/search';
    searchForm.submit();
});


const pop_over_element = document.getElementById('cart_popover');
const popover_instance = new bootstrap.Popover(pop_over_element);

function updatecart_popover(carts) {
    cart_popover_header = "<div id='popover_cart_head_row' class='row popover_cart_head_row'>" +
        "<div id='popover_head_heading' class='col px-2 popover_head_heading'>Your Cart </div>" +
        "<div id='popover_clear_cart' class='col px-2 popover_clear_cart'><div id='clear_all_link'>Clear all</div></div>" +
        "</div>"
    cart_popover_content = "<div id='popover_cart_row_{{i.id}}' class='row popover_cart_row'></div>";

    if (carts != {}) {
        content = ""
        price = 0
        i = 0
        detaild_cart = JSON.parse(localStorage.getItem('detailed_cart'))
        for (item in carts) {
            i += 1
            id = item.split('_')[2];
            current_product = detaild_cart[item];
            product_name = current_product[1];
            product_price = current_product[2];
            product_price = parseFloat(product_price.split(",").join(""))
            price += (product_price * carts[item])
            content += "<div id='popover_cart_row_" + id + "' class='row popover_cart_row'>" +
                "<div id='popover_product_number_" + id + "' class='col px-2 popover_product_number'>" + i + ".</div>" +
                "<div id='popover_product_title_" + id + "' class='col px-2 popover_product_title'>" + product_name + "</div>" +
                "<div id='popover_product_quantity_" + id + "' class='col px-2 popover_product_quantity_div'>Que." + "<span class='popover_product_quantity_span'>" + carts[item] + "</span>" + "</div>" +
                "</div><hr class='popover_row_hr_line'>";
        }
        formated_price = price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        content += "<div id='popover_cart_row_last' class='row popover_cart_row_last'>" +
            "<div id='popover_product_total_item' class='col px-2 popover_product_total_item'>Total Items: " + "<span class='popover_product_total_item_span'>" + value_of_cart(carts) + "</span>" + "</div>" +
            "<div id='popover_product_total_price' class='col px-2 popover_product_total_price'>Rs. " + "<span class='popover_product_total_price_span'>" + formated_price + "</span>" + "</div>" +
            "</div>";

        if (i != 0) {
            content += "<div id='popover_product_checkout_row' class='row mx-0 popover_product_checkout_row'>" +
                "<a href='/checkout' id='popover_product_checkout' class='col mt-3 btn btn-primary popover_product_checkout'>Checkout</a>" +
                "</div>";
        }
        cart_popover_content = content;
    }

    popover_instance.setContent({
        '.popover-header': cart_popover_header,
        '.popover-body': cart_popover_content
    })
}

// Function to be called when mutation occurs
function mutationCallback(mutationsList, observer) {
    // Check if the last child element of body is a script
    var lastChild = document.body.lastElementChild;
    if (lastChild.tagName.toLowerCase() === 'div') {
        myFunction(); // Call your function here
    }
}

// Create a new mutation observer
var observer = new MutationObserver(mutationCallback);

// Configure the observer to watch for changes in the body
var observerConfig = { childList: true, subtree: true };
observer.observe(document.body, observerConfig);


function clearallcart() {
    carts = {}
    localStorage.setItem('cart', JSON.stringify(carts))
    localStorage.setItem('detailed_cart', JSON.stringify(carts))
    location.reload()
}

// Function to be called when the last child of body is a script
function myFunction() {
    document.getElementById('clear_all_link').removeEventListener('click', clearallcart)
    document.getElementById('clear_all_link').addEventListener('click', clearallcart)
}

function value_of_cart(carts) {
    cart_value = 0
    for (let key in carts) {
        cart_value += carts[key]
    }
    return cart_value
}

if (localStorage.getItem('cart') == null) {
    carts = {}
}

else {
    carts = JSON.parse(localStorage.getItem('cart'))
    document.getElementById('nav_cart_value').innerHTML = value_of_cart(carts)
    updatecart()
    updatecart_popover(carts)
}

function updatedetailedcart(id) {
    if (localStorage.getItem('detailed_cart') == null) {
        localStorage.setItem('detailed_cart', JSON.stringify({}));
    }

    if (localStorage.getItem('detailed_cart') != null) {
        carts = JSON.parse(localStorage.getItem('cart'));
        detaild_cart = JSON.parse(localStorage.getItem('detailed_cart'));
        product_id = 'product_id_' + id;

        if (carts.hasOwnProperty(product_id)) {
            item_quantity = carts[product_id]
            item_name = document.getElementById('product_heading_' + id).innerHTML;
            item_price = document.getElementById('prodcut_price_product_' + id).innerHTML;
            detaild_cart[product_id] = [item_quantity, item_name, item_price]
            localStorage.setItem('detailed_cart', JSON.stringify(detaild_cart));

        } else {
            if (detaild_cart.hasOwnProperty(product_id)) {
                delete detaild_cart[product_id]
                localStorage.setItem('detailed_cart', JSON.stringify(detaild_cart));
            }
        }

    }
}

function cartButtonListener(event) {
    cart_button = event.target
    but_id = cart_button.id
    cart_id = 'product_id_' + but_id.split('_')[3]

    if (carts[cart_id] != undefined) {
        carts[cart_id] += 1
    }

    else {
        carts[cart_id] = 1
    }

    document.getElementById('nav_cart_value').innerHTML = value_of_cart(carts)
    localStorage.setItem('cart', JSON.stringify(carts))
    updatedetailedcart(but_id.split('_')[3])
    updatecart()
    updatecart_popover(carts)
}

function all_cart_button_add_event_listener() {
    cart_buttons = document.querySelectorAll('.add_to_card_link')

    // Iterate through each cart button and add the event listener
    cart_buttons.forEach(cart_button => {
        cart_button.removeEventListener('click', cartButtonListener);
        cart_button.addEventListener('click', cartButtonListener);
    });
}

all_cart_button_add_event_listener()

function second_time_add_to_cart(div_element, id) {
    div_element.innerHTML = "<button type='button' id='procuct_cart_button_" + id + "' class='btn btn-primary add_to_card_link'>Add to Cart</button>"
    all_cart_button_add_event_listener()
}

function updatecart() {
    for (var item in carts) {
        id = item.split('_')[2];
        spanid = "add_cart_button_span_" + id;
        span_tag = document.getElementById(spanid);
        if (span_tag) {
            span_tag.innerHTML = "<span id='cart_minus_button_span_" + id + "' class='cart_minus_button_span'> <button type='button' id='cart_minus_button_" + id + "' class='btn btn-primary minus_to_cart'>-</button> </span>"
                + "<span id='cart_value_span_" + id + "' class='cart_value_span'>" + carts[item] + "</span>" +
                "<span id='cart_plus_button_span_" + id + "' class='cart_plus_button_span'> <button type='button' id='cart_plus_button_" + id + "' class='btn btn-primary plus_to_cart'>+</button> </span>";
        }
    }
    // Call the function to add event listeners
    addEventListeners();
}

function remove_unnecessory_cart_product(carts) {
    for (let key in carts) {
        if (carts[key] == 0) {
            delete carts[key]
        }
    }
    return carts
}

// Define event listener functions
function cartPlusHandler(event) {
    const plusButton = event.target;
    const buttonId = plusButton.id;
    const cartId = 'product_id_' + buttonId.split('_')[3];

    if (carts[cartId] != undefined) {
        carts[cartId] += 1;
    } else {
        carts[cartId] = 1;
    }

    document.getElementById('nav_cart_value').innerHTML = value_of_cart(carts);
    localStorage.setItem('cart', JSON.stringify(carts));
    updatedetailedcart(buttonId.split('_')[3])
    updatecart_popover(carts)

    const valueSpanId = plusButton.parentElement.previousElementSibling.id;
    const valueSpanTag = document.getElementById(valueSpanId);
    valueSpanTag.innerHTML = carts[cartId];

    event.stopPropagation();
}

function cartMinusHandler(event) {
    const minusButton = event.target;
    const buttonId = minusButton.id;
    const cartId = 'product_id_' + buttonId.split('_')[3];
    const valueSpanId = minusButton.parentElement.nextElementSibling.id;
    const valueSpanTag = document.getElementById(valueSpanId);

    if (carts[cartId] > 0) {
        carts[cartId] -= 1;
        if (carts[cartId] == 0) {
            valueSpanTag.innerHTML = carts[cartId];
            second_time_add_to_cart(minusButton.parentElement.parentElement, buttonId.split('_')[3])
            delete carts[cartId];
            carts = remove_unnecessory_cart_product(carts)
        }

        document.getElementById('nav_cart_value').innerHTML = value_of_cart(carts);
        localStorage.setItem('cart', JSON.stringify(carts));
        updatedetailedcart(buttonId.split('_')[3])
        updatecart_popover(carts)
        valueSpanTag.innerHTML = carts[cartId];
    }
    event.stopPropagation();
}

// Add event listeners
function addEventListeners() {
    const plusButtons = document.querySelectorAll('.plus_to_cart');
    const minusButtons = document.querySelectorAll('.minus_to_cart');

    plusButtons.forEach(plusButton => {
        plusButton.removeEventListener('click', cartPlusHandler); // Remove previous listener
        plusButton.addEventListener('click', cartPlusHandler);
    });

    minusButtons.forEach(minusButton => {
        minusButton.removeEventListener('click', cartMinusHandler); // Remove previous listener
        minusButton.addEventListener('click', cartMinusHandler);
    });
}
