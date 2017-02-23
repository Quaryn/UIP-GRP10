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


function displayItems(){
    var joutput = document.getElementById("mainmenu");
    var jsonResponse = getDrinks();

    var cart = [];
    var output = "";




    for (var key in jsonResponse) {

     output += "<li><a href=''>" + JSON.stringify(jsonResponse[key].namn) +
         "<br>Price: " + JSON.stringify(jsonResponse[key].pub_price) +
         "<br>Stock: " + JSON.stringify(jsonResponse[key].count) + "</li>";

     }

    $('#mainmenu').html(output)

    /*$(function() {

        $('#mainmenu').text(JSON.stringify(jsonResponse));
    });*/

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
