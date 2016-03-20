<?php

namespace tests\codeception\_pages;

use yii\codeception\BasePage;

/**
 * Represents login page
 * @property \AcceptanceTester|\FunctionalTester $actor
 */
class SignupPage extends BasePage
{
    public $route = 'user/site/signup';

    /**
     * @param string $username
     * @param string $email
     * @param string $password
     */
    public function signup($username, $email, $password)
    {
        $this->actor->fillField('input[name="SignupForm[username]"]', $username);
        $this->actor->fillField('input[name="SignupForm[email]"]', $email);
        $this->actor->fillField('input[name="SignupForm[password]"]', $password);
        $this->actor->click('signup-button');
    }
}
