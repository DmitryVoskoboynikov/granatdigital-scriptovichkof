<?php

namespace app\modules\admin\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\web\ForbiddenHttpException;

use app\common\models\Script;

/**
 * ConstructorController
 */
class ConstructorController extends Controller
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

    /**
     * Show constructor panel
     * @return mixed
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    /**
     * Init constructor.
     *
     * @param null $id
     * @return array
     */
    public function actionInit($id = null)
    {
        $data = Script::getItemsForButtonsDropDown();

        $id = $id ? $id : $data['active_item_id'];

        $model = $this->findScript($id);

        $this->setResponseFormat(Response::FORMAT_JSON);

        return [
            'status' => true,
            'html' => $this->renderPartial('init', [
                'items' => $data['items'],
                'model' => $model,
                'steps' => $model->steps,
                'answers' => $model->answers,
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
