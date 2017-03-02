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

    // Read the data from our translation-file
    $.getJSON("translations.json", function( json ) {

        // the word in JSON we will look at, as for example one item will be
        // ['language']['sv']['Welcome','Welcome to the Flying Dutchman']
        words = json['language'][lang]


        // for each item in 'lang'-specified language, we will use key to find the HTML element, and set the text to value.
        $.each(words, function (key, value) {

            document.getElementById(key).innerText = value;

        });

    });


}