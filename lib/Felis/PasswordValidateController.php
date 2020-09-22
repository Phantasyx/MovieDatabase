<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/7/2017
 * Time: 11:29 PM
 */

namespace Felis;


class PasswordValidateController
{

    public function __construct(Site $site, array $post) {
        $root = $site->getRoot();
        if (isset($post['cancel'])) {
            echo "cancel";
            return;
        }
        $validators = new Validators($site);
        $userid = $validators->getOnce($post['validator']);
        if($userid === null) {
            echo "cant find user";
            return;
        }
        $users = new Users($site);
        $editUser = $users->get($userid);
        if($editUser === null) {
            echo "Unable to find User";
            return;
        }
        $email = trim(strip_tags($post['email']));
        if($email !== $editUser->getEmail()) {
            echo "invalid email";

            return;
        }
        $password1 = trim(strip_tags($post['password']));
        $password2 = trim(strip_tags($post['password2']));
        if($password1 !== $password2) {
            echo "passwords do not match";

            return;
        }
        if(strlen($password1) < 8) {
            echo "password must be at least 8 Characters.";

            return;
        }
    }
    private $redirect;
    /**
     * @return string
     */
    public function getRedirect()
    {
        return $this->redirect;
    }
}