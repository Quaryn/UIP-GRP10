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

var RedoList = [];
var RedoNumber = 5

//Retrieves detailed information about a beverage and displays it
function showInfo(beer_id) {

    var response = getDetails(beer_id);


    var output = "<b id='name'>Name</b>: " + response[0]["namn"] + " " + response[0]["namn2"] + "<br><b id='price'>Price</b>: " + response[0]["prisinklmoms"] + "<br><b id='volume'>Volume</b>: " + response[0]["volymiml"] + "<br><b id='group'>Varugrupp</b>: " + response[0]["varugrupp"] +
            "<br><b id='container'>Container</b>: " + response[0]["forpackning"] + "<br><b id='origin'>Origin</b>: " + response[0]["ursprunglandnamn"] + "<br><b id='producer'>Producer</b>: " +
        response[0]["producent"] + "<br><b id='alcohol'>Alcohol</b>: " + response[0]["alkoholhalt"];
    document.getElementById("beerInfo").style.display = "initial";

    $('#beerInfo').html(output);

}

function allowDrop(ev) {
     ev.preventDefault();
}

function drag(ev) {
     var id = ev.currentTarget.dataset.name;
     ev.dataTransfer.setData("text", id);
     // Should be able to load in all the information we need here to make it more effective?
}

function drop(ev) {
     if (ev.currentTarget.className == "order-tab")
     {
       ev.preventDefault();

       var data = ev.dataTransfer.getData("text");
       var para = document.createElement("P");
       var response = getDetails(data);
       // No need to display the ID, but we need to keep track of it
       para.setAttribute("data-id", data);
       var output = "Namn: " + response[0]["namn"] + " " + response[0]["namn2"] +  ", Pris : " + response[0]["prisinklmoms"];
       var t = document.createTextNode(output);
       para.appendChild(t);
       $(".bar-tab").append(para);
   }
}

function orderDrink() {
    // If logged in properly, we can get username and password from storage
    var uname = localStorage.getItem("username");
    var pword = localStorage.getItem("password");
    var totSum = 0;

    // Find each p-tag in the bar-tab.
    $(".bar-tab").find("p").each(function(k,v) {

        // Get the ID connected to the paragraph.
        var id = $(this).data("id");

        // Send the request to the server.
        HTTPGetRequest("&action=purchases_append&username=" + uname + "&password=" + pword + "&beer_id=" + id);
        console.log("Sent request for: " + id);
        var splitWord = $(this).text().split(",");
        //console.log(splitWord[1].substring(8));
        totSum += Number(splitWord[1].substring(8));
    });
    $(".bar-tab").html("");
    /* alert('Total sum to pay: ' + totSum + 'SEK, please pay at the counter');*/
    /*Replace alert as popup total. Display popup total when clicking payup.*/

    var poppup = document.getElementById("pay-poppup");
    poppup.children[0].children[1].innerHTML = "Total sum to pay: " + totSum + " SEK, please pay at the counter."
    poppup.style.display = "block";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("closee")[0];


    // When the user clicks on <span> (x), close the poppup
    span.onclick = function() {
      poppup.style.display = "none";
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == document.getElementById("pay-poppup")) {
        document.getElementById("pay-poppup").style.display = "none";
    }
}


function forwardStepOrder() {
  if (RedoList.length > 0)
  {
      $(".bar-tab").append(RedoList.pop());
  }
}

//Only removes the most recently added item
function backStepOrder() {
  var bartab = document.getElementById('bar-tab');
  if (bartab.children.length > 0)
  {
      var item = bartab.lastChild;
      RedoList.push(item);
      if (RedoList.length > RedoNumber){
        RedoList.splice(0,1)
      };
      bartab.removeChild(item);
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


function closeAll(){
  var AllWidgetTitles = document.getElementsByClassName("widget-title");
  for (i = 0; i < AllWidgetTitles.length; i++) {
      if ($(AllWidgetTitles[i]).parents('.widget').hasClass('active'))
      {
        $(AllWidgetTitles[i]).next('.widget-content').toggle(200);
        $(AllWidgetTitles[i]).parents('.widget').removeClass('active')
      }
  }
}


//Initiates panel functionality
function panels() {

  //Don't know why these are open in the beginning, and don't know how to close them in a good way, so this wil do for now.
var AllWidgetTitles = document.getElementsByClassName("widget-title");
$(AllWidgetTitles[0]).next('.widget-content').toggle(200);
$(AllWidgetTitles[3]).next('.widget-content').toggle(200);


    (function ($) {
        $("#secondary").on('click', '.widget-title', function (e) {
              if ($(this).parents('.widget').hasClass('active'))
              {
                // If the active type was clicked then it whould be closed.
                closeAll();
              }
              else
              {
                //If the type clicked was not active, close all types and after that open the chosen type.
                closeAll();
                $(this).next('.widget-content').toggle(200);
                $(this).parents('.widget').addClass('active');
              }

        });
    })(jQuery);

}
