function getQuote(url) {
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json"
    }).done(function(data){    
        console.log(data);

        $("#qotd").text(data["quotes"]["0"]["text"]);
        $("#author").text("-" + data["quotes"]["0"]["author"]);

    });
}

let d = new Date();
let hours;
let minutes;

if(d.getMinutes() < 10){
    minutes = "0" + d.getMinutes(0);
}else{
    minutes = d.getMinutes();
}

if(d.getHours() >= 1 && d.getHours() < 13){
    $("#clock").text(d.getHours() + ":" + minutes);
}else{
    $("#clock").text(d.getHours()-12 + ":" + minutes);
}

function setWelcomeMessage(){
    if(d.getHours() >= 18 && d.getHours() <= 23){
        $("#welcome_message").text("Good Evening");
    }else if(d.getHours() > 0 && d.getHours() < 12){
        $("#welcome_message").text("Good Morning");
    }else{
        $("#welcome_message").text("Good Afternoon");
    }   
}

setWelcomeMessage();

let height = $(window).height();
let width = $(window).width();

if(localStorage.getItem("user") != null && localStorage.getItem("user") != ""){
    $("#welcome_message").append(", " + localStorage.getItem("user"));
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  if(localStorage.getItem("user") != null && localStorage.getItem("user") != ""){
    $("#fname").val(localStorage.getItem("user"));
  }

  if(localStorage.getItem("color") != null && localStorage.getItem("color") != ""){
    $("#favcolor").val(localStorage.getItem("color"));
  }
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  localStorage.setItem("user", $("#fname").val());
  localStorage.setItem("color", $("#favcolor").val());
  location.reload();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    localStorage.setItem("user", $("#fname").val());
    localStorage.setItem("color", $("#favcolor").val());
    location.reload();
  }
}

let api_key = "563492ad6f91700001000001a11ae3dad369402b802a6dae2618f9fb";
let randomNumber = Math.floor(Math.random() * 11);

if(localStorage.getItem("color") != null && localStorage.getItem("color") != ""){
    var queryURL = "https://api.pexels.com/v1/search?query=art&orientation=landscape" + localStorage.getItem("color") + "&per_page=" + randomNumber;
}else{
    var queryURL = "https://api.pexels.com/v1/search?query=art&orientation=landscape&per_page=" + randomNumber;

}

console.log(queryURL);

function imageSearch(){
    $.ajax({
        method:'GET',
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", api_key);
        },
        url:queryURL,
        success:function(data){
            console.log(data);
            console.log(data["photos"][0]["src"]["original"]);

            let rand2 = Math.floor(Math.random() * data["photos"].length); 
            let imgurl = data["photos"][rand2]["src"]["original"];

            console.log(rand2);

            let bgimage = new Image();
            bgimage.src = imgurl;
            $(".bg").hide();
            $(bgimage).on('load', function(){
                $(".bg").css("background-image","url("+$(this).attr("src")+")").fadeIn(2000, 'linear');  
            });

            $(bgimage).ready(function(){
                getQuote("https://goquotes-api.herokuapp.com/api/v1/random?count=1");
            });
            
        },
        
        error:function(error){
            console.log(error);
        }
    })
}

$('#clock').hover(
    function(){ $(this).addClass('animate__animated animate__heartBeat') },
    function(){ $(this).removeClass('animate__animated animate__heartBeat') }
)

imageSearch();
