<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/7/2017
 * Time: 9:55 PM
 */

namespace Felis;


class LostPasswordController
{
    public function __construct(Site $site, array $post) {
        $this->site = $site;
        $root = $site->getRoot();
        $users = new Users($site);
        $email = strip_tags($post['email']);
        if ($users->exists($email)) {
            $this->sendNewEmail($email);
        }
        $this->redirect = "$root/";
    }
    public function sendNewEmail($email) {
        $users = new Users($this->site);
        $mailer = new Email();
        $userid = $users->getIdFromEmail($email);
        $validators = new Validators($this->site);
        $validator = $validators->newValidator($userid);


        $link = "http://webdev.cse.msu.edu"  . $this->site->getRoot() .
            '/password-validate.php?v=' . $validator;
        $from = $this->site->getEmail();
        $subject = "Reset password";
        $message = <<<MSG
<html>
<p>Your Password has been reset, Click Here to change it.</p>
<p><a href="$link">$link</a></p>
</html>
MSG;
        $headers = "MIME-Version: 1.0\r\nContent-type: text/html; charset=iso=8859-1\r\nFrom: $from\r\n";
        $mailer->mail($email, $subject, $message, $headers);
    }
    private $redirect;
    private $site;
    /**
     * @return string
     */
    public function getRedirect()
    {
        return $this->redirect;
    }
}
