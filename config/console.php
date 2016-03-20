<?php

Yii::setAlias('@tests', dirname(__DIR__) . '/tests');

$params = require(__DIR__ . '/params.php');
$db = require(__DIR__ . '/db.php');
$db_test = require(__DIR__ . '/db_test.php');

return [
    'id' => 'basic-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log', 'gii'],
    'controllerNamespace' => 'app\commands',
    'modules' => [
        'gii' => 'yii\gii\Module',
    ],
    'components' => [
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'log' => [
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => $db,
        'db_test' => $db_test,
        'authManager' => [
            'class' => 'yii\rbac\DbManager',
        ],
    ],
    'controllerMap' => [
        'migrate'=> [
            'class' => 'yii\console\controllers\MigrateController',
            'migrationPath'=> '@app/common/migrations',
        ]
    ],
    'params' => $params,
];
