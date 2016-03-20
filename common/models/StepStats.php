<?php

namespace app\common\models;

use Yii;
use yii\db\ActiveRecord;
use yii\base\Event;

use app\common\models\User;

/**
 * ScriptStats model
 *
 * @property integer $id
 * @property integer $script_id
 * @property integer $user_id
 * @property integer $step_id
 * @property integer $forced_interruption
 * @property integer $unexpected_answer
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class StepStats extends ActiveRecord
{
    /** @const */
    const EVENT_LOG_SAVE = 'log-save';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%steps_stats}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['script_id', 'user_id', 'step_id', 'forced_interruption', 'unexpected_answer'], 'safe'],
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
     * Log steps's stats.
     *
     * @param $event
     * @return bool
     */
    public static function logSave($event)
    {
        $user = Yii::$app->getUser()->identity;
        $request = \Yii::$app->getRequest();
        $data = $request->post();

        $stepId   = end($data['log'])['id'];
        $userId   = $user->getId();
        $scriptId = $data['id'];

        if (($model = self::find()->where(['user_id' => $userId, 'script_id' => $scriptId, 'step_id' => $stepId])->one()) == null) {
            $model = new StepStats();
            $model->user_id   = $userId;
            $model->script_id = $scriptId;
            $model->step_id   = $stepId;
            $model->save();
        }

        switch ($data['outcome']) {
            case 'ok':
                break;
            case 'forced_interruption':
                $model->updateCounters(['forced_interruption' => 1]);
                break;
            case 'unexpected_answer':
                $model->updateCounters(['unexpected_answer' => 1]);
                break;
            default:
        }

        return true;
    }
}
