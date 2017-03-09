/**
 * Created by hullberg on 20/02/17.
 */


//This will make a HTTP GET request, where we request to get the info from URL
//redid with jquery, use JSON.stringify to convert data to string.
// not asynchronus, if someone wants to try to make it so, go ahead ;)

function HTTPGetRequest(theAction) {
    var jsonAPI = "http://pub.jamaica-inn.net/fpdb/api.php?username=saskru&password=saskru" + theAction;

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

//just returns the payload from httpgetrequest
function getDrinks() {
    var response = HTTPGetRequest("&action=inventory_get");
    return response.payload;
}

function getDetails(beer_id) {
    var response = HTTPGetRequest("&action=beer_data_get&beer_id=" + beer_id);
    return response.payload;
}
