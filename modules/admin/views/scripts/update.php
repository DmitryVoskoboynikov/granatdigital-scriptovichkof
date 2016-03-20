<?php

use yii\helpers\Html;
use yii\widgets\Breadcrumbs;

/* @var $this yii\web\View */
/* @var $model app\common\models\User */

$this->title = 'Обновить скрипт: ' . ' ' . $model->title;
$this->params['breadcrumbs'][] = ['label' => 'Скрипты', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->title, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = 'Обновить';
?>
<div class="center-block">
    <h1><?= Html::encode($this->title) ?></h1>

    <?= Breadcrumbs::widget([
        'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
        'homeLink' => false
    ]);
    ?>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>
</div>
