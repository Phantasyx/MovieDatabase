<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 4/3/2017
 * Time: 12:43 AM
 */

namespace Felis;


class ClientCase
{
    const STATUS_OPEN = "O";	///< Case is open
    const STATUS_CLOSED = "C";	///< Case is closed
    private $id;

    public function __construct(array $row) {
        $this->id = $row['id'];
        $this->client = $row['client'];
        $this->clientName = $row['clientName'];
        $this->agent = $row['agent'];
        $this->agentName = $row['agentName'];
        $this->number = $row['number'];
        $this->summary = $row['summary'];
        $this->status = $row['status'];
    }
    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * @return mixed
     */
    public function getClientName()
    {
        return $this->clientName;
    }

    /**
     * @return mixed
     */
    public function getAgent()
    {
        return $this->agent;
    }

    /**
     * @return mixed
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @return mixed
     */
    public function getSummary()
    {
        return $this->summary;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }
    private $client;
    private $clientName;
    private $agent;
    private $number;
    private $summary;
    private $status;




}