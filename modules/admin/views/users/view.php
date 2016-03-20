<?php

use yii\helpers\Html;
use yii\widgets\DetailView;
use yii\widgets\Breadcrumbs;

/* @var $this yii\web\View */
/* @var $model app\common\models\User */

$this->title = $model->username;
$this->params['breadcrumbs'][] = ['label' => 'Пользователи', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="center-block">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= Breadcrumbs::widget([
        'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
        'homeLink' => false
    ]);
    ?>

    <p>
        <?= Html::a('Обновить', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('Удалить', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Are you sure you want to delete this item?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            ['attribute' => 'username', 'label' => 'Имя пользователя'],
            ['attribute' => 'email', 'format' => 'email', 'label' => 'Email'],
            [
                'attribute'=>'status',
                'value' => $model->getStatus(),
                'label' => 'Статус'
            ],
            [
                'attribute'=>'group',
                'value' => $model->getGroup(),
                'label' => 'Группа'
            ],
            ['attribute' => 'created_at', 'format' => 'datetime', 'label' => 'Создан'],
            ['attribute' => 'updated_at', 'format' => 'datetime', 'label' => 'Обновлен'],
        ],
    ]) ?>

</div>
