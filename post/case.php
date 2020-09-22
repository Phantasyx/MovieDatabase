<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/6/2017
 * Time: 5:29 PM
 */

require '../lib/site.inc.php';
$controller = new Felis\ClientCaseController($site,$_GET, $_POST,$_SESSION);
header("location: " . $controller->getRedirect());