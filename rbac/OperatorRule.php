<?php

namespace app\rbac;

use Yii;
use yii\rbac\Rule;

class OperatorRule extends Rule
{
    public $name = 'isOperator';

    public function execute($user, $item, $params)
    {
        return true;
    }
}
