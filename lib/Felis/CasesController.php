<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/5/2017
 * Time: 11:38 PM
 */

namespace Felis;


class CasesController
{
    public function __construct(Site $site, $post)
    {
        $root = $site->getRoot();
        $id = strip_tags($post['id']);
        if(isset($post["add"])){
            $this->redirect = "$root/newcase.php";
        }
        else if(isset($post["delete"])){
            $this->redirect = "$root/deletecase.php?id=$id";
        }
        else{
            $this->redirect = "$root/cases.php";
        }
    }

    public function setRedirect($redirect){
        $this->redirect = $redirect;
    }
    public function getRedirect()
    {
        return $this->redirect;
    }


    private $redirect;
}