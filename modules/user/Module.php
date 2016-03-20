<?php

namespace app\modules\user;

use yii;
use yii\base\Event;

use app\common\models\ScriptStats;
use app\common\models\StepStats;

/**
 * User module.
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class Module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\user\controllers';

    public $layout = 'main';

    /**
     * @inheritdoc
     */
    public function init()
    {
        Event::on(ScriptStats::className(), ScriptStats::EVENT_LOG_SAVE, ['app\common\models\ScriptStats', 'logSave']);
        Event::on(StepStats::className(), StepStats::EVENT_LOG_SAVE, ['app\common\models\StepStats', 'logSave']);

        Yii::setAlias('@user/layout/user', '@app/modules/user/views/layouts/user.php');

        parent::init();
    }
}
