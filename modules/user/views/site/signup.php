<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model app\common\models\SignupForm */
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Регистрация';
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="row">
    <div class="center-block col-lg-6" style="float: none;">
        <h1><?= Html::encode($this->title) ?></h1>
        <p>Пожалуйста заполните следующие поля:</p>

        <?php $form = ActiveForm::begin(['id' => 'form-signup']); ?>

        <?= $form->field($model, 'username')->label('Имя пользователя') ?>

        <?= $form->field($model, 'email')->label('Адрес электронной почты') ?>

        <?= $form->field($model, 'password')->passwordInput()->label('Пароль') ?>

        <div class="form-group">
            <?= Html::submitButton('Signup', ['class' => 'btn btn-primary', 'name' => 'signup-button']) ?>
        </div>

        <?php ActiveForm::end(); ?>
    </div>
</div>
