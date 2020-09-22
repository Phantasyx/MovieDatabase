<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/7/2017
 * Time: 9:50 PM
 */

namespace Felis;


class UserController
{

    public function __construct(Site $site, User $user, array $post)
    {
        $root = $site->getRoot();
        var_dump($post);
        if (isset($post['cancel'])) {
            $this->redirect = "$root/users.php";
        }
        $users = new Users($site);

        if (isset($post['id'])) {
            $id = strip_tags($post['id']);
        } else {
            $id = 0;
        }

        $email = strip_tags($post['email']);
        $name = strip_tags($post['name']);
        $phone = strip_tags($post['phone']);
        $address = strip_tags($post['address']);
        $notes = strip_tags($post['notes']);
        switch ($post['role']) {
            case "admin":
                $role = User::ADMIN;
                break;
            case "staff":
                $role = User::STAFF;
                break;
            default:
                $role = User::CLIENT;
                break;
        }
        $row = array('id' => $id,
            'email' => $email,
            'name' => $name,
            'phone' => $phone,
            'address' => $address,
            'notes' => $notes,
            'password' => null,
            'joined' => null,
            'role' => $role
        );
        $editUser = new User($row);
        if ($id == 0) {

            $mailer = new Email();
            $users->add($editUser, $mailer);
        } else {
            $users->update($editUser);
        }
    }


    public function getRedirect()
    {
        return $this->redirect;
    }

    private $redirect;
}
