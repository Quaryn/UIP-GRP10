/**
 * Created by hullberg on 20/02/17.
 */


//This will make a HTTP GET request, where we request to get the info from URL
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