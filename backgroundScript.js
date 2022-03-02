async function getQuote(url) {
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json"
    }).done(function (data) {
        // console.log(data);

        $("#qotd").text(data.content);
        $("#author").text("-" + data.author);

        // $("#qotd").text(data["quotes"]["0"]["text"]);
        // $("#author").text("-" + data["quotes"]["0"]["author"]);
    });
}

async function renderClock() {
    let d = new Date();
    let minutes;

    if (d.getMinutes() < 10) {
        minutes = "0" + d.getMinutes(0);
    } else {
        minutes = d.getMinutes();
    }

    if (d.getHours() >= 1 && d.getHours() < 13) {
        $("#clock").text(d.getHours() + ":" + minutes);
    } else {
        $("#clock").text(Math.abs(d.getHours() - 12) + ":" + minutes);
    }

    setWelcomeMessage(d.getHours());
}

function setWelcomeMessage(hours) {
    if (hours >= 18 && hours <= 23) {
        $("#welcome_message").text("Good Evening");
    } else if (hours > 0 && hours < 12) {
        $("#welcome_message").text("Good Morning");
    } else {
        $("#welcome_message").text("Good Afternoon");
    }

    if (localStorage.getItem("user") != null && localStorage.getItem("user") != "") {
        $("#welcome_message").append(", " + localStorage.getItem("user"));
    }
}

setInterval(renderClock, 1000);

let height = $(window).height();
let width = $(window).width();


if (localStorage.getItem("interests") != null) {
    var userInterests = JSON.parse(localStorage.getItem("interests"));
} else {
    var userInterests = [];
}

$(document).on('click', '.closebtn', function () {
    // console.log(this.parentElement.querySelector('span').textContent);
    let index = userInterests.indexOf(this.parentElement.querySelector('span').textContent);

    if (index > -1) {
        userInterests.splice(index, 1);
    }

    this.parentElement.remove();
});

$("#interests").on("keydown", function search(e) {

    if (e.keyCode == 13) {
        if (userInterests.indexOf($(this).val().toLowerCase()) == -1) {
            userInterests.push($(this).val().toLowerCase())
            addInterestChip($(this).val().toLowerCase());

            $(this).val("");
        } else {
            alert("Duplicate value entered. Try a different value");
        }

    }
});

function addInterestChip(item) {
    var content = document.querySelector("template").content;
    var span = content.querySelector('span');

    span.textContent += item;
    $(".modal-content").append(document.importNode(content, true));

    span.textContent = ""
}

var content = document.querySelector("template").content;
var span = content.querySelector('span');

for (let i = 0; i < userInterests.length; i++) {
    span.textContent += userInterests[i];
    $(".modal-content").append(document.importNode(content, true));

    span.textContent = "";
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.height = "100%";
    modal.style.opacity = "1";
    if (localStorage.getItem("user") != null && localStorage.getItem("user") != "") {
        $("#fname").val(localStorage.getItem("user"));
    }

    if (localStorage.getItem("interests") != null) {
        let interests_array = JSON.parse(localStorage.getItem("interests"));
        // console.log(interests_array)

        for (let i = 0; i < interests_array.length; i++) {
            // console.log(interests_array[i]);
        }
    }
    if (localStorage.getItem("color") != null && localStorage.getItem("color") != "") {
        $("#favcolor").val(localStorage.getItem("color"));
    }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.height = "0";
    modal.style.opacity = "0";

    //Save users name and color.
    localStorage.setItem("user", $("#fname").val());
    localStorage.setItem("color", $("#favcolor").val());

    //Save users interests.
    localStorage.setItem("interests", JSON.stringify(userInterests));
    location.reload();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        // modal.style.display = "none";
        modal.style.height = "0";
        modal.style.opacity = "0";
        localStorage.setItem("user", $("#fname").val());
        localStorage.setItem("color", $("#favcolor").val());

        //Save users interests.
        localStorage.setItem("interests", JSON.stringify(userInterests));
        location.reload();
    }
}

let api_key = "563492ad6f91700001000001a11ae3dad369402b802a6dae2618f9fb";
let randomNumber = Math.floor(Math.random() * 11);
var queryURL = "";

function randomNumberGenerate(min, max) {
    const r = Math.random() * (max - min) + min
    return Math.floor(r)
}

function queryGeneration(color, interest, randomnum) {
    queryURL = "https://api.pexels.com/v1/search?query=" + interest + "&orientation=landscape" + color + "&per_page=" + randomnum;
}

var color;
var interest;

if (localStorage.getItem("color") != null && localStorage.getItem("color") != "") {
    color = localStorage.getItem("color")
} else {
    color = "black";
}

if (userInterests.length > 0) {
    interest = userInterests[randomNumberGenerate(0, userInterests.length)];
} else {
    interest = "abstract";
}

queryGeneration(color, interest, randomNumber);
// console.log(queryURL);

function imageSearch() {
    $.ajax({
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", api_key);
        },
        url: queryURL,
        success: function (data) {
            // console.log(data);

            let rand2 = Math.floor(Math.random() * data["photos"].length);
            let imgurl = data["photos"][rand2]["src"]["original"];
            $("#explanation").text("Photograph by " + data["photos"][rand2]["photographer"]);

            // console.log(rand2);

            let bgimage = new Image();
            bgimage.src = imgurl;
            $(".bg").hide();
            $(bgimage).on('load', function () {
                $(".bg").css("background-image", "url(" + $(this).attr("src") + ")").fadeIn(2000, 'linear');

            });
        },

        error: function (error) {
            console.log(error);
        }
    })
}
// getQuote("https://goquotes-api.herokuapp.com/api/v1/random?count=1");
getQuote("https://api.quotable.io/random");

$('#clock').hover(
    function () { $(this).addClass('animate__animated animate__heartBeat') },
    function () { $(this).removeClass('animate__animated animate__heartBeat') }
)

imageSearch();
