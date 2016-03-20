<?php

/* @var $scenario Codeception\Scenario */

$I = new FunctionalTester($scenario);
$I->wantTo('ensure that home page works');
$I->amOnPage(Yii::$app->homeUrl);

$I->see('Scriptovichkof');
$I->see('Signup');
$I->seeLink('Login');

$I->click('Signup');
$I->see('Signup');
