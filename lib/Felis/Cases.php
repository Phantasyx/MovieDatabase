<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/3/2017
 * Time: 12:43 AM
 */

namespace Felis;


class Cases extends Table
{

    public function __construct(Site $site) {
        parent::__construct($site,"clientcase");
        $this->site = $site;
    }


    public function update($id,$number,$summary,$agent,$status){
        $sql = <<<SQL
update $this->tableName
set number=?, summary=?,agent=?,status=?
WHERE id=?
SQL;
        $pdo = $this->pdo();
        $statement = $pdo->prepare($sql);
        $statement->execute(array($number,$summary,$agent,$status,$id));

    }


    public function checkID($id){
        $sql = <<<SQL
SELECT *
FROM s8_clientcase
WHERE number=?
SQL;
        $pdo = $this->pdo();
        $statement = $pdo->prepare($sql);
        $statement->execute(array($id));
        if($statement->rowCount() === 0) {
            return false;
        }
        return false;
    }
    public function delete($id){
        $sql = <<<SQL
delete from s8_clientcase
where id=?
SQL;
        $pdo = $this->pdo();
        $statement = $pdo->prepare($sql);
        $statement->execute(array($id));
    }


    public function insert($client, $agent, $number) {
        $sql = <<<SQL
insert into $this->tableName(client, agent, number, summary, status)
values(?, ?, ?, "", "")
SQL;
        $pdo = $this->pdo();
        $statement = $pdo->prepare($sql);
        try {
            if($statement->execute(array($client, $agent, $number)) === false) {
                return null;
            }
        } catch(\PDOException $e) {
            return null;
        }
        return $pdo->lastInsertId();
    }


    public function getCases(){
        $users = new Users($this->site);
        $usersTable = $users->getTableName();
        $sql = <<<SQL
select distinct c.id, c.client, client.name as clientName,
       c.agent, agent.name as agentName,
       number, summary, status
from $usersTable as client, $usersTable as agent
inner join $this->tableName AS c
on c.agent=agent.id
where c.client = client.id
order by status desc, number
SQL;
        $pdo = $this->pdo();
        $statement = $pdo->prepare($sql);
        $statement->execute();
        if($statement->rowCount() === 0) {
            return array();
        }
        $cases = $statement->fetchAll(\PDO::FETCH_ASSOC);
        $casesArray = array();
        foreach($cases as $case){
            $clientcase = new ClientCase($case);
            array_push($casesArray,$clientcase);
        }
        return $casesArray;
    }


    public function get($id) {
        $users = new Users($this->site);
        $usersTable = $users->getTableName();

        $sql = <<<SQL
SELECT c.id, c.client, client.name as clientName,
       c.agent, agent.name as agentName,
       number, summary, status
from $this->tableName c,
     $usersTable client,
     $usersTable agent
where c.client = client.id and
      c.agent=agent.id and
      c.id=?
SQL;

        $pdo = $this->pdo();
        $statement = $pdo->prepare($sql);
        $statement->execute(array($id));
        if($statement->rowCount() === 0) {
            return null;
        }
        return new ClientCase($statement->fetch(\PDO::FETCH_ASSOC));
    }


    public function fetchID($caseNum){
        $sql = <<<SQL
SELECT id
FROM  s8_clientcase
WHERE number=?
SQL;

        $pdo = $this->pdo();
        $statement = $pdo->prepare($sql);
        $statement->execute(array($caseNum));
        if($statement->rowCount() === 0) {
            return null;
        }

        $stuff = $statement->fetch(\PDO::FETCH_ASSOC);
        return $stuff['id'];
    }
    protected $site;
}