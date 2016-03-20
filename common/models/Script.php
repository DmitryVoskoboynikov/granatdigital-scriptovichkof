<?php

namespace app\common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;

use app\common\models\User;
use app\common\models\Step;
use app\common\models\Answer;
use app\common\models\ScriptStats;

/**
 * Script model.
 *
 * @property integer $id
 * @property integer $title
 * @property string $target
 * @property integer $scale
 * @property integer $created_at
 * @property integer $updated_at
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class Script extends ActiveRecord
{
    const START_TITLE = 'Начало Инструкции оператору, что он должен говорить';
    const START_POSITION_X = 100;
    const START_POSITION_Y = 100;
    const START = true;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%scripts}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title', 'target', 'scale', 'conversion_success', 'conversion_count'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
        ];
    }

    /**
     * Get script's steps.
     *
     * @return \yii\db\ActiveQuery
     */
    public function getSteps()
    {
        return $this->hasMany(Step::className(), ['script_id' => 'id']);
    }

    /**
     * Get script's answers.
     *
     * @return \yii\db\ActiveQuery
     */
    public function getAnswers()
    {
        return $this->hasMany(Answer::className(), ['script_id' => 'id']);
    }

    /**
     * Get script's associated operators.
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUsers()
    {
        return $this->hasMany(User::className(), ['id' => 'user_id'])
            ->viaTable('user_script', ['script_id' => 'id']);
    }

    /**
     * Get script's stats.
     *
     * @return \yii\db\ActiveQuery
     */
    public function getStats()
    {
        return $this->hasMany(ScriptStats::className(), ['script_id' => 'id']);
    }

    /**
     * Get script's for script list.
     *
     * @return array
     */
    public static function getItemsForButtonsDropDown()
    {
        $items = [];

        $user = Yii::$app->getUser()->identity;
        $scripts = $user->getScripts()->all();

        foreach ($scripts as $script) {
            $items[] = [
                'label' => $script->title,
                'url' => '#',
                'linkOptions' => [
                    'data-id' => $script->id,
                    'class' => 'js_show_script',
                ],
            ];
        }

        return ['items' => $items, 'active_item_id' => isset($items[0]['linkOptions']['data-id']) ? $items[0]['linkOptions']['data-id'] : false];
    }
}
