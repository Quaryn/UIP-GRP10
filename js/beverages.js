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

function beverage(nr, artid, vnr, pname, price, volume, pgroup, container, seal, origin, originCountry, producer, distributor, alcohol) {
    this.nr = nr;
    this.artid = artid;
    this.vnr = vnr;
    this.pname = pname;
    this.price = price;
    this.volume = volume;
    this.pgroup = pgroup;
    this.container = container;
    this.seal = seal;
    this.origin = origin;
    this.originCountry = originCountry;
    this.producer = producer;
    this.distributor = distributor;
    this.alcohol = alcohol;

}


// We use it here and user.js
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
// As it says in the comment above, this function is solely used to retrieve the beer_id's that exist. What you do
// with this information can vary. So it shouldn't change.
// Could add an option to only add if the inventory is higher than a certain amount
// Choco: Agree with the threshold setting.
function getBeers() {
    var beers = [];
    var response = HTTPGetRequest("&action=inventory_get");
    for (var i = 0; i < response.payload.length; i++) {
        // if (response["payload"][i]["count"] > 5)
        beers.push(response.payload[i]["beer_id"]);
    }
    return beers;
}


// For each item in getBeers, get the more detailed version of the beer.
function getDetailedBeers() {
    var beers = getBeers(); // An array containing beer_id's
    // We want one row for each beer_id, no need to specify columns.
    var detailedBeers = [];
    for (var i = 0; i < beers.length; i++) {
        var response = HTTPGetRequest("&action=beer_data_get&beer_id=" + beers[i].toString());

        var nr = response.payload[i]["nr"];
        var artnr = response.payload[i]["artikelid"];
        var vnr = response.payload[i]["varnummer"];
        var pname = response.payload[i]["namn"] + " " + response.payload[i]["namn2"];
        var price = response.payload[i]["prisinklmoms"];
        var volume = response.payload[i]["volymiml"];
        var pgroup = response.payload[i]["varugrupp"];
        var container = response.payload[i]["forpackning"];
        var seal = response.payload[i]["forslutning"];
        var origin = response.payload[i]["ursprung"];
        var originCountry = response.payload[i]["ursprunglandnamn"];
        var producer = response.payload[i]["producent"];
        var distributor = response.payload[i]["leverantor"];
        var alcohol = response.payload[i]["alkoholhalt"];

        var bev = new beverage(nr,artnr,vnr,pname,price,volume,pgroup,container,seal,origin,originCountry,producer,distributor,alcohol);
        detailedBeers.push(bev);
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
    
    var lagers = [];
    var ales = [];
    var porterStout = [];
    var alcFree = [];
    var whiteWine = []; // Choco: it can be commented out for future use // Or not
    var redWine = []; // Choco: it can be commented out for future use
    var ciders = []; // Choco: it can be commented out for future use
    var otherBeverages = []; // Choco: it can be commented out for future use

    for (var i = 0; i < len; i++) {
        var type = detailedBeers[i].pgroup;
        if (type == "Öl, Ljus lager") {
            lagers.push(detailedBeers[i]);
        }
        else if (type == "Öl, Ale") {
            ales.push(detailedBeers[i]);
        }
        else if (type == "Öl, Porter och Stout") {
            porterStout.push(detailedBeers[i]);
        }
        else if (type.substring(0, 11) == "Alkoholfritt") {
            alcFree.push(detailedBeers[i]);
        }
        else if (type.substring(0, 7) == "Vitt vin") {
            whiteWine.push(detailedBeers[i]);
        }
        else if (type.substring(0, 7) == "Rött vin") {
            redWine.push(detailedBeers[i]);
        }
        else if (type.substring(0, 4) == "Cider") {
            ciders.push(detailedBeers[i]);
        }
        else {
            otherBeverages.push(detailedBeers[i]);
        }
    }


    // Now we just need to get these arrays to the site

}

// TODO
// Takes a list of beer_id's and amount (2d structure, should be [[beer_id,amount],[beer_id,amount]..]), together with user
// Since we can't send an amount, we have to send the HTTP Get for each beer. The amount of times this is done
// is controlled by the second column in beerarray.
// Choco: Is it necessary to define beerarray and user first?
// Yes, it will be when we use the order to send it to the API. IN PROGRESS is important to point out.
function addPurchase(beerarray, user) {
    for (var i = 0; i < beerarray.length; i++) {
        var beer_id = beerarray[i][0];
        var amt = beerarray[i][1];
        for (var i = 0; i < amt; i++) {
            HTTPGetRequest("&action=purchases_append&beer_id=" + beer_id + "&username=" + user.uname + "&password=" + user.pword);
        }
    }
}