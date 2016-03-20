<?php

namespace app\modules\admin\controllers;

use Yii;
use yii\web\Controller;

/**
 * StatisticsController show script's conversion
 */
class StatisticsController extends Controller
{
    public $layout = 'admin';

    /**
     * Show scripts list
     * @retuern mixed
     */
    public function actionIndex()
    {
        $user = Yii::$app->getUser()->identity;
        $scripts = $user->scripts;

        return $this->render('index', [
            'scripts' => $scripts,
        ]);
    }
}
