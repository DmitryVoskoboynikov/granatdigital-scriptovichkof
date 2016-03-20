<?php
    use yii\bootstrap\ButtonDropdown;
    use yii\helpers\ArrayHelper;
    use yii\helpers\Html;
    use yii\widgets\ActiveForm;
    use app\common\models\Script;
?>
<div class="col-md-12">
    <div class="js_editor">
        <div class="js_scripts_edit_box top-settings">
            <div class="sales-mode">
                <a href="#" class="js_menu js_show_box js_show_constructor active"  data-id="<?= $model->id; ?>">
                    <span class="sales-mode-step">1</span>&nbsp;Конструктор
                </a>
                <a class="btn btn-xs js_script_action_save btn-success" style="display: none;">
                    <span class="glyphicon glyphicon-ok"></span>&nbsp;Сохранить изменения
                </a>
                <a href="#" class="js_menu js_show_box js_show_access" data-id="<?= $model->id; ?>">
                    <span class="sales-mode-step">2</span>&nbsp;Доступ
                </a>
                <a href="#" class="js_menu js_show_box js_show_conversion" data-id="<?= $model->id; ?>">
                    <span class="sales-mode-step">3</span>&nbsp;Конверсия
                </a>
            </div>
        </div>
    </div>
    <div class="js_scripts_list_box_wrap" style="display: block;">
        <div class="dropdown dropdown_js_scripts_list_box">
            <?php
            echo ButtonDropdown::widget([
                'label' => $model->title,
                'dropdown' => [
                    'items' => ArrayHelper::merge(
                        [['label' => "Добавить скрипт", 'url' => '#new_script', 'linkOptions' => ['id' => 'js_new_script']]],
                        $items
                    ),
                ],
                'options' => [
                    'class' => 'btn-default'
                ],
            ]);
            ?>
        </div>
        <div class="btn-group js_script_menu_open">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                <span class="glyphicon glyphicon-menu-hamburger"></span>
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a id="js_copy_script" href="#copy_script">
                        <span class="glyphicon glyphicon-duplicate"></span>
                        &nbsp;&nbsp;Скопировать
                    </a>
                </li>
            </ul>
        </div>
        <div class="target">
            <div class="input-group">
                <div class="input-group-addon">
                    <span class="glyphicon glyphicon-record">&nbsp;Цель</span>
                </div>
                <input type="text" class="form-control js_script_target" placeholder="Например, назначить встречу с ЛНР" value="<?= $model->target ?>">
            </div>
        </div>
        <div class="script-buttons" style="display: block;">
            <a class="btn btn-default btn-sm js_script_action_delete" id="js_delete_script" href="#delete_script">
                <span class="glyphicon glyphicon-trash"></span>
            </a>
        </div>
    </div>
</div>

<div class="js_box js_constructor_box" style="display: block;">
    <div class="zoom-btns btn-group-vertical" style="display: block;">
        <a href="#" class="btn btn-default btn-sm js_zoom_plus">
            <span class="glyphicon glyphicon-plus"></span>
        </a>
        <a href="#" class="btn btn-default btn-sm js_zoom_reset">
            <span class="glyphicon glyphicon-record"></span>
        </a>
        <a href="#" class="btn btn-default btn-sm js_zoom_minus">
            <span class="glyphicon glyphicon-minus"></span>
        </a>
    </div>
    <div class="js_desk" script_id="<?= $model->id ?>"></div>
</div>

<div class="js_settings_box step-settings-panel">
    <div id="null" class="js_edit">
        <div class="step-settings">
            <h4>Редактирование выделенного шага</h4>
            <form class="no-submit form-horizontal">
                <div class="form-group checkbox">
                    <label for="stepElementIsTarget">
                        <input id="stepElementIsTarget" class="is_target" type="checkbox">
                        Являются целью
                    </label>
                </div>
                <div class="form-group">
                    <div class="title_visible">
                        <label for="stepElementTitle">Заголовок</label>
                        <input id="stepElementTitle" class="form-control title" type="text"></input>
                    </div>
                </div>
                <div class="form-group">
                    <label for="stepElementDescription">Описание</label>
                    <textarea id="stepElementDescription" class="form-control text"></textarea>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="js_settings_box answer-settings-panel">
    <div id="null" class="js_edit">
        <div class="step-settings">
            <h4>Редактирование выделенного ответа</h4>
            <form class="no-submit form-horizontal">
                <div class="form-group">
                    <label for="answerElementDescription">Описание</label>
                    <textarea id="answerElementDescription" class="form-control text"></textarea>
                </div>
            </form>
        </div>
    </div>
