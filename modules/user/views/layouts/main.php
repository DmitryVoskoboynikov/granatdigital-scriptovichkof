<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="/">Scriptovichkof</a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav navbar-right">
                <?php if (Yii::$app->user->isGuest): ?>
                    <li>
                        <a href="/signup">Регистрация</a>
                    </li>
                    <li>
                        <a href="/login">Вход</a>
                    </li>
                <?php else: ?>
                    <li>
                        <a style="color:#fff;">
                            <?= Yii::$app->user->identity->email ?>
                        </a>
                    </li>
                    <li class="active">
                        <div class="js_user_authed" style="display:none;"></div>
                        <a href="/logout" data-method="post">
                            <span class="glyphicon glyphicon-log-out"></span>
                        </a>
                    </li>
                <?php endif ?>
            </ul>
        </div>
    </div>
</nav>
<?= $content ?>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
