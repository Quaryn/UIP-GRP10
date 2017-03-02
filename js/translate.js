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

// All items that should be translated should belong to same class, and their key and value should exist in translations.json
function translate(lang) {
    // Find the class, change it's language attribute to the new language
    document.getElementById("language").lang = lang;
    els = document.getElementsByClassName("language");

    // Lookup in the JSON-file what the word is in a certain language
    // json is the item we get from translations.json
    $.getJSON("translations.json", function( json ) {

        // the word in JSON we will look at, as for example one item will be
        // ['language']['sv']['Welcome','Welcome to the Flying Dutchman']
        words = json['language'][lang]
        // for each item in translations.json, we will look up the correct word.
        $.each(words, function (key, value) {
            console.log(json['language'][lang]['Welcome']);
            console.log(key);
            $("." + key).text(value);
        });

    });


}