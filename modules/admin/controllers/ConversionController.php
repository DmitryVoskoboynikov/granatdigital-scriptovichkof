<?php

namespace app\modules\admin\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\web\ForbiddenHttpException;

use app\common\models\Script;
use app\common\models\ScriptStats;

/**
 * ConversionController
 */
class ConversionController extends Controller
{
    public function beforeAction($action)
    {
        if (parent::beforeAction($action)) {
            if (!\Yii::$app->user->can('viewScript')) {
                throw new ForbiddenHttpException('Access denied');
            }

            return true;
        } else {
            return false;
        }
    }

    public function actionInit($id = null)
    {
        $data = Script::getItemsForButtonsDropDown();

        $id = $id ? $id : $data['active_item_id'];

        $script = Script::find()
            ->with([
                'stats',
                'steps.stats',
                'answers'
            ])
            ->where(['scripts.id' => $id])
            ->asArray()
            ->one();

        $this->setResponseFormat(Response::FORMAT_JSON);

        $script['stats']['end_with_unexpected_answer_count'] = 0;
        $script['stats']['end_with_unexpected_answer_percent'] = 0;
        $script['stats']['end_forcefully_interrupted_count'] = 0;
        $script['stats']['end_forcefully_interrupted_percent'] = 0;
        $script['stats']['passages_count'] = 0;
        $script['stats']['success_count'] = 0;
        $script['stats']['success_percent'] = 0;

        $stepClosure = function($step) use (&$script) {
            $passages_count                                    = 0;
            $success_count                                     = 0;
            $endWithUnexpectedAnswerCount                      = 0;
            $endForcefullyInterruptedCount                     = 0;
            $step['stats']['end_with_unexpected_answer_count'] = 0;
            $step['stats']['end_forcefully_interrupted_count'] = 0;

            foreach ($script['stats'] as $stat) {
                 $passages_count += $stat['passages_count'];
                 $success_count  += $stat['success_count'];
            }

            foreach ($step['stats'] as $stat) {
                $endWithUnexpectedAnswerCount += $stat['unexpected_answer'];
                $script['stats']['end_with_unexpected_answer_count'] += $stat['unexpected_answer'];
                $endForcefullyInterruptedCount += $stat['forced_interruption'];
                $script['stats']['end_forcefully_interrupted_count'] += $stat['forced_interruption'];
            }

            if ($passages_count) {
                $step['stats']['end_with_unexpected_answer_count']     = round($endWithUnexpectedAnswerCount * 100 / $passages_count);
                $step['stats']['end_forcefully_interrupted_count']     = round($endForcefullyInterruptedCount * 100 / $passages_count);
                $script['stats']['end_with_unexpected_answer_percent'] = round($script['stats']['end_with_unexpected_answer_count'] * 100 / $passages_count);
                $script['stats']['end_forcefully_interrupted_percent'] = round($script['stats']['end_forcefully_interrupted_count'] * 100 / $passages_count);
                $script['stats']['passages_count']                     = $passages_count;
                $script['stats']['success_count']                      = $success_count;
                $script['stats']['success_percent']                    = round($success_count * 100 / $passages_count);
            }

            return $step;
        };

        $workerList = ScriptStats::find()
            ->with(['users'])
            ->where(['scripts_stats.script_id' => $id])
            ->asArray()
            ->all();

        return [
            'status' => true,
            'html' => $this->renderPartial('init', [
                'items' => $data['items'],
                'steps' => array_map($stepClosure, $script['steps']),
                'model' => $script,
                'answers' => $script['answers'],
                'workerList' => $workerList,
            ]),
        ];
    }

    /**
     * Finds the Script model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Script the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findScript($id)
    {
        if (($model = Script::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    protected function setResponseFormat($format = Response::FORMAT_JSON)
    {
        Yii::$app->response->format = $format;
    }
}
