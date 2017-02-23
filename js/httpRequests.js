/**
 * Created by hullberg on 20/02/17.
 */


//This will make a HTTP GET request, where we request to get the info from URL
//redid with jquery, use JSON.stringify to convert data to string.
// not asynchronus, if someone wants to try to make it so, go ahead ;)

function HTTPGetRequest(theAction) {
    var jsonAPI = "http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod" + theAction;

    var jVar;

    $.ajax({
        url: jsonAPI,
        dataType: 'json',
        async: false,
        success: function(json) {
            jVar = json;
        }
    });

    return jVar;
}
