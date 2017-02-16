<?php

class RouterController extends Controller {


  protected $controller;

  function __construct($url) {

    //In this case the first element in the $url array is the "home" url, the second
    //element is where they want to go.


    if (empty($url[1])) {
      $this->controller = new HomeController($url); //go to home if it's the base url i.e. if there isn't anything after "localhost/UIP" in the URL;
      exit;
    }

    //I'll make it's first letter uppercase to find the right file, adding "Controller" to make it *View*+Controller

    $controllerClass = ucwords($url[1]) . 'Controller';

    if (file_exists('controllers/' . $controllerClass . '.php')) { //If above file exists, open the right controller.

      $this->controller = new $controllerClass($url);


    } else {  //else an error has occured, e.g. they have entered an unexisting URL, in which case it's a 404.

      $this->controller = new ErrorController($url);


    }

  }


}



?>
