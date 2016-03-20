<?php

use tests\codeception\_pages\SignupPage;

/* @var $scenario Codeception\Scenario */

$I = new FunctionalTester($scenario);
$I->wantTo('ensure that login works');

$signupPage = SignupPage::openBy($I);

$I->see('Signup', 'h1');

$I->amGoingTo('try to signup with empty data');
$signupPage->signup('', '', '');
$I->expectTo('see validations errors');
$I->see('Username cannot be blank.');
$I->see('Email cannot be blank.');
$I->see('Password cannot be blank.');

$I->amGoingTo('try to signup with wrong data');
$signupPage->signup('admi%^', 'test', 'test1');
$I->see('Your username can only contain alphanumeric characters, underscores and dashes.');
$I->see('Email is not a valid email address.');
$I->see('Password should contain at least 6 characters.');
$I->expectTo('see validations errors');

$I->amGoingTo('try to signup with correct data');
$signupPage->signup('operator', 'operator@granat-digital.ru', 'operator');
$I->expectTo('see operator already been taken');
$I->see('This username has already been taken.');
