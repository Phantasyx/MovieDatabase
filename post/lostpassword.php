<?php
$open = true;
require '../lib/site.inc.php';
$controller = new Felis\LostPasswordController($site, $_POST);
header("location: " . $controller->getRedirect());