<?php
namespace app\commands;

use Yii;
use yii\console\Controller;
use \app\rbac\UserGroupRule;

class RbacController extends Controller
{

    public function actionInit()
    {
        $authManager = Yii::$app->authManager;

        $rule = new UserGroupRule;
        $authManager->add($rule);

        $passScript = $authManager->createPermission('passScript');
        $passScript->description = 'Allow operator pass script';
        $authManager->add($passScript);

        $createScript = $authManager->createPermission('createScript');
        $createScript->description = 'Allow create script';
        $authManager->add($createScript);

        $viewScript   = $authManager->createPermission('viewScript');
        $viewScript->description = 'Allow view script';
        $authManager->add($viewScript);

        $accessScript = $authManager->createPermission('accessScript');
        $accessScript->description = 'Allow grant priviligies for scripts';
        $authManager->add($accessScript);

        $viewUser = $authManager->createPermission('viewUser');
        $viewUser->description = 'Allow view script';
        $authManager->add($viewUser);

        $operator = $authManager->createRole('OPERATOR');
        $operator->ruleName = $rule->name;
        $authManager->add($operator);
        $authManager->addChild($operator, $passScript);

        $admin = $authManager->createRole('ADMIN');
        $admin->ruleName = $rule->name;
        $authManager->add($admin);
        $authManager->addChild($admin, $createScript);
        $authManager->addChild($admin, $viewScript);
        $authManager->addChild($admin, $viewUser);
        $authManager->addChild($admin, $accessScript);
        $authManager->addChild($admin, $operator);

        $super_admin = $authManager->createRole('SUPER-ADMIN');
        $super_admin->ruleName = $rule->name;
        $authManager->add($super_admin);
        $authManager->addChild($super_admin, $admin);
    }
}
