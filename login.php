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
<form method="post" action="post/login.php">
	<fieldset>
		<legend>Login</legend>
        <p><?php echo $view->failed();?></p>

		<p>
			<label for="email">Email</label><br>
			<input type="email" id="email" name="email" placeholder="Email">
		</p>
		<p>
			<label for="password">Password</label><br>
			<input type="password" id="password" name="password" placeholder="Password">
		</p>
		<p>
			<input type="submit" value="Log in"> <a href="lostpassword.php">Lost Password</a>
		</p>
		<p><a href="./">Felis Agency Home</a></p>

	</fieldset>
</form>

    <?php echo $view->footer(); ?>

</div>

</body>
</html>
