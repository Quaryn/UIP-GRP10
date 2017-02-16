<?php


abstract class Controller {


  //sets up basic variables and functions that will be used by all or most Controllers.

  protected $data = array();
  protected $view = "";
  protected $head = array('title' => '', 'description' => '');


  public function renderView() {
    if ($this->view) {
      extract($this->data); //if we had run a model that got an array "data" this line would make it able to be read in the html-code.

      //The website always renders the header and the footer, if you look at the html code that gets
      //displayed on the website then it will seem like one single html-code.
      //This means that we can manipulate every aspect of the site in different files.

      require_once('views/header.html');
      require_once('views/' . $this->view . '.html');
      require_once('views/footer.html');
    }
  }

}





?>
