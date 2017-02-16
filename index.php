<?php

  //If you are going to test this it is imperative that either 1. The code is placed in a folder named "UIP" in htdocs or
  //2. The code is changed so that it reflects localhost.

  mb_internal_encoding("UTF-8");



  //automatically loads required files when they are called in the code. Not entierly sure if necessary but all the guides said
  //you shouldn't have a long list of "require(X)" at the start + I wanted to learn. (Also with testing it seems that spl_autoload_register
  //automatically functions in everything when initialised here so it IS necessary unless you want to fill the RouterController with a lot of stuff.
  function autoloadFunction($class){

    if (preg_match('/Controller$/', $class)) { //checks if Controller is a part of the $class string, regex lookup.
      require("/controllers/" . $class . ".php");
    } else {
      require("models/" . $class . ".php");
    }
  }


  spl_autoload_register("autoloadFunction");

  $url = getUrl(); //array with all elements that were separated by / in the url


  $router = new RouterController($url); //create the object that will guide us to the right controllers and views.




  function getUrl() { //this should be fairly self explanatory, it takes the URL with the / and separates at the / into an array.
    $url = array($_SERVER['REQUEST_URI'])[0];
    $parsedUrl = parse_url($url);
    $parsedUrl['path'] = ltrim($parsedUrl['path'], '/');
    $parsedUrl["path"] = trim($parsedUrl['path']);

    $explodeUrl = explode('/', $parsedUrl['path']);

    return $explodeUrl;

  }


?>
