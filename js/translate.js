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

function translate(lang, string) {
    // Lookup in the JSON-file what the word is in a certain language

    // json is the item we get from translations.json
    $.getJSON("translations.json", function( json ) {

        // the word in JSON we will look at, as for example one item will be
        // ['language']['sv']['Welcome','Welcome to the Flying Dutchman']
        word = json['language'][lang][string];
        // We want the value, after entering the key.



        // $("." + key).text(val);
    });


}