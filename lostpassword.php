<?php
$open = true;
require 'lib/site.inc.php';
$view = new Felis\LoginView($_SESSION, $_GET);
$view->setTitle('Felis Investigations');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php echo $view->head(); ?>
</head>

<body>
<div class="login">
    <?php echo $view->header(); ?>

    <form method="post" action="post/lostpassword.php">
        <fieldset>
            <legend>Enter your email to reset your password.</legend>
            <p>
                <label for="email">Email: </label><br>
                <input type="email" id="email" name="email" placeholder="Email">
            </p>
            <p>
                <input type="submit" id="ok" name="ok" value="OK">
                <input type="submit" id="cancel" name="cancel" value="Cancel">
            </p>
            <p><a href="./">Felis Agency Home</a></p>

        </fieldset>
    </form>

    <?php echo $view->footer(); ?>

</div>

</body>
</html>