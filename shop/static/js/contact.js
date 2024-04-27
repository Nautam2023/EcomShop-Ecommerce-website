var contact_form = document.getElementById("contact_form");
var all_input = document.querySelectorAll(".required_input");

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

contact_form.addEventListener("submit", function (event) {
    if (!email_verification()) {
        event.preventDefault();
    }
});

try {
    contact_alert_tag = document.getElementById("contact_submitted_alert");
    setTimeout(() => {
        contact_alert_tag.classList.add("d-none");
    }, 20000);
} catch (error) {}
