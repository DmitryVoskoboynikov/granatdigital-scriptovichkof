<?php

namespace app\rbac;

use Yii;
use yii\rbac\Rule;

/**
 * Checks if user group matches
 */
class UserGroupRule extends Rule
{
    public $name = 'userGroup';

    public function execute($user, $item, $params)
    {
        if (!Yii::$app->user->isGuest) {
            $group = Yii::$app->user->identity->group;
            if ($item->name === 'SUPER-ADMIN') {
                return $group == 1;
            } elseif ($item->name === 'ADMIN') {
                return $group == 1 || $group == 2;
            } elseif ($item->name === 'OPERATOR') {
                return $group == 1 || $group == 2 || $group == 3;
            }
        }

        return false;
    }
}
