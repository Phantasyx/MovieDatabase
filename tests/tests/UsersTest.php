<?php
require __DIR__ . "/../../vendor/autoload.php";

/** @file
 * @brief Empty unit testing template/database version
 * @cond 
 * @brief Unit tests for the class 
 */
class EmailMock extends Felis\Email {
    public function mail($to, $subject, $message, $headers)
    {
        $this->to = $to;
        $this->subject = $subject;
        $this->message = $message;
        $this->headers = $headers;
    }

    public $to;
    public $subject;
    public $message;
    public $headers;
}

class UsersTest extends \PHPUnit_Extensions_Database_TestCase
{
    private static $site;

    public static function setUpBeforeClass() {
        self::$site = new Felis\Site();
        $localize  = require 'localize.inc.php';
        if(is_callable($localize)) {
            $localize(self::$site);
        }
    }
	/**
     * @return PHPUnit_Extensions_Database_DB_IDatabaseConnection
     */
    public function getConnection()
    {
        return $this->createDefaultDBConnection(self::$site->pdo(), 'hilljor2');
    }
    public function test_construct() {
        $users = new Felis\Users(self::$site);
        $this->assertInstanceOf('Felis\Users', $users);
    }
    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    /**
     * @return PHPUnit_Extensions_Database_DataSet_IDataSet
     */
    public function getDataSet()
    {
        return $this->createFlatXMLDataSet(dirname(__FILE__) . '/db/user.xml');
    }
    public function test_login() {
        $users = new Felis\Users(self::$site);

        // Test a valid login based on email address
        $user = $users->login("dudess@dude.com", "87654321");
        $this->assertInstanceOf('Felis\User', $user);
        $this->assertContains("Dudess", $user->getName());
        $this->assertContains("111-222-3333", $user->getPhone());
        $this->assertContains("Dudess", $user->getAddress());
        $this->assertContains("Dudess", $user->getNotes());

       $this->assertEquals("1421988626", $user->getJoined());
        $this->assertContains("S", $user->getRole());




        // Test a valid login based on email address
        $user = $users->login("cbowen@cse.msu.edu", "super477");
        $this->assertInstanceOf('Felis\User', $user);

        // Test a failed login
        $user = $users->login("dudess@dude.com", "wrongpw");
        $this->assertNull($user);

    }

    public function test_get(){
        $users = new Felis\Users(self::$site);

        $user = $users->get(7);

        $this->assertInstanceOf('Felis\User', $user);
        $this->assertContains("Dudess",$user->getName());
        $this->assertContains("111-222-3333",$user->getPhone());
        $this->assertContains("Dudess",$user->getAddress());
        $this->assertContains("Dudess",$user->getNotes());

        $this->assertEquals(1421988626,$user->getJoined());
        $this->assertContains("S",$user->getRole());



    }
    public function test_update(){
        $users = new Felis\Users(self::$site);

        $user = $users->get(7);

        $user->setEmail("test@msu.edu");
        $user->setAddress("testing");
        $user->setName("joe");
        $user->setNotes("CSE477");
        $user->setPhone("1231231234");
        $user->setRole("S");

        $this->assertTrue($users->update($user));

        $row = array('id' => 13,
            'email' => 'asdf@gmail.com',
            'name' => 'Biden, Joe',
            'phone' => '5555555555',
            'address' => 'leduch',
            'notes' => 'testing',
            'password' => 'asdfasdf',
            'joined' => '2017-02-15 22:41:13',
            'role' => 'A'
        );

        $hackuser = new Felis\User($row);

        $this->assertFalse($users->update($hackuser));

        $hackuser->setEmail("cbowen@cse.msu.edu");

        $this->assertFalse($users->update($hackuser));

    }
    public function test_getClients() {
        $users = new Felis\Users(self::$site);

        $clients = $users->getClients();

        $this->assertEquals(2, count($clients));
        $c0 = $clients[0];
        $this->assertEquals(2, count($c0));
        $this->assertEquals(9, $c0['id']);
        $this->assertEquals("Simpson, Bart", $c0['name']);
        $c1 = $clients[1];
        $this->assertEquals(10, $c1['id']);
        $this->assertEquals("Simpson, Marge", $c1['name']);
    }
}

/// @endcond
?>
