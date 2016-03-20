<?php

namespace app\modules\user\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\base\Event;
use yii\web\ForbiddenHttpException;

use app\common\models\Script;
use app\common\models\ScriptStats;
use app\common\models\StepStats;

/**
 * ScriptController implements the some load, save log actions for Script model.
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class ScriptController extends Controller
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

    /**
     * Load script.
     *
     * @return mixed
     */
    public function actionLoad()
    {
        $request = \Yii::$app->getRequest();
        $this->setResponseFormat(Response::FORMAT_JSON);

        if ($request->isPost && ($id = $request->post('id'))) {
            $userId = \Yii::$app->user->identity->id;

            $script = Script::find()
                ->with([
                    'stats' => function($query) use ($userId){
                        $query->andWhere(['user_id' => $userId]);
                    },
                    'steps.stats' => function($query) use ($userId) {
                        $query->andWhere(['user_id' => $userId]);
                    },
                    'answers'
                ])
                ->where(['scripts.id'    => $id])
                ->asArray()
                ->one();

            $stepClosure = function($step) use ($script) {
                $passages_count                = array_shift($script['stats'])['passages_count'];
                $stat                          = array_shift($step['stats']);

                if ($passages_count && $stat) {
                    $endWithUnexpectedAnswerCount = $stat['unexpected_answer'];
                    $endForcefullyInterruptedCount = $stat['forced_interruption'];

                    $step['stats']['end_with_unexpected_answer_count'] = round($endWithUnexpectedAnswerCount * 100 / $passages_count);
                    $step['stats']['end_forcefully_interrupted_count'] = round($endForcefullyInterruptedCount * 100 / $passages_count);
                }

                return $step;
            };

            return [
                'status' => 0,
                'response' => [
                    'script' => $script,
                    'role'   => 'ROLE_SCRIPT_OPERATOR',
                    'data'   => [
                        'steps' => array_map($stepClosure, $script['steps']),
                        'connections' => $script['answers'],
                    ],
                ]
            ];
        } else {
            return [
                'status' => 1
            ];
        }
    }

    /**
     * Save information about script's passages.
     *
     * @return mixed
     */
    public function actionSaveLog()
    {
        $request = \Yii::$app->getRequest();
        $this->setResponseFormat(Response::FORMAT_JSON);

        if ($request->isPost) {
            Event::trigger(ScriptStats::className(), ScriptStats::EVENT_LOG_SAVE);
            Event::trigger(StepStats::className(), StepStats::EVENT_LOG_SAVE);

            return [
                'status' => 0,
                'response' => []
            ];
        } else {
            return [
                'status' => 1
            ];
        }
    }

    /**
     * Set format for yii\web\Response.
     *
     * @param string $format
     */
    protected function setResponseFormat($format = Response::FORMAT_JSON)
    {
        Yii::$app->response->format = $format;
    }
}
