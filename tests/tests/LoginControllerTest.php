<?php
require __DIR__ . "/../../vendor/autoload.php";

/** @file
 * @brief Empty unit testing template/database version
 * @cond 
 * @brief Unit tests for the class 
 */

class LoginControllerTest extends \PHPUnit_Extensions_Database_TestCase
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
        return $this->createDefaultDBConnection(self::$site->pdo(), getenv('FELIS_DB_NAME') ?: 'felis');
    }
    public function test_construct() {
        $session = array();	// Fake session
        $root = self::$site->getRoot();

        // Unknown credentials stay signed out. Known course passwords are not stored in this repo.
        $controller = new Felis\LoginController(self::$site, $session,
            array("email" => "bart@bartman.com", "password" => "not-a-password"));

        $this->assertNull($session[Felis\User::SESSION_NAME]);
        $this->assertEquals("$root/login.php?e", $controller->getRedirect());
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


}

/// @endcond
?>
