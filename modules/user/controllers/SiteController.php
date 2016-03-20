<?php

namespace app\modules\user\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\VerbFilter;

use app\common\models\User;
use app\common\models\LoginForm;
use app\modules\user\models\SignupForm;

/**
 * SiteController.
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class SiteController extends Controller
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    /**
     * Show start page.
     *
     * @return mixed
     */
    public function actionIndex()
    {
        if (Yii::$app->user->isGuest) {
            $this->redirect(\Yii::$app->urlManager->createUrl('/login'));
        }

        $user = Yii::$app->getUser()->identity;

        switch ($user->group) {
            case User::ROLE_SUPER_ADMIN:
                $this->redirect(\Yii::$app->urlManager->createUrl("/admin/scripts"));
                break;
            case User::ROLE_ADMIN:
                $this->redirect(\Yii::$app->urlManager->createUrl("/admin/constructor"));
                break;
            case User::ROLE_OPERATOR:
                $this->redirect(\Yii::$app->urlManager->createUrl("/user/scripts"));
                break;
            default:
                $this->redirect(\Yii::$app->urlManager->createUrl('/login'));
        }
    }

    /**
     * Login user.
     *
     * @return mixed
     */
    public function actionLogin()
    {
        $model = new LoginForm();

        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            $user = Yii::$app->getUser()->identity;

            switch ($user->group) {
                case User::ROLE_SUPER_ADMIN:
                    $this->redirect(\Yii::$app->urlManager->createUrl("/admin/scripts"));
                    return;
                case User::ROLE_ADMIN:
                    $this->redirect(\Yii::$app->urlManager->createUrl("/admin/constructor"));
                    return;
                case User::ROLE_OPERATOR:
                    $this->redirect(\Yii::$app->urlManager->createUrl("/user/scripts"));
                    return;
            }
        }

        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Signs user up.
     *
     * @return mixed
     */
    public function actionSignup()
    {
        $model = new SignupForm();

        if ($model->load(Yii::$app->request->post())) {
            if ($user = $model->signup()) {
                if (Yii::$app->user->login($user)) {
                    $this->redirect(\Yii::$app->urlManager->createUrl("/user/scripts"));
                }
            }
        }

        return $this->render('signup', [
            'model' => $model,
        ]);
    }

    /**
     * Signs user out.
     *
     * @return \yii\web\Response
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }
}
