<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 3/29/2017
 * Time: 4:00 AM
 */

namespace Felis;


class Site
{
    private $email = '';
    public function dbConfigure($host, $user, $password, $prefix) {
        $this->dbHost = $host;
        $this->dbUser = $user;
        $this->dbPassword = $password;
        $this->tablePrefix = $prefix;
    }
    /**
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    ///< Site owner email address

    /**
     * Database connection function
     * @returns PDO object that connects to the database
     */
    function pdo() {
        // This ensures we only create the PDO object once
        if($this->pdo !== null) {
            return $this->pdo;
        }

        try {
            $this->pdo = new \PDO($this->dbHost, $this->dbUser, $this->dbPassword);
        } catch(\PDOException $e) {
            // If we can't connect we die!
            die("Unable to select database");
        }

        return $this->pdo;
    }
    /**
     * @return string
     */
    public function getTablePrefix()
    {
        return $this->tablePrefix;
    }  ///< Database table prefix
    private $root = '';

    /**
     * @return string
     */
    public function getRoot()
    {
        return $this->root;
    }

    /**
     * @param string $root
     */
    public function setRoot($root)
    {
        $this->root = $root;
    }         ///< Site root
    /**
     * Configure the database
     * @param $host
     * @param $user
     * @param $password
     * @param $prefix
     */



    private $dbHost = null;     ///< Database host name
    private $dbUser = null;     ///< Database user name
    private $dbPassword = null; ///< Database password
    private $tablePrefix = '';
    private $pdo = null; ///< The PDO object
}