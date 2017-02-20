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
    this.sbl_price = sbl_price; // Choco: if Lars clarified that sbl_price can be ignored, why do we still keep it?
    this.pub_price = pub_price; // Amount the customer pays
    this.beer_id = beer_id;
    this.count = count; /* Choco: does count controls the stock of the beer?
    And we can create a threshold to issue an alarm when it goes low/crosses the predefined count?*/
    this.price = price; // Choco: wholesale price the pub pays to the beer suppliers


}


// To be used below
// Choco: move close to the code where this function is used?
function Create2DArray(rows) {
    var arr = [];
    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }
    return arr;
}

// Will return an array that where each item contains a beer_id. This is only used to use in another function to get
// more detailed info about each beer.
/* Choco: Did you mean that this is just a function for checking against the stock?
If so, change the comment above to reflect this purpose.
And it doesn't seem only used with the function getDetailedBeers ().
When users load the menu page, it will return beers in the menu
after checking the inventory, which will show available beers.*/
// Could add an option to only add if the inventory is higher than a certain amount
// Choco: Agree with the threshold setting.
function getBeers() {
    var beers = [];
    var response = JSON.parse(HTTPGetRequest("action=inventory_get"));
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
        var response = JSON.parse(HTTPGetRequest("action=beer_data_get&beer_id=" + beers[i].toString()));
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

/*Choco: I don't understand the code below, could you explain in the meeting? Sorting based on string length?*/
function sortBeverageByType () {
    var detailedBeers = getDetailedBeers();
    var len = detailedBeers.length;

    // Not sure how to get a good length on all arrays. Maybe temporary arrays, then make new ones with correct length?
    var lagers = Create2DArray(len);
    var ales = Create2DArray(len);
    var porterStout = Create2DArray(len);
    var alcFree = Create2DArray(len);
    var whiteWine = Create2DArray(len); // Choco: it can be commented out for future use
    var redWine = Create2DArray(len); // Choco: it can be commented out for future use
    var ciders = Create2DArray(len); // Choco: it can be commented out for future use
    var otherBeverages = Create2DArray(len); // Choco: it can be commented out for future use

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
        else if (type.substring(0, 11) == "Alkoholfritt") {
            temp = alcFree.length;
            alcFree[temp] = detailedBeers[i];
        }
        else if (type.substring(0, 7) == "Vitt vin") {
            temp = whiteWine.length;
            whiteWine[temp] = detailedBeers[i];
        }
        else if (type.substring(0, 7) == "Rött vin") {
            temp = redWine.length;
            redWhine[temp] = detailedBeers[i];
        }
        else if (type.substring(0, 4) == "Cider") {
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

// inventory_append&beer_id=?&amount=?&price=?
// Amount:

// Takes a list of beer_id's and amount (2d structure, should be [[beer_id,amount],[beer_id,amount]..]), together with user
// Since we can't send an amount, we have to send the HTTP Get for each beer. The amount of times this is done
// is controlled by the second column in beerarray.
// Choco: Is it necessary to define beerarray and user first?
function addPurchase(beerarray, user) {
    for (var i = 0; i < beerarray.length; i++) {
        var beer_id = beerarray[i][0];
        var amt = beerarray[i][1];
        for (var i = 0; i < amt; i++) {
            HTTPGetRequest("action=purchases_append&beer_id=" + beer_id + "&username=" + user.uname + "&password=" + user.pword);
        }
    }
}