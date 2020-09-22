<?php
require 'lib/site.inc.php';
$view = new Felis\CasesView($site, $_GET, $_SESSION);
if(!$view->protect($site,$user)){
    header("location: " . $view->getProtectRedirect());
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <?php echo $view->head(); ?>
</head>

<body>
<div class="cases">

    <?php echo

    $view->header();
    $view->present();
    $view->footer();
    ?>

</div>

</body>
</html>
