<?php

namespace app\common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\db\ActiveRecord;

/**
 * Answer model.
 *
 * @property integer $id
 * @property integer $script_id
 * @property integer $start_id
 * @property integer $finish_id
 * @property string $text
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class Answer extends ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%answers}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['script_id', 'start_id', 'finish_id', 'text'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [];
    }
}
