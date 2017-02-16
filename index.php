<?php
  mb_internal_encoding("UTF-8");


  function autoloadFunction($class){

    if (preg_match('/Controller$/', $class)) {
      require("/controllers/" . $class . ".php");
    } else {
      require("models/" . $class . ".php");
    }
  }


  spl_autoload_register("autoloadFunction");

  $url = getUrl(); //array with all elements that were separated by / in the url

  $router = new RouterController($url); //create the object that will guide us




  function getUrl() {
    $url = array($_SERVER['REQUEST_URI'])[0];
    $parsedUrl = parse_url($url);
    $parsedUrl['path'] = ltrim($parsedUrl['path'], '/');
    $parsedUrl["path"] = trim($parsedUrl['path']);

    $explodeUrl = explode('/', $parsedUrl['path']);

    return $explodeUrl;

  }


?>
