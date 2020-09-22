<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/6/2017
 * Time: 12:50 AM
 */

namespace Felis;


class NewCaseController
{
    public function __construct(Site $site, $user, $post,$session)
    {
        $root = $site->getRoot();
        $caseNum = strip_tags($post['number']);
        if(isset($post["ok"])){
            $cases = new Cases($site);
            $id = $cases->insert(strip_tags($post['client']),
                $user->getId(),
                $caseNum);
            if($id === null) {
                $this->redirect = "$root/newcase.php?e";
            } else {
                $_SESSION['client'] = $post['client'];
                $this->redirect = "$root/case.php?id=$caseNum";
            }

        }
        else if(isset($post["cancel"])){
            $this->redirect = "$root/cases.php";
        }
    }
    /**
     * @return mixed
     */
    public function getRedirect()
    {
        return $this->redirect;
    }

    public function setRedirect($redirect){
        $this->redirect = $redirect;
    }
    private $redirect;
}