<?php
require __DIR__ . "/../../vendor/autoload.php";

/** @file
 * @brief Empty unit testing template
 * @cond 
 * @brief Unit tests for the class 
 */
class SiteTest extends \PHPUnit_Framework_TestCase
{
	public function test1() {
		//$this->assertEquals($expected, $actual);
	}

public function test_getSet()
{
    $site = new Felis\Site();
    $site->dbConfigure("dbmango","jordan","asdf123","prefix");
    $site->setEmail("asdf@gmail.com");
    $this->assertContains("asdf@gmail.com",$site->getEmail());
    $site->setRoot("groot");

    $this->assertContains("groot",$site->getRoot());
    $this->assertContains("prefix",$site->getTablePrefix());
}
    public function test_localize() {
        $site = new Felis\Site();
        $localize = require 'localize.inc.php';
        if(is_callable($localize)) {
            $localize($site);
        }
        $this->assertEquals('test_', $site->getTablePrefix());
    }
}
/// @endcond
?>
