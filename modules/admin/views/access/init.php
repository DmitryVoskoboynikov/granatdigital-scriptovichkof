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
                <a href="#" class="js_menu js_show_box js_show_constructor"  data-id="<?= $script->id; ?>">
                    <span class="sales-mode-step">1</span>&nbsp;Конструктор
                </a>
                <a class="btn btn-xs js_script_action_save btn-success" style="display: none;">
                    <span class="glyphicon glyphicon-ok"></span>&nbsp;Сохранить изменения
                </a>
                <a href="#" class="js_menu js_show_box js_show_access active" data-id="<?= $script->id; ?>">
                    <span class="sales-mode-step">2</span>&nbsp;Доступ
                </a>
                <a href="#" class="js_menu js_show_box js_show_conversion" data-id="<?= $script->id; ?>">
                    <span class="sales-mode-step">3</span>&nbsp;Конверсия
                </a>
            </div>
        </div>
    </div>
    <div class="js_scripts_list_box_wrap" style="display: block;">
        <div class="dropdown dropdown_js_scripts_list_box">
            <?php
            echo ButtonDropdown::widget([
                'label' => $script->title,
                'dropdown' => [
                    'items' => $items
                ],
                'options' => [
                    'class' => 'btn-default'
                ],
            ]);
            ?>
        </div>
    </div>
</div>

<div class="js_box js_access_box">
    <?php $form = ActiveForm::begin([
        'action' => '/admin/access/add?id=' . $script->id,
        'options' => [
            'class' => 'js_access_form'
        ]
    ]);
    ?>

    <table class="table">
        <thead>
            <tr>
                <th class="invalid" colspan="3" style="width: 70%; vertical-align: top;">
                    <?= $form->field($userSearch, 'email', [
                        'inputOptions' => [
                            'placeholder' => 'введите e-mail пользователя, которого хотите добавить',
                            'class' => 'form-control'
                        ],
                    ])->label(false); ?>
                    <div class="js_email_error"></div>
                </th>
                <th style="width: 10%; vertical-align:top;">
                    <input class="btn btn-default js_add_access_user" type="submit" value="добавить">
                    <div class="js_glob_error"></div>
                </th>
            </tr>
        </thead>
        <tbody>
            <?php foreach($workerList as $worker): ?>
                <tr class="js_accessed_user">
                    <td><?= $worker->email ?><a href="/admin/users/view?id=<?= $worker->id ?>">(<?= $worker->username ?>)</a></td>
                    <td></td>
                    <td>
                        <ul>
                            <li class="js_option <?= $worker->group == 3 ? 'active' : '' ?>">
                                <?= $worker->group == 3 ? '<span class="glyphicon glyphicon-ok"></span>' : '' ?>
                                оператор
                            </li>
                            <li class="js_options <?= $worker->group == 2 ? 'active' : '' ?>">
                                <?= $worker->group == 2 ? '<span class="glyphicon glyphicon-ok"></span>' : '' ?>
                                админ
                            </li>
                        </ul>
                    </td>
                    <td style="text-align:center;">
                        <a class="js_remove" data-type="promise" data-user_id="<?= $worker->id ?>" data-script_id="<?= $script->id ?>" href="#">
                            <span class="glyphicon glyphicon-remove-sign"></span>
                        </a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>


