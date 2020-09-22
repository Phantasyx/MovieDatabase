<?php
require '../lib/site.inc.php';

$controller = new Felis\CasesController($site, $_POST);
header("location: " . $controller->getRedirect());
