<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 3/29/2017
 * Time: 3:19 AM
 */

namespace Felis;


class StaffView extends View
{
    public function __construct()
    {
        $this->setTitle("Felis Investigations Staff");
        $this->addLink("./post/logout.php", "Log out");
    }
}