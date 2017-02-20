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

// To be used below
function Create2DArray(rows) {
    var arr = [];
    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }
    return arr;
}

// Will return an array that where each item contains a beer_id. This is only used to use in another function to get
// more detailed info about each beer.
// Could add an option to only add if the inventory is higher than a certain amount
function getBeers() {
    var beers = [];
    var response = JSON.parse(HTTPGetRequest(inventory_get));
    for (var i = 0; i < response["payload"].length; i++) {
        // if (response["payload"][i]["count"] > 5)
        beers.push(response["payload"][i]["beer_id"]);
    }
    return beers;
}


// For each item in getBeers, get the more detailed version of the beer.
function getDetailedBeers() {
    var beers = getBeers(); // An array containing beer_id's
    // We want one row for each beer_id, no need to specify columns.
    // detailedBeers[0][3] will access first row, fourth column
    var detailedBeers = Create2DArray(beers.length);
    for (var i = 0; i < beers.length; i++) {
        var response = JSON.parse(HTTPGetRequest("beer_data_get&beer_id=" + beers[i].toString()));
        detailedBeers[i][0] = response["payload"][i]["nr"];
        detailedBeers[i][1] = response["payload"][i]["artikelid"];
        detailedBeers[i][2] = response["payload"][i]["varnummer"];
        detailedBeers[i][3] = response["payload"][i]["namn"] + " " + response["payload"][i]["namn2"];
        detailedBeers[i][4] = response["payload"][i]["prisinklmoms"];
        detailedBeers[i][5] = response["payload"][i]["volymiml"];
        detailedBeers[i][6] = response["payload"][i]["varugrupp"];
        detailedBeers[i][7] = response["payload"][i]["forpackning"];
        detailedBeers[i][8] = response["payload"][i]["forslutning"];
        detailedBeers[i][9] = response["payload"][i]["ursprung"];
        detailedBeers[i][10] = response["payload"][i]["ursprunglandnamn"];
        detailedBeers[i][11] = response["payload"][i]["producent"];
        detailedBeers[i][12] = response["payload"][i]["leverantor"];
        detailedBeers[i][13] = response["payload"][i]["alkoholhalt"];
    }
    return detailedBeers;
}

// Sort into different arrays, if it's beer or wine, white or red etc.
// The different kinds:
// "Öl, Ljus lager"
// "Öl, Ale"
// "Öl, Porter och Stout"
// "Alkoholfritt, Öl" maybe other alcfree, so bind them together
// "Vitt vin, .."
// "Rött vin, .."
// "Cider, .."

function sortBeverageByType () {
    var detailedBeers = getDetailedBeers();
    var len = detailedBeers.length;
    var lagers = Create2DArray(len);
    var ales = Create2DArray(len);
    var porterStout = Create2DArray(len);
    var alcFree = Create2DArray(len);
    var whiteWine = Create2DArray(len);
    var redWine = Create2DArray(len);
    var ciders = Create2DArray(len);
    var otherBeverages = Create2DArray(len);

    for (var i = 0; i < len; i++) {
        var type = detailedBeers[i][6]
        var temp = 0;
        if (type == "Öl, Ljus lager") {
            temp = lagers.length;
            lagers[temp] = detailedBeers[i];
        }
        else if (type == "Öl, Ale") {
            temp = ales.length;
            ales[temp] = detailedBeers[i]
        }
        else if (type == "Öl, Porter och Stout") {
            temp = porterStout.length;
            porterStout[temp] = detailedBeers[i];
        }
        else if (type.substring(0,11) == "Alkoholfritt") {
            temp = alcFree.length;
            alcFree[temp] = detailedBeers[i];
        }
        else if (type.substring(0,7) == "Vitt vin") {
            temp = whiteWine.length;
            whiteWine[temp] = detailedBeers[i];
        }
        else if (type.substring(0,7) == "Rött vin") {
            temp = redWhine.length;
            redWhine[temp] = detailedBeers[i];
        }
        else if (type.substring(0,4) == "Cider") {
            temp = ciders.length;
            ciders[temp] = detailedBeers[i];
        }
        else {
            temp = otherBeverages.length;
            otherBeverages[temp] = detailedBeers[i];
        }
    }

    // Now we just need to get these arrays to the site

}