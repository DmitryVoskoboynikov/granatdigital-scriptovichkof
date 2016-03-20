<?php

namespace app\modules\admin\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\web\ForbiddenHttpException;

use app\common\models\Step;

/**
 * StepController
 */
class StepController extends Controller
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
        $model = new Step();

        $this->setResponseFormat(Response::FORMAT_JSON);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return ['status' => true, 'step_id' => $model->id];
        } else {
            return ['status' => false];
        }
    }

    public function actionUpdate($id = null)
    {
        $model = $this->findModel($id);

        $this->setResponseFormat(Response::FORMAT_JSON);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return ['status' => true, 'step_id' => $model->id];
        } else {
            return ['status' => false];
        }
    }

    /**
     * Deletes an existing Step model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return ['status' => true];
    }

    /**
     * Finds the Step model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Step the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Step::findOne($id)) !== null) {
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
