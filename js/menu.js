/**
 * Created by Dennis on 2017-02-21.
 */

function defineOrderArrays() {

  if (typeof currentArray === 'undefined') {
    currentArray = []; //will contain the current order of things on the tab.
    orderArrayArray = []; //will contain all the previous order of drinks on the tab
    undoRedoPosition = 0; //remembers where in the orderArrayArray we are so that we can redo/undo easily.
  }
}

function docLoaded(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);

    }
}



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
       defineOrderArrays();
       var data = ev.dataTransfer.getData("text");
       var para = document.createElement("P");
       var response = getDetails(data);
       var output = "ID: " + data + " Namn: " + response[0]["namn"] + " Pris: " + response[0]["prisinklmoms"];
       var t = document.createTextNode(output);
       para.appendChild(t);
       ev.target.appendChild(para);
       orderTabArray(output);
       console.log(currentArray);
   }
}

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

function panels() {

    (function ($) {
        $("#secondary").on('click', '.widget-title', function (e) {
            $(this).next('.widget-content').toggle(200);
            $(this).parents('.widget').toggleClass('active');
        });
    })(jQuery);

}


//Functions that govern the undo and redo property of the tab.

function orderTabArray(newData) {

  currentArray.push(newData);
  orderArrayArray.push( currentArray  ); //Right now, for some reason this does not work. It should work but doesn't.
  console.log(newData);
  console.log(orderArrayArray);

  if (undoRedoPosition == orderArrayArray.length) {
    undoRedoPosition+=1;
  } else {
    undoRedoPosition = orderArrayArray.length - 1;
  }


}

function backStepOrder() {
  console.log(undoRedoPosition);
  undoRedo(orderArrayArray[undoRedoPosition-1]);
}

function undoRedo(input) { //source: http://stackoverflow.com/questions/17650776/add-remove-html-inside-div-using-javascript answer by Austin Brunkhorst

  var list = document.getElementById('orderTab'); //finds important div.
  //list.removeChild(list.childNodes[3]); //removes all childs of important to eliminate old info.
  console.log(input);
  console.log(orderArrayArray);
  var p = document.createElement('div');
  var activeArray = input;

  for (var i=0; i<activeArray.length; i++) {
    var output = activeArray[i];
    var t = document.createTextNode(output + "\n");
    p.appendChild(t);
    document.getElementById('orderTab').appendChild(p);
  }


}



