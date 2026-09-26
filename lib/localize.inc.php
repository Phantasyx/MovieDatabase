<?php
/**
 * Local configuration. Credentials are read from the environment.
 * The portfolio demo in /demo does not use this file.
 *
 * FELIS_DB_DSN, FELIS_DB_USER, and FELIS_DB_PASSWORD must all be set
 * before the legacy PHP app will open a database connection.
 *
 * @param Felis\Site $site
 */
return function(Felis\Site $site) {
    date_default_timezone_set(getenv('FELIS_TIMEZONE') ?: 'America/Detroit');
    $site->setEmail(getenv('FELIS_EMAIL') ?: 'demo@felis.invalid');
    $site->setRoot(getenv('FELIS_ROOT') ?: '');

    $dsn = getenv('FELIS_DB_DSN');
    $user = getenv('FELIS_DB_USER');
    $password = getenv('FELIS_DB_PASSWORD');
    $prefix = getenv('FELIS_DB_PREFIX');
    if ($prefix === false || $prefix === '') {
        $prefix = 'felis_';
    }

    if ($dsn && $user && $password !== false && $password !== '') {
        $site->dbConfigure($dsn, $user, $password, $prefix);
    }
};
