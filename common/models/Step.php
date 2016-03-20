<?php

namespace app\common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\db\ActiveRecord;

use app\common\models\StepStats;

/**
 * Step model
 *
 * @property integer $id
 * @property integer $script_id
 * @property bool $is_target
 * @property string $description
 * @property float position_x
 * @property float position_y
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class Step extends ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%steps}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['script_id', 'description', 'is_target', 'title', 'description', 'position_x', 'position_y'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [];
    }

    /**
     * Get step's stats.
     *
     * @return \yii\db\ActiveQuery
     */
    public function getStats()
    {
        return $this->hasMany(StepStats::className(), ['step_id' => 'id']);
    }
}
