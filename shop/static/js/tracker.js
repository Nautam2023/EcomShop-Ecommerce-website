var tracker_form = document.getElementById("tracker_order_form");
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

tracker_form.addEventListener("submit", function (event) {
    event.preventDefault();

    status_ul = document.getElementById("tracker_status_ul_id");
    heading = document.getElementById("order_status_second_heading");
    heading.innerHTML = "";
    status_ul.innerHTML = "";

    if (email_verification()) {
        fetch_response();
    }
});

async function fetch_response() {
    const url = "http://127.0.0.1:8000/tracker/";

    const order_id = document.getElementById("tracker_orderid").value;
    const email = document.getElementById("tracker_email").value;

    const payload = {
        order_id: order_id,
        email: email,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(payload),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Resource not found");
            } else {
                throw new Error("Network response was not ok");
            }
        }
        const data = await response.json();
        if (data.error) {
            throw Error(data.error);
        } else {
            print_order_update(data);
        }
        // Handle response data
    } catch (error) {
        alert_div = document.getElementById("order_not_found_alert_div");
        alert_content =
            "<div class='alert alert-danger order_not_fount_alert' role='alert'>" +
            "<span class='track_order_text'>No order found with this ID and email, Please verify the entered Order ID and Email.</span>" +
            "</a>" +
            "</div>";
        alert_div.innerHTML = alert_content;
    }
}

const tracker_orderid = document.getElementById("tracker_orderid");
tracker_orderid.addEventListener("focus", function (event) {
    alert_div = document.getElementById("order_not_found_alert_div");
    alert_div.innerHTML = "";
});

const tracker_email = document.getElementById("tracker_email");
tracker_email.addEventListener("focus", function (event) {
    alert_div = document.getElementById("order_not_found_alert_div");
    alert_div.innerHTML = "";
});

function print_order_update(updates) {
    status_ul = document.getElementById("tracker_status_ul_id");
    heading = document.getElementById("order_status_second_heading");
    content = "";
    updates = Array.from(updates);
    updates = updates.reverse();
    updates.forEach((element) => {
        update = element.text;
        date_time = convertToIST(element.time);
        date = format_date(date_time.split("T")[0]);
        time = format_time(date_time.split("T")[1].split(".")[0]);

        content +=
            "<li class='list-group-item d-flex gap-2 justify-content-between align-items-center update_status_list'>" +
            "<div div class='tracker_update_left_side tracker_update_left_side_normal_row'>" +
            "<span class='tracker_update_title'>" +
            update +
            "</span>" +
            "</div>" +
            "<div class='tracker_update_right_side tracker_update_right_side_normal_row'>" +
            "<div class='d-flex gap-2 tracker_update_datetime_div'>" +
            "<span class='badge text-bg-success rounded-pill tracker_update_time'>" +
            date +
            "</span>" +
            "<span class='badge text-bg-success rounded-pill tracker_update_time'>" +
            time +
            "</span>" +
            "</div>" +
            "</div>" +
            "</li> ";
    });
    heading.innerHTML = "Your Order Status";
    status_ul.innerHTML = content;
    show_description();
}

function getCSRFToken() {
    return document.getElementById("tracker_order_form").firstElementChild
        .value;
}

function format_date(date) {
    formated_date = date.split("-").reverse().join("/");
    return formated_date;
}

function format_time(time) {
    hour = time.split(":")[0];
    minute = time.split(":")[1];
    second = time.split(":")[2];

    if (hour >= 12) {
        hour -= 12;
        aft = "PM";
    } else {
        aft = "AM";
    }
    formated_time = hour + ":" + minute + ":" + second + " " + aft;
    return formated_time;
}

function show_description() {
    All_updates = document.querySelectorAll(".tracker_order_update");

    All_updates.forEach((element) => {
        element.addEventListener("click", function () {
            this.classList.toggle("show_hidden");
        });
    });
}

function convertToIST(utc_datetime) {
    console.log(utc_datetime);
    date = utc_datetime.split("T")[0];
    time = utc_datetime.split("T")[1].split(".")[0];
    newtime = addTime(time);
    changedate = newtime.split("|")[1];
    newtime = newtime.split("|")[0];

    if (changedate == "True") {
        newdate = getNextDay(date);
    } else {
        newdate = date;
    }

    ist_datetime =
        newdate +
        "T" +
        newtime +
        "." +
        utc_datetime.split("T")[1].split(".")[1];

    return ist_datetime;
}

function getNextDay(dateString) {
    // Create a Date object from the date string
    const date = new Date(dateString);

    // Add 1 day to the date
    date.setDate(date.getDate() + 1);

    // Format the date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if necessary
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addTime(timeString) {
    // Split the time string into hours, minutes, and seconds, handling potential errors
    let hours = parseInt(timeString.split(":")[0]);
    let minutes = parseInt(timeString.split(":")[1]);
    let seconds = parseInt(timeString.split(":")[2]);
    // Add 5 hours and 30 minutes

    minutes = minutes + 30;
    hours += Math.floor(minutes / 60); // Carry over hours if minutes exceed 60
    minutes %= 60; // Keep minutes within 0-59
    hours += 5;
    // Handle overflow for hours (24-hour format)
    if (hours >= 24) {
        ext = "True";
    } else {
        ext = "False";
    }

    hours = hours % 24;

    // Format the result with leading zeros for consistency
    return (
        `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}` +
        "|" +
        ext
    );
}
