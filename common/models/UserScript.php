<?php

namespace app\common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\db\ActiveRecord;

/**
 * UseScript model
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class UserScript extends ActiveRecord
{
    const SUCCESS = 'права на прохождения скрипта добавлены.';
    const USER_NOT_FOUND = 'пользователя с данным email не существует.';
    const ALREADY_EXISTS = 'пользователь уже имеет права на прохождение данного скрипта.';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%user_script}}';
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [];
    }

    /**
     * @inhereitdoc
     */
    public static function findByUserAndScriptId($user_id, $script_id)
    {
        return UserScript::findOne(['user_id' => $user_id, 'script_id' => $script_id]);
    }
}
