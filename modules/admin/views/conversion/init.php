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
                <a href="#" class="js_menu js_show_box js_show_constructor"  data-id="<?= $model['id']; ?>">
                    <span class="sales-mode-step">1</span>&nbsp;Конструктор
                </a>
                <a class="btn btn-xs js_script_action_save btn-success" style="display: none;">
                    <span class="glyphicon glyphicon-ok"></span>&nbsp;Сохранить изменения
                </a>
                <a href="#" class="js_menu js_show_box js_show_access" data-id="<?= $model['id']; ?>">
                    <span class="sales-mode-step">2</span>&nbsp;Доступ
                </a>
                <a href="#" class="js_menu js_show_box js_show_conversion active" data-id="<?= $model['id']; ?>">
                    <span class="sales-mode-step">3</span>&nbsp;Конверсия
                </a>
            </div>
        </div>
    </div>
    <div class="js_scripts_list_box_wrap" style="display: block;">
        <div class="dropdown dropdown_js_scripts_list_box">
            <?php
            echo ButtonDropdown::widget([
                'label' => $model['title'],
                'dropdown' => [
                    'items' => $items,
                ],
                'options' => [
                    'class' => 'btn-default'
                ],
            ]);
            ?>
        </div>
    </div>
</div>

<div class="js_box js_constructor_box" style="display: block;">
    <div class="js_desk" script_id="<?= $model['id'] ?>"></div>
    <div class="js_stats_box_wrap">
        <div class="js_stats_box">
            <div>
                <h3>Эффективность операторов:</h3>
                <div class="worker_list">
                    <?php foreach($workerList as $worker): ?>
                        <div><?= $worker['users']['username'] . " = " . $worker['success_count'] . "/" .
                            $worker["passages_count"] . " звонков (" . $worker['conversion_count'] . '%)' ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <div>
                <h3>Информация в целом:</h3>
                <div>
                    Начато звонков:
                    <span class="stat_runs_count">
                        <span class="count"><?= $model['stats']['passages_count'] ?></span>
                        звонков
                    </span>
                </div>
                <div class="stat_unexpected_answer_color">
                    Нет нужного ответа:
                    <span class="stat_runs_with_unexpected_answer_count">
                        <span class="count"><?= $model['stats']['end_with_unexpected_answer_count'] ?></span>
                        звонков (<span class="percent"><?= $model['stats']['end_with_unexpected_answer_percent'] ?></span>%)
                    </span>
                </div>
                <div class="stat_ended_by_client_color">
                    Разговор прерван:
                    <span class="stat_runs_forcefully_interrupted_count">
                        <span class="count"><?= $model['stats']['end_forcefully_interrupted_count'] ?></span>
                        звонков (<span class="percent"><?= $model['stats']['end_forcefully_interrupted_percent'] ?></span>%)
                    </span>
                </div>
                <div class="stat_goal_achieved_color">
                    Успешно завершено:
                    <span class="stat_runs_achieved_goal_count">
                        <span class="count"><?= $model['stats']['success_count'] ?></span>
                        звонков (<span class="percent"><?= $model['stats']['success_percent'] ?></span>%)
                    </span>
                </div>
            </div>
            <div style="margin-top: 20px;">
                Слева вы можете найти информацию о том сколько звонков прервалось на каждом шаге из-за
                <span class="stat_unexpected_answer_color">отсутсвия нужного ответа</span>
                и по
                <span class="stat_ended_by_client_color">инициатива клиента</span>
            </div>
        </div>
    </div>
</div>

<div style="display: none">
    <div id="container_steps">
        <?php $id = 0; ?>
        <?php foreach($steps as $step): ?>
            <?php $form = ActiveForm::begin([
                'action' => '/admin/step/update?id=' . $step['id'],
                'id' => 'js_form_step_container_' . ++$id,
                'options' => [
                    'class' => 'js_form_step_container'
                ]
            ]);
            ?>
            <input id="step-id" type="hidden" value="<?= $step['id'] ?>" name="Step[id]" />
            <input id="step-is_start" type="hidden" value="<?= $step['is_start'] ?>" name="Step[is_start]" />
            <input id="step-is_target" type="hidden" value="<?= $step['is_target'] ?>" name="Step[is_target]" />
            <input id="step-title" type="hidden" value="<?= $step['title'] ?>" name="Step[title]" />
            <input id="step-description" type="hidden" value="<?= $step['description'] ?>" name="Step[description]" />
            <input id="step-position_x" type="hidden" value="<?= $step['position_x'] ?>" name="Step[position_x]" />
            <input id="step-position_y" type="hidden" value="<?= $step['position_y'] ?>" name="Step[position_y]" />
            <input id="step-end_with_unexpected_answer_count" value="<?= $step['stats']['end_with_unexpected_answer_count'] ?>" name="Step[end_with_unexpected_answer_count]" />
            <input id="step-end_forcefully_interrupted_count" value="<?= $step['stats']['end_forcefully_interrupted_count'] ?>" name="Step[end_forcefully_interrupted_count]" />
            <?php ActiveForm::end(); ?>
        <?php endforeach; ?>
    </div>
</div>

<div style="display: none">
    <div id="container_answers">
        <?php $id = 0; ?>
        <?php foreach($answers as $answer): ?>
            <?php $form = ActiveForm::begin([
                'action' => '/admin/answer/update?id=' . $answer['id'],
                'id' => 'js_form_answer_container_' . ++$id,
                'options' => [
                    'class' => 'js_form_answer_container'
                ]
            ]);
            ?>
            <input id="answer-id" type="hidden" value="<?= $answer['id'] ?>" name="Answer[id]" />
            <input id="answer-start_id" type="hidden" value="<?= $answer['start_id'] ?>" name="Answer['start_id]" />
            <input id="answer-finish_id" type="hidden" value="<?= $answer['finish_id'] ?>" name="Answer['finish_id']" />
            <input id="answer-text" type="hidden" value="<?= $answer['text'] ?>" name="Answer[text]" />
            <?php ActiveForm::end(); ?>
        <?php endforeach; ?>
    </div>
</div>
