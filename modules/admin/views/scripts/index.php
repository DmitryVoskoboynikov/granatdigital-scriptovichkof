<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel app\common\models\UserSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Скрипты';
?>
<div class="center-block">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Создать скрипт', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            ['attribute' => 'id', 'label' => 'id'],
            ['attribute' => 'title', 'label' => 'Название'],
            ['attribute' => 'target', 'label' => 'Цель'],
            ['attribute' => 'created_at', 'format' => 'datetime', 'label' => 'Создан'],
            ['attribute' => 'updated_at', 'format' => 'datetime', 'label' => 'Обновлен'],

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>
</div>
