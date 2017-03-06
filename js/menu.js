/**
 * Created by Dennis on 2017-02-21.
 */

function docLoaded(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);

    }
}
/* Following can be used to place the order. Should be saved from the login.
localStorage.getItem("username");
localStorage.getItem("password");
localStorage.getItem("credentials");
*/

//Retrieves detailed information about a beverage and displays it
function showInfo(beer_id) {

    var response = getDetails(beer_id);


    var output = "<b id='name'>Namn:</b> " + response[0]["namn"] + "<br><b id='price'>Pris:</b> " + response[0]["prisinklmoms"] + "<br><b id='volume'>Volym:</b> " + response[0]["volymiml"] + "<br><b id='group'>Varugrupp:</b> " + response[0]["varugrupp"] +
            "<br><b id='container'>Förpackning:</b> " + response[0]["forpackning"] + "<br><b id='origin'>Ursprung:</b> " + response[0]["ursprunglandnamn"] + "<br><b id='producer'>Producent:</b> " +
        response[0]["producent"] + "<br><b id='alcohol'>Alkoholhalt:</b> " + response[0]["alkoholhalt"];
    document.getElementById("beerInfo").style.display = "initial";

    $('#beerInfo').html(output);

}

function allowDrop(ev) {
     ev.preventDefault();
}

function drag(ev) {
     var id = ev.currentTarget.dataset.name;
     ev.dataTransfer.setData("text", id);
}

function drop(ev) {
     if (ev.currentTarget.className == "order-tab")
     {
       ev.preventDefault();

       var data = ev.dataTransfer.getData("text");
       var para = document.createElement("P");
       var response = getDetails(data);
       var output = "ID: " + data + " Namn: " + response[0]["namn"] + " Pris: " + response[0]["prisinklmoms"];
       var t = document.createTextNode(output);
       para.appendChild(t);
       ev.target.appendChild(para);
   }
}

//Displays a sorted array containing the beverages. Adds a click listener to each item.
function displaySorted(sortedArray, place){

    output = "";

    for (var key in sortedArray) {

        output += "<li>" + "<a class='clickInfo' href='#' data-name =" + sortedArray[key]["nr"] + " draggable='true' ondragstart='drag(event)'>" + sortedArray[key]["pname"] +
            "<br>Price: " + sortedArray[key]["price"] +  "</a></li>";

    }


   $(place).append(output);

    $(".clickInfo").click(function (event) {
        event.preventDefault();

        var id = $(this).attr("data-name");
        showInfo(id);
    })

}

function indexPageLoaded() {
    sortBeverageByType();
    panels();
}

//Initiates panel functionality
function panels() {

    (function ($) {
        $("#secondary").on('click', '.widget-title', function (e) {
            $(this).next('.widget-content').toggle(200);
            $(this).parents('.widget').toggleClass('active');
        });
    })(jQuery);

}
