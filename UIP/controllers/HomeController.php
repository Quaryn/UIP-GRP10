<?php

class HomeController extends Controller {

  function __construct() {

    //When constructed calls to the function "renderView" and nothing else
    //Should be modified so it calls to related model and extracts information that renderView uses as "data"

    $this->view = 'home';
    $this->renderView();
  }



}


?>