</div>

<div style="display: none">
    <div id="new_script">
        <h3>Создание нового скрипта</h3>

        <?php $form = ActiveForm::begin([
                'action' => '/admin/script/create',
                'id' => 'js_form_create_script',
            ]);
        ?>

        <?= $form->field(new Script(), 'title', [
            'inputOptions' => [
                'placeholder' => 'Введите наименование скрипта',
                'class' => 'form-control'
            ],
        ])->label('Наименование скрипта'); ?>

        <div class="pull-right">
            <?= Html::submitButton('Сохранить', ['class' => 'btn btn-primary', 'id' => 'js_create_script']); ?>
        </div>

        <?php ActiveForm::end(); ?>
    </div>
</div>

<div style="display: none">
    <div id="copy_script">
        <h3>Копирование скрипта</h3>

        <?php $form = ActiveForm::begin([
                'action' => '/admin/script/copy?id=' . $model->id,
                'id' => 'js_form_copy_script',
            ]);
        ?>

        <?= $form->field(new Script(), 'title', [
                'inputOptions' => [
                    'placeholder' => 'Введите наименование скрипта',
                    'class' => 'form-control'
                ],
            ])->label('Наименование скрипта');
        ?>

        <div class="pull-right">
            <?= Html::submitButton('Скопировать', ['class' => 'btn btn-primary', 'id' => 'js_create_script']); ?>
        </div>

        <?php ActiveForm::end(); ?>
    </div>
</div>

<div style="display: none">
    <div id="delete_script">
        <h4>Вы действительно хотите удалить скрипт?</h4>

        <?php $form = ActiveForm::begin([
                'action' => '/admin/script/delete?id=' . $model->id,
                'id' => 'js_form_delete_script',
            ]);
        ?>

        <div class="pull-right">
            <?= Html::button('Отмена', ['class' => 'btn btn-default js_cancel', 'id' => 'js_delete_cancel']) ?>
            <?= Html::submitButton('Ok', ['class' => 'btn btn-primary js_ok', 'id' => 'js_delete_script']) ?>
        </div>

        <?php ActiveForm::end(); ?>
    </div>
</div>

<div style="display: none">
    <div id="container_script">
        <?php $form = ActiveForm::begin([
            'action' => '/admin/script/update?id=' . $model->id,
            'options' => [
                'class' => 'js_form_script_container'
            ]
        ]);
        ?>

        <?= $form->field($model, 'target')->hiddenInput()->label(false); ?>
        <?= $form->field($model, 'scale')->hiddenInput()->label(false); ?>

        <?php ActiveForm::end(); ?>
    </div>
</div>

<div style="display: none">
    <div id="container_steps">
        <?php $id = 0; ?>
        <?php foreach($steps as $step): ?>
            <?php $form = ActiveForm::begin([
                'action' => '/admin/step/update?id=' . $step->id,
                'id' => 'js_form_step_container_' . ++$id,
                'options' => [
                    'class' => 'js_form_step_container'
                ]
            ]);
            ?>
            <?= $form->field($step, 'id')->hiddenInput()->label(false); ?>
            <?= $form->field($step, 'is_start')->hiddenInput()->label(false); ?>
            <?= $form->field($step, 'is_target')->hiddenInput()->label(false); ?>
            <?= $form->field($step, 'title')->hiddenInput()->label(false); ?>
            <?= $form->field($step, 'description')->hiddenInput()->label(false); ?>
            <?= $form->field($step, 'position_x')->hiddenInput()->label(false); ?>
            <?= $form->field($step, 'position_y')->hiddenInput()->label(false); ?>
            <?php ActiveForm::end(); ?>
        <?php endforeach; ?>
    </div>
</div>

<div style="display: none">
    <div id="container_answers">
        <?php $id = 0; ?>
        <?php foreach($answers as $answer): ?>
            <?php $form = ActiveForm::begin([
                'action' => '/admin/answer/update?id=' . $answer->id,
                'id' => 'js_form_answer_container_' . ++$id,
                'options' => [
                    'class' => 'js_form_answer_container'
                ]
            ]);
            ?>
            <?= $form->field($answer, 'id')->hiddenInput()->label(false); ?>
            <?= $form->field($answer, 'start_id')->hiddenInput()->label(false); ?>
            <?= $form->field($answer, 'finish_id')->hiddenInput()->label(false); ?>
            <?= $form->field($answer, 'text')->hiddenInput()->label(false); ?>
            <?php ActiveForm::end(); ?>
        <?php endforeach; ?>
    </div>
</div>
