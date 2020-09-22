<?php
$open = true;		// Can be accessed when not logged in
require '../lib/site.inc.php';

unset($_SESSION['user']);
header("location: " . "../$root");
