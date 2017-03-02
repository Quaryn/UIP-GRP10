/**
 * Created by hullberg on 08/02/17.
 */
function docLoaded(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

var json = {"language" : {
    "eng" : {"welcome" : "Welcome to The Flying Dutchman",
            "order" : "Order",
            "beverages" : "Beverages",
            "login" : "Log in",
            "banner" : "Flying Dutchman"},
    "sv" : {"welcome" : "Välkommen till Flygande Holländaren",
            "order" : "Beställ",
            "beverages" : "Drycker",
            "login" : "Logga in",
            "banner": "Flygande Holländaren"}}
};




// All items that should be translated should belong to same class, and their key and value should exist in translations.json
function transl(lang) {

        // the word in JSON we will look at, as for example one item will be
        // ['language']['sv']['Welcome','Welcome to the Flying Dutchman']
        words = json['language'][lang];
        //console.log(words);

        // for each item in 'lang'-specified language, we will use key to find the HTML element, and set the text to value.
        $.each(words, function (key, value) {
            //document.getElementById(key.toString()).text = value.toString(); Use jquery instead
            // $("#" + key) will look for elements that have the ID = key
            // Then we set the text of that object to value.
            $("#" + key).text(value);

        });
}