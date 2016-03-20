<?php

namespace app\modules\admin\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\web\ForbiddenHttpException;

use app\common\models\Script;
use app\common\models\UserSearch;
use app\common\models\UserScript;

/**
 * ConstructorController
 */
class AccessController extends Controller
{
    public function beforeAction($action)
    {
        if (parent::beforeAction($action)) {
            if (!\Yii::$app->user->can('accessScript')) {
                throw new ForbiddenHttpException('Access denied');
            }

            return true;
        } else {
            return false;
        }
    }

    public function actionInit($id = null)
    {
        $this->setResponseFormat(Response::FORMAT_JSON);

        $data = Script::getItemsForButtonsDropDown();

        $script     = $this->findScript($id);
        $userSearch = new UserSearch();
        $workerList = $script->getUsers()->all();

        return [
            'status' => true,
            'html' => $this->renderPartial('init', [
                'userSearch' => $userSearch,
                'script' => $script,
                'items' => $data['items'],
                'workerList' => $workerList,
            ]),
        ];
    }

    /**
     * @param integer $id
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionAdd($id = null)
    {
        $this->setResponseFormat(Response::FORMAT_JSON);

        $script = $this->findScript($id);

        $userSearch = new UserSearch();
        $userSearch->load(Yii::$app->request->post());
        $user = $userSearch->findByEmail($userSearch->email);

        if ($user !== null) {
            $status = true;

            if (UserScript::findByUserAndScriptId($user->id, $script->id)) {
                $message = UserScript::ALREADY_EXISTS;
                $status = false;
            } else {
                $script->link('users', $user);
                $message = UserScript::SUCCESS;
            }

            return [
                'status' => $status,
                'script_id' => $script->id,
                'message' => $message,
            ];
        } else {
            return [
                'status' => false,
                'script_id' => $script->id,
                'message' => UserScript::USER_NOT_FOUND,
            ];
        }
    }

    /**
     * Delete access.
     *
     * @param integer $id
     * @return array
     * @throws NotFoundHttpException
     */
    public function actionDelete($uid = null, $sid = null)
    {
        $this->setResponseFormat(Response::FORMAT_JSON);

        if (!$uid || !$sid) {
            return [
                'status' => false
            ];
        }

        UserScript::deleteAll(['user_id' => $uid, 'script_id' => $sid]);

        return [
            'status' => true
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
