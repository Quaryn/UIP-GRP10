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


function addToCart (item) {

}


function showInfo(beer_id) {

    var response = getDetails(beer_id);

    var output = "Namn: " + response[0]["namn"] + "<br>Pris: " + response[0]["prisinklmoms"] + "<br>Volym: " + response[0]["volymiml"] + "<br>Varugrupp: " + response[0]["varugrupp"] +
            "<br>Förpackning: " + response[0]["forpackning"] + "<br>Ursprung: " + response[0]["ursprunglandnamn"] + "<br>Producent: " +
        response[0]["producent"] + "<br>Alkoholhalt: " + response[0]["alkoholhalt"];
    document.getElementById("beerInfo").style.display = "initial";
    $('#beerInfo').html(output);

}

function displayItems(){
    var joutput = document.getElementById("mainmenu");
    var jsonResponse = getDrinks();

    var cart = [];
    var output = "";


    for (var key in jsonResponse) {

     output += "<li>" + "<a class='clickInfo' href='#' data-name =" + JSON.stringify(jsonResponse[key].beer_id) + ">" + JSON.stringify(jsonResponse[key].namn) +
         "<br>Price: " + JSON.stringify(jsonResponse[key].pub_price) +
         "<br>Stock: " + JSON.stringify(jsonResponse[key].count) + "</a></li>";

     }

    $('#mainmenu').html(output)

    $(".clickInfo").click(function (event) {
        event.preventDefault();

        var id = $(this).attr("data-name");
        showInfo(id);
    })
}

function indexPageLoaded() {
    displayItems();
    panels();
}

function panels() {

    (function ($) {
        $("#secondary").on('click', '.widget-title', function (e) {
            $(this).next('.widget-content').toggle(200);
            $(this).parents('.widget').toggleClass('active');
        });
    })(jQuery);

}
