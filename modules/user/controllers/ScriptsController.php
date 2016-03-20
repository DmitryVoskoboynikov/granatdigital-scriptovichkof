<?php

namespace app\modules\user\controllers;

use Yii;

use yii\web\Controller;
use yii\web\Response;
use yii\web\ForbiddenHttpException;

use app\common\models\Script;
use app\common\models\User;

/**
 * ScriptsController.
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class ScriptsController extends Controller
{
    public function beforeAction($action)
    {
        if (parent::beforeAction($action)) {
            if (!\Yii::$app->user->can('passScript')) {
                throw new ForbiddenHttpException('Access denied');
            }

            return true;
        } else {
            return false;
        }
    }

    public $layout = 'user';

    /**
     * Show index page.
     *
     * @retuern mixed
     */
    public function actionIndex()
    {
        return $this->renderFile('@user/layout/user');
    }

    /**
     * Get operator's scripts.
     *
     * @return mixed
     */
    public function actionScripts()
    {
        $request = \Yii::$app->getRequest();
        $this->setResponseFormat(Response::FORMAT_JSON);

        if ($request->isPost) {
            $user = Yii::$app->getUser()->identity;

            $scripts = $user->getScripts()
                ->with([
                    'stats' => function($query) use ($user) {
                        $query->andWhere(['user_id' => $user->getId()]);
                     }
                ])
                ->asArray()
                ->all();

            $scriptClosure = function($script) {
                $stat = array_shift($script['stats']);

                if ($stat) {
                    $script['stats']['passages_count'] = $stat['passages_count'];
                    $script['stats']['conversion_count'] = $stat['conversion_count'];
                }

                return $script;
            };

            return [
                'status' => 0,
                'response' => [
                    'scripts' => array_map($scriptClosure, $scripts),
                ]
            ];
        } else {
            return ['status' => 1];
        }
    }

    /**
     * Set yii\web\Response format.
     *
     * @param string $format
     */
    protected function setResponseFormat($format = Response::FORMAT_JSON)
    {
        Yii::$app->response->format = $format;
    }
}
