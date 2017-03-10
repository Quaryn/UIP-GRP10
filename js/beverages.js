/**
 * Created by hullberg on 09/02/17.
 */

// http://pub.jamaica-inn.net/fpdb/api.php?username=saskru&password=saskru&action=beer_data_get&beer_id=604504 gives:
// {"type" : "beer_data_get", "payload" : [{"nr" : "604504","artikelid" : "9925","varnummer" : "6045",
// "namn" : "Black Tower","namn2" : "Rivaner","prisinklmoms" : "29.00","volymiml" : "","prisperliter" : "",
// "saljstart" : "1996-04-01","slutlev" : " ","varugrupp" : "Vitt vin,  Druvigt & Blommigt","forpackning" : "Flaska",
// "forslutning" : "Skruvkapsyl","ursprung" : "Rheinhessen","ursprunglandnamn" : "Tyskland",
// "producent" : "Reh Kendermann","leverantor" : "Hermansson & Co AB","argang" : "2013","provadargang" : "2013",
// "alkoholhalt" : "8.5%","modul" : "","sortiment" : "FS","ekologisk" : "0","koscher" : "0"}]}

function Beverage(nr, artid, vnr, pname, price, volume, pgroup, container, seal, origin, originCountry, producer, distributor, alcohol) {
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
// Could add an option to only add if the inventory is higher than a certain amount
function getBeers() {
    var beers = [];
    var response = HTTPGetRequest("&action=inventory_get");
    for (var i = 0; i < response.payload.length; i++) {
        // if (response["payload"][i]["count"] > 5)
        if (response.payload[i]["namn"] != "") {
            beers.push(response.payload[i]["beer_id"]);
        }
    }
    //displaySorted(beers);
    return beers;
}


// For each item in getBeers, get the more detailed version of the beer.
function getDetailedBeers() {
    var beers = getBeers(); // An array containing beer_id's
    // We want one row for each beer_id, no need to specify columns.

    var detailedBeers = [];
    for (var i = 0; i < beers.length; i++) {
        var response = HTTPGetRequest("&action=beer_data_get&beer_id=" + beers[i].toString());


        if (response.payload.length > 0) {

            var nr = response.payload[0]["nr"];
            var artnr = response.payload[0]["artikelid"];
            var vnr = response.payload[0]["varnummer"];
            var pname = response.payload[0]["namn"] + " " + response.payload[0]["namn2"];
            var price = response.payload[0]["prisinklmoms"];
            var volume = response.payload[0]["volymiml"];
            var pgroup = response.payload[0]["varugrupp"];
            var container = response.payload[0]["forpackning"];
            var seal = response.payload[0]["forslutning"];
            var origin = response.payload[0]["ursprung"];
            var originCountry = response.payload[0]["ursprunglandnamn"];
            var producer = response.payload[0]["producent"];
            var distributor = response.payload[0]["leverantor"];
            var alcohol = response.payload[0]["alkoholhalt"];

            var bev = new Beverage(nr, artnr, vnr, pname, price, volume, pgroup, container, seal, origin, originCountry, producer, distributor, alcohol);
            detailedBeers.push(bev);

        }
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
    
    var lagers = [];
    var ales = [];
    var porterStout = [];
    var alcFree = [];
    var whiteWine = [];
    var redWine = [];
    var ciders = [];
    var otherBeverages = [];

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

    displaySorted(lagers,"#beers");
    displaySorted(ales, "#beers");
    displaySorted(porterStout, "#beers");
    displaySorted(alcFree, "#alcfrees");
    displaySorted(whiteWine, "#wines");
    displaySorted(redWine, "#wines");
    displaySorted(ciders, "#ciders");
    displaySorted(otherBeverages, "#others");


}


