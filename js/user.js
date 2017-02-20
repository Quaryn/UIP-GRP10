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
    var response = JSON.parse(HTTPGetRequest("action=user_get_all&username=ervtod&password=ervtod"));
    for (var i = 0; i < response["payload"].length; i++) {
        if (uname == response["payload"][i]["username"]) {
            return true;
        }
    }
    else {return false};
}

//{"user_id" : "107","credentials" : "3","password" : "d41d8cd98f00b204e9800998ecf8427e","username" : "",
// "first_name" : "","last_name" : "","email" : "","phone" : ""}
// I think credentials is the role of the user, 0 seems to be admin, 3 regular user. Can only find 0 & 3.

function loginAttempt(uname, pword) {
    // Use admin ervtod to look through all users, and if there is any user that matches this attempt.
    var response = JSON.parse(HTTPGetRequest("action=user_get_all&username=ervtod&password=ervtod"));
    for (var i = 0; i < response["payload"].length; i++) {
        if (uname == response["payload"][i]["username"] && pword == response["payload"][i]["password"]) {
            // Success
            var user = new User();
            user.uid = response["payload"][i]["user_id"];
            user.cred = response["payload"][i]["credentials"];
            user.uname = response["payload"][i]["username"];
            user.password = response["payload"][i]["password"];
            user.firstname = response["payload"][i]["first_name"];
            user.lastname = response["payload"][i]["last_name"];
            user.email = response["payload"][i]["email"];
            user.phone = response["payload"][i]["phone"];

            // Keep track of user with localstorage

        }
        else {
            // Failure
            if (uname == response["payload"][i]["username"]) {
                alert("User exists, wrong password");
            }
            else {alert("User is not in database");}
        }
    }
}