/**
 * Created by hullberg on 09/02/17.
 */


// inventory_get gives a list of all drinks
// http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=inventory_get
// http://pub.jamaica-inn.net/fpdb/api.php?action=inventory_get     works aswell
// one example object has following values:
// {"namn" : "Black Tower","namn2" : "Rivaner","sbl_price" : "29.00","pub_price" : "35","beer_id" : "604504",
// "count" : "47","price" : "29.00"}

// var response = JSON.parse(xhr.responseText);
// response["payload"][0]["beer_id"] will give the beer_id of the first element in the payload
// for (var i = 0; i < response["payload"].length; i++) {
// var tempname = response["payload"][i]["namn"];
// var tempname2 = response["payload"][i]["namn2"];
// var tempsbl = response["payload"][i]["sbl_price"];
// var temppub = response["payload"][i]["pub_price"];
// var tempid = response["payload"][i]["beer_id"];
// var tempcount = response["payload"][i]["count"];
// var tempprice = response["payload"][i]["price"];
// Now we have the i'th element of the list of all beverages, and can get variables above like such:
// And do some fun things with them

// https://jsfiddle.net/5dvsx8vy/2/ feel free to play around further
// }

//So we can have that data for all, and if you want to read more about one item you can get it from using the url below

// http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=beer_data_get&beer_id=604504 gives:
// {"type" : "beer_data_get", "payload" : [{"nr" : "604504","artikelid" : "9925","varnummer" : "6045",
// "namn" : "Black Tower","namn2" : "Rivaner","prisinklmoms" : "29.00","volymiml" : "","prisperliter" : "",
// "saljstart" : "1996-04-01","slutlev" : " ","varugrupp" : "Vitt vin,  Druvigt & Blommigt","forpackning" : "Flaska",
// "forslutning" : "Skruvkapsyl","ursprung" : "Rheinhessen","ursprunglandnamn" : "Tyskland",
// "producent" : "Reh Kendermann","leverantor" : "Hermansson & Co AB","argang" : "2013","provadargang" : "2013",
// "alkoholhalt" : "8.5%","modul" : "","sortiment" : "FS","ekologisk" : "0","koscher" : "0"}]}

function Beverage(name1, name2, sbl_price, pub_price, beer_id, count, price) {

    this.name1 = name1; // Name of the beer
    this.name2 = name2; // Sometimes two strings for name
    this.sbl_price = sbl_price;
    this.pub_price = pub_price; // Amount the customer pays
    this.beer_id = beer_id;
    this.count = count;
    this.price = price;


}
//This will make a HTTP request, where we request to get the info from URL
//true-parameter makes it asynchronous
function HTTPGetRequest(theAction) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theUrl, true);
    xhr.send();

    //processRequest handler is called when readystate changes.
    xhr.addEventListener("readystatechange", processRequest, false);

    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        // rS == 4 & status == 200 => all is okay
        if (xhr.readyState == 4 && xhr.status == 200) {
            return JSON.parse(xhr.responseText);
        }
    }
}

// Will return an array that where each item contains a beer. Can be further used to look at each beer_id.
function getBeers() {
    var beers = [];
    var response = HTTPGetRequest(inventory_get);
    for (var i = 0; i < response["payload"].length; i++) {
        beers.push(response["payload"][i]);
    }
    return beers;
}

// For each item in getBeers, get the more detailed version of the beer.
function getDetailedBeers() {
    var beers = getBeers();
    var detailedBeers = [];
    for (var i = 0; i < beers.length; i++) {
        var response = HTTPGetRequest("beer_data_get&beer_id=" + beers[i]["beer_id"]);
        detailedBeers.push(response["payload"][i]);
    }
}

// Sort into different arrays, if it's beer or wine, white or red etc.
// The different kinds:
// "Öl, Ljus lager"
// "Öl, Ale"
// "Öl, Porter och Stout"
// "Alkoholfritt, Öl"
// "Vitt vin, .."
// "Rött vin, .."
// "Cider, .."

function sortBeverageByType () {
    var detailedBeers = getDetailedBeers();

    var lagers = [];
    var ales = [];
    var porterStout = [];
    var alcFreeBeer = [];
    var whiteWine = [];
    var redWine = [];
    var otherBeverages = [];

    for (var i = 0; i < detailedBeers.length; i++) {
        var current = detailedBeers[i]]
        if (current["varugrupp"] == "Öl, Ljus lager") {
            lagers.push(current);
        }
        else if (current["varugrupp"] == "Öl, Ale") {
            ales.push(current);
        }
        else if (current["varugrupp"] == "Öl, Porter och Stout") {
            porterStout.push(current);
        }
        else if (current["varugrupp"] == "Alkoholfritt, Öl") {
            alcFreeBeer.push(current);
        }
        else if (current["varugrupp"].substring(0,7) == "Vitt vin") {
            whiteWine.push(current);
        }
        else if (current["varugrupp"].substring(0,7) == "Rött vin") {
            redWine.push(current);
        }
        else {
            otherBeverages.push(current);
        }

        // Now the question is how to get these arrays to the site.
    }
}