<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 3/29/2017
 * Time: 8:45 PM
 */

namespace Felis;


class LoginView extends View
{
    private $fail="";

public function __construct(array $session, array $get)
{

    if(isset($get['e'])){
        $this->fail = true;
    }
}



public function failed(){
    if($this->fail){
        return "Login Failed";
    }
    else {
        return '';
    }
}


}