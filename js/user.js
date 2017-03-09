/**
 * Created by hullberg on 20/02/17.
 */

function User(uid, cred, uname, pword, firstname, lastname, email, phone) {
    this.uid = uid;
    this.cred = cred;
    this.uname = username;
    this.pword = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
}

// In case we want to register a new user. In the future.
// http://pub.jamaica-inn.net/fpdb/api.php?action=user_edit&new_username=johhul&new_password=johhul&first_name=johan&
// last_name=hullberg&email=test@test.com&phone=999&username=ervtod&password=ervtod
/*function registerUser(user) {
    var uname = user.uname;
    var pword = user.pword;
    var fname = user.firstname;
    var lname = user.lastname;
    var email = user.email;
    var phone = user.phone;
    // Will use the ervtod-admin account to add a new user to the database
    var response = JSON.parse(HTTPGetRequest("user_edit&new_username=" + uname + "&new_password=" + pword + "&first_name" + fname + "&last_name=" + lname + "&email=" + email + "&phone=" + phone + "&username=ervtod&password=ervtod"));

    if (response["type"] == "User " + uname + " added") {
        // User successfully created

    }
    else {
        // Something went wrong

    }
}*/



function userInDB(uname) {
    var response = HTTPGetRequest("&action=user_get_all&username=ervtod&password=ervtod");
    for (var i = 0; i < response.payload.length; i++) {
        if (uname == response.payload[i]["username"]) {
            return true;
        }
    }
    return false;
}

//{"user_id" : "107","credentials" : "3","password" : "d41d8cd98f00b204e9800998ecf8427e","username" : "",
// "first_name" : "","last_name" : "","email" : "","phone" : ""}
// I think credentials is the role of the user, 0 seems to be admin, 3 regular user. Can only find 0 & 3.

function loginAttempt() {
    var uname = document.getElementById("username").value;
    var pword = document.getElementById("password").value;
    var md5pword = md5(pword);
    //console.log(uname);
    //console.log(md5pword);
    // Use admin ervtod to look through all users, and if there is any user that matches this attempt.
    var response = HTTPGetRequest("&action=user_get_all&username=saskru&password=saskru");

    for (var i = 0; i < response.payload.length; i++) {
        if (uname == response.payload[i]["username"] && md5pword == response.payload[i]["password"]) {
            // Success
            var user = new User();
            user.uid = response.payload[i]["user_id"];
            user.cred = response.payload[i]["credentials"];
            user.uname = uname;
            user.password = pword;
            user.firstname = response.payload[i]["first_name"];
            user.lastname = response.payload[i]["last_name"];
            user.email = response.payload[i]["email"];
            user.phone = response.payload[i]["phone"];

            // Keep track of user with localstorage and move to next page
            localStorage.setItem("username",user.uname);
            localStorage.setItem("password",user.password);
            localStorage.setItem("credentials",user.cred);
            //window.location.pathname = '/menu.html';
            window.location = 'http://localhost:63342/UIP-GRP10/menu.html?_ijt=5886dcj0llaoik11mq9m4lgu17';
            /*console.log(localStorage.getItem("username"));
            console.log(localStorage.getItem("password"));
            console.log(localStorage.getItem("credentials"));*/


        }
        /* This made an alert for each user in the database, heh
        else {
            // Failure
            if (uname == response.payload[i]["username"]) {
                alert("User exists, wrong password");
                // Choco: Changed to "The password is wrong"?
            }
            else {alert("User is not in database");}
            // Choco: Changed to "The username is wrong"?
        }*/
    }
}

// {"type" : "iou_get", "payload" : [{"user_id" : "24","first_name" : "Ervin","last_name" : "Todd","assets" : "-1090"}]}
function getDebt(user) {
    var response = HTTPGetRequest("&action=iou_get&username=" + user.uname + "&password=" + user.pword);
    var listOfDebts = [];
    for (var i = 0; i < response.payload.length; i++) {
        listOfDebts.push(response.payload[i]["assets"]);
    }
    return listOfDebts;
}

// {"type" : "payments_get_all", "payload" : [{"transaction_id" : "191","user_id" : "24","admin_id" : "25",
// "amount" : "500","timestamp" : "2014-10-03 17:47:48"}]}
function getPayments(user) {
    var response = HTTPGetRequest("&action=payments_get&username=" + user.uname + "&password=" + user.pword);
    var len = response.payload.length;
    var listOfPayments = Create2DArray(len);
    for (var i = 0; i < len; i++) {
        listOfPayments[i][0] = response.payload[i]["transaction_id"];
        listOfPayments[i][1] = response.payload[i]["user_id"];
        listOfPayments[i][2] = response.payload[i]["admin_id"];
        listOfPayments[i][3] = response.payload[i]["amount"];
        listOfPayments[i][4] = response.payload[i]["timestamp"];
    }
    return listOfPayments;
}