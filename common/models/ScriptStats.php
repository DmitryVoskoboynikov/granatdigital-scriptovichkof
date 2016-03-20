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
 * @property integer $passages_count
 * @property integer $success_count
 * @property integer $conversion_count
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class ScriptStats extends ActiveRecord
{
    /** @const */
    const EVENT_LOG_SAVE = 'log-save';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%scripts_stats}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['script_id', 'user_id', 'passages_count', 'success_count', 'conversion_count'], 'safe'],
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
     * Get scripts stats's users.
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUsers()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    /**
     * Log script's passages.
     *
     * @param $event
     * @return bool
     */
    public static function logSave($event)
    {
        $user = Yii::$app->getUser()->identity;
        $request = \Yii::$app->getRequest();
        $data = $request->post();

        if (($model = self::find()->where(['user_id' => $user->id, 'script_id' => $data['id']])->one()) == null) {
            $model = new ScriptStats();
            $model->user_id   = $user->getId();
            $model->script_id = $data['id'];
            $model->save();
        }

        $model->updateCounters(['passages_count' => 1]);

        switch ($data['outcome']) {
            case 'ok':
                $model->updateCounters(['success_count' => 1]);
                break;
            case 'forced_interruption':
            case 'unexpected_answer':
            default:
        }

        $model->conversion_count = round($model->success_count * 100 / $model->passages_count);
        return $model->save();
    }
}
