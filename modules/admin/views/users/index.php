<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel app\common\models\UserSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Пользователи';
?>
<div class="center-block">

    <h1><?= Html::encode($this->title) ?></h1>
    <?php # echo $this->render('_search', ['model' => $searchModel]); ?>

    <p>
        <?= Html::a('Создать пользователя', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            ['attribute' => 'username', 'label' => 'Имя пользователя'],
            ['attribute' => 'email', 'format' => 'email', 'label' => 'Email'],
            [
                'attribute'=>'status',
                'value' => function ($model, $key, $index, $column) {
                    return $model->getStatus();
                },
                'label' => 'Статус'
            ],
            [
                'attribute' => 'group',
                'value' => function($model, $key, $index, $column) {
                    return $model->getGroup();
                },
                'label' => 'Группа'
            ],
            ['attribute' => 'created_at', 'format' => 'datetime', 'label' => 'Создан'],
            ['attribute' => 'updated_at', 'format' => 'datetime', 'label' => 'Обновлен'],

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

</div>
