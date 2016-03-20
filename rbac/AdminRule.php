<?php

namespace app\rbac;

use Yii;
use yii\rbac\Rule;

class AdminRule extends Rule
{
    public $name = 'isAdmin';

    public function execute($user, $item, $params)
    {
        return true;
    }
}
