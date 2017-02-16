<?php

class RouterController extends Controller {


  protected $controller;

  function __construct($url) {

    //In this case the first element in the $url array is the "home" url, the second
    //element is where they want to go.


    if (empty($url[1])) {
      $this->controller = new HomeController($url); //go to home if it's the base url;
      exit;
    }

    //I'll make it's first letter uppercase to find
    //the right file adding "Controller" to make it *View*+Controller

    $controllerClass = ucwords($url[1]) . 'Controller';

    if (file_exists('controllers/' . $controllerClass . '.php')) {

      $this->controller = new $controllerClass($url);


    } else {//else an error has occured

      $this->controller = new ErrorController($url);


    }

  }


}



?>
