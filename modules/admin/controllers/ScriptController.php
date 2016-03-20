<?php

namespace app\modules\admin\controllers;

use Yii;

use yii\web\Controller;
use yii\web\Response;
use yii\web\ForbiddenHttpException;

use app\common\models\Script;
use app\common\models\Step;
use app\common\models\Answer;

/**
 * ScriptController implements the some CRUD actions for Script model.
 */
class ScriptController extends Controller
{
    public function beforeAction($action)
    {
        if (parent::beforeAction($action)) {
            if (!\Yii::$app->user->can('createScript')) {
                throw new ForbiddenHttpException('Access denied');
            }

            return true;
        } else {
            return false;
        }
    }

    public function actionCreate()
    {
        $model = new Script();

        $this->setResponseFormat(Response::FORMAT_JSON);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            $user = Yii::$app->getUser()->identity;
            $model->link('users', $user);

            $step = $this->createStarStep();
            $model->link('steps', $step);

            return ['status' => true, 'script_id' => $model->id];
        } else {
            return ['status' => false];
        }
    }

    public function actionCopy($id = null)
    {
        $this->setResponseFormat(Response::FORMAT_JSON);
        $user = Yii::$app->getUser()->identity;

        $model    = $this->findModel($id);
        $request  = Yii::$app->request;

        if ($request->isPost) {
            $title = $request->post('title');

            $script = new Script();
            $script->title = $title ? $title : '';
            $script->save();

            $script->link('users', $user);

            $relations = [];
            foreach ($model->steps as $step) {
                $s = new Step();
                $s->script_id   = $script->id;
                $s->is_start    = $step->is_start;
                $s->is_target   = $step->is_target;
                $s->title       = $step->title;
                $s->description = $step->description;
                $s->position_x  = $step->position_x;
                $s->position_y  = $step->position_y;

                $s->save();
                $relations[$step->id]    = $s->id;
            }

            foreach ($model->answers as $answer) {
                $a = new Answer();
                $a->script_id   = $script->id;
                $a->start_id    = $relations[$answer->start_id];
                $a->finish_id   = $relations[$answer->finish_id];
                $a->text        = $answer->text;

                $a->save();
            }

           // unlink($relations, $step, $answer);

            return ['status' => true, 'script_id' => $script->id];
        } else {
            return ['status' => false];
        }
    }

    public function actionUpdate($id = null)
    {
        $model = $this->findModel($id);

        $this->setResponseFormat(Response::FORMAT_JSON);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return ['status' => true, 'script_id' => $model->id];
        } else {
            return ['status' => false];
        }
    }

    public function actionDelete($id)
    {
        $this->setResponseFormat(Response::FORMAT_JSON);

        $this->findModel($id)->delete();

        return ['status' => true];
    }

    /**
     * Finds the Script model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Script the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Script::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    protected function createStarStep()
    {
        $step = new Step();
        $step->title = Script::START_TITLE;
        $step->position_x = Script::START_POSITION_X;
        $step->position_y = Script::START_POSITION_Y;
        $step->is_start  = Script::START;

        return $step;
    }

    protected function setResponseFormat($format = Response::FORMAT_JSON)
    {
        Yii::$app->response->format = $format;
    }
}
