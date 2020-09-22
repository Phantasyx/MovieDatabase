<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/6/2017
 * Time: 12:53 AM
 */

namespace Felis;


class ClientCaseController
{


    public function __construct(Site $site, User $user, array $post) {

        $root = $site->getRoot();
        $this->site = $site;
        $cases = new Cases($this->site);
        $all = $cases->getCases();
        if(isset($post['id'])) {
            $id = strip_tags($post['id']);
            $case = $cases->get($id);
            $client = $case->getClient();
            $clientName = $case->getClientName();
            $number = strip_tags($post['number']);
            $summary = strip_tags($post['summary']);
            $agent = strip_tags($post['agent']);
            $agentName = $case->getAgentName();
            $status = strip_tags($post['status']);
            $row = array(
                "id" => $id,
                "client" => $client,
                "clientName" => $clientName,
                "number" => $number,
                "summary" => $summary,
                "agent" => $agent,
                "agentName" => $agentName,
                "status" => $status
            );
            $newCase = new ClientCase($row);
        }
        $this->redirect = "$root/cases.php";
    }

    public function getRedirect()
    {
        return $this->redirect;
    }

    public function setRedirect($redirect){
        $this->redirect = $redirect;
    }
    private $redirect;
}
