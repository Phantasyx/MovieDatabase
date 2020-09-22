<?php
/**
 * Function to localize our site
 * @param $site The Site object
 */
return function(Felis\Site $site) {

// Set the time zone
    date_default_timezone_set('America/Detroit');
    $site->setEmail('hilljor2@cse.msu.edu');
    $site->setRoot('/~hilljor2/step8');
    $site->dbConfigure('mysql:host=mysql-user.cse.msu.edu;dbname=hilljor2',
        'hilljor2',       // Database user
        'jordanhill',     // Database password
        'test8_');            // Table prefix
};
