<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/7/2017
 * Time: 1:44 AM
 */

require '../lib/site.inc.php';
$controller = new Felis\UserController($site, $user, $_POST);
header("location: " . $controller->getRedirect());