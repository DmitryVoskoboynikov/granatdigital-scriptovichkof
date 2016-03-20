<div class="js_box js_constructor_box">
    <div class="zoom-btns btn-group-vertical">
        <a href="#" class="btn btn-default btn-sm js_zoom_plus"><span class="glyphicon glyphicon-plus"></span></a>
        <a href="#" class="btn btn-default btn-sm js_zoom_reset"><span class="glyphicon glyphicon-record"></span></a>
        <a href="#" class="btn btn-default btn-sm js_zoom_minus"><span class="glyphicon glyphicon-minus"></span></a>
    </div>
    <div class="js_desk"></div>
</div>

<div class="js_box js_list_box">
    <h2>Скрипты</h2>
    <div class="row"></div>
</div>

<div class="js_settings_box" style="display: none;">
    <div class="js_edit ">
        <div class="step-settings">
            <h4>Редактирование выделенного шага</h4>
            <form class="no-submit form-horizontal">
                <div class="starred-node">
                    <span class="is_starred glyphicon glyphicon-star-empty"></span>
                    <div class="popover bottom starred-text">
                        <div class="arrow"></div>
                        <h3 class="popover-title">Текст для быстрого перехода</h3>
                        <div class="popover-content">
                            <div class="input-group">
                                <input type="text" class="form-control"/>
                                <span class="input-group-btn">
                                    <button class="btn btn-default" type="button">Ok</button>
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="form-group checkbox">
                    <label for="scriptsElementIsGoal">
                        <input type="checkbox" id="scriptsElementIsGoal" class="is_goal" disabled="disabled" />
                        Является целью
                    </label>
                </div>
                <div class="form-group">
                    <div class="title_visible" style="display: none;">
                        <label for="scriptsElementTitle">Заголовок</label>
                        <input type="text" id="scriptsElementTitle" class="form-control title" disabled="disabled" />
                    </div>
                    <div class="title_invisible">
                        <a href="#" class="make_title_visible">Добавить заголовок для краткости</a>
                    </div>
                </div>
                <div class="form-group">
                    <label for="scriptsElementDescript">Описание</label>
                    <textarea id="scriptsElementDescript" class="form-control text tinymce" data-theme="simple" disabled="disabled"></textarea>
                </div>
                <div class="form-group" style="margin-top: 10px;">
                    <label>Ответы</label>
                    <div class="js_answers" style="display:none;">
                        <div class="links"></div>
                    </div>
                </div>
                <div class="form-group js_add_answers">
                    <button class="btn btn-default js_add_answer">Добавить ответ</button>
                    <div class="js_add_answer_form">
                        <div class="close">&times;</div>
                        <h4>Добавление ответа</h4>
                        <textarea class="form-control js_answer_label"></textarea>
                        <div class="form-group">
                            <span>Выбрать шаг</span>
                            <div class="target_box">
                                <input type="text" class="form-control js_target_add_answer" value="" />
                                <input class="js_answer_target_hidden" id="targetAddAnswer" type="hidden" value="" />
                                <span class="new_target_hint"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;Будет создан новый шаг <b></b></span>
                            </div>
                        </div>
                        <button class="btn btn-default js_add_answer_done">Сохранить</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="js_box js_conversion_box" style="display: none;">
    <div class="form-inline version_stats_sel_wrap">
        <label for="ie0jg32t23">Номер версии:</label>
        <select id="ie0jg32t23" class="form-control input-sm version_stats_sel" disabled="disabled"></select>
    </div>
    <div class="js_stat_desk"></div>
    <div class="js_stats_box_wrap">
        <div class="js_stats_box">
            <div>
                <h3>Эффективность операторов:</h3>
                <div class="worker_list"></div>
            </div>
            <div>
                <h3>Информация в целом:</h3>
                <div>Начато звонков: <span class="stat_runs_count">
						<span class="count"></span> звонков (<span class="percent"></span>%)</span></div>
                <div class="stat_unexpected_answer_color">Нет нужного ответа: <span class="stat_runs_with_unexpected_answer_count">
						<span class="count"></span> звонков (<span class="percent"></span>%)</span></div>
                <div class="stat_ended_by_client_color">Разговор прерван: <span class="stat_runs_forcefully_interrupted_count">
						<span class="count"></span> звонков (<span class="percent"></span>%)</span></div>
                <div class="stat_goal_achieved_color">Успешно завершено: <span class="stat_runs_achieved_goal_count">
						<span class="count"></span> звонков (<span class="percent"></span>%)</span></div>
            </div>
            <div style="margin-top: 20px;">
                Слева вы можете найти информацию о том сколько звонков прервалось на каждом шаге из-за
                <span class="stat_unexpected_answer_color">отсутствия нужного ответа</span>
                и по <span class="stat_ended_by_client_color">инициативе клиента</span>
            </div>
        </div>
    </div>
</div>

<div class="js_box js_access_box" style="display: none;">
    <form class="js_access_form">
        <table class="table">
            <thead>
            <tr>
                <th style="width:70%;vertical-align:top;" colspan="2">
                    <input class="form-control js_access_email" type="text" name="email" autocomplete="off"
                           placeholder="введите e-mail пользователя, которого хотите добавить" />
                    <div class="js_email_error"></div>
                </th>
                <th style="width:20%;vertical-align:top;">
                    <select class="form-control js_access_role" name="role">
                        <option value="ROLE_SCRIPT_READER">оператор</option>
                        <option value="ROLE_SCRIPT_WRITER">админ</option>
                    </select>
                    <div class="js_email_error"></div>
                </th>
                <th style="width:10%;vertical-align:top;">
                    <input type="submit" class="btn btn-default js_add_access_user" value="добавить" />
                    <div class="js_glob_error"></div>
                </th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </form>
</div>

<div class="js_box js_view_box" style="display: none;">
    <div class="log_wrap">
        <div class="script-target"><span class="glyphicon glyphicon-record"></span>&nbsp;Цель:&nbsp;<span class="target-content"></span></div>
        <div class="log">
        </div>
    </div>
    <div class="progressBar">
        <div class="progressIndicator">
            <div>
                <span class="progressPercent">0</span>% готово
            </div>
            <div class="progressLineBack">
                <div class="progressLineFill"></div>
            </div>
        </div>
        <button class="talk_is_over btn btn-primary">Разговор окончен</button>
    </div>
    <div class="js_starred_box">
        <h4>Быстрые переходы</h4>
    </div>
</div>

<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="/">Scriptovichkof</a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active">
                    <a href="/user/scripts">
                        Скрипты
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
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
            </ul>
        </div>
    </div>
</nav>

<div class="container">
    <div class="content-wrapper">
        <div class="row row-offcanvas row-offcanvas-right">
            <div class="col-md-12">
                <div class="js_editor">
                    <div class="js_scripts_edit_box top-settings" style="display:none;">
                        <div class="sales-mode">
                            <a href="#" class="js_menu js_show_box js_show_constructor" data-box="js_constructor_box">
                                <span class="sales-mode-step">1</span> Конструктор
                            </a>
                            <a class="btn btn-success btn-xs js_scripts_action_save">
                                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Сохранить изменения
                            </a>
                            <a href="#" class="js_menu js_scripts_action_view">
                                <span class="sales-mode-step">2</span> Просмотр оператором
                            </a>
                            <a href="#" class="js_menu js_show_box js_show_access" data-box="js_access_box">
                                <span class="sales-mode-step">3</span> Доступ <span class="user_access_count">&mdash; <span class="js_user_access_count">0</span></span>
                            </a>
                            <a href="#" class="js_menu js_show_box js_show_conversion" data-box="js_conversion_box">
                                <span class="sales-mode-step">4</span> Конверсия
                            </a>
                            <a href="#" class="js_menu js_show_box js_show_integration" data-box="js_integration_box">
                                <span class="sales-mode-step">5</span> Интеграция
                            </a>
                        </div>
                    </div>
                    <div class="js_scripts_edit_box" style="display:none;">
                    </div>
                </div>
                <div class="js_scripts_list_box_wrap">
                    <button class="btn btn-default js_back_to_list"><span class="glyphicon glyphicon-chevron-left"></span></button>
                    <div class="dropdown js_scripts_list_box">
                        <button class="btn btn-default dropdown-toggle" type="button" id="z4s41nb233fgrgq" data-toggle="dropdown" aria-expanded="true">
                            <span class="js_selected_script_name"></span>
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu js_scripts_list" role="menu"></ul>
                    </div>
                    <div class="btn-group js_script_menu">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <span class="glyphicon glyphicon-menu-hamburger"></span>
                        </button>
                        <ul class="dropdown-menu" role="menu">
                            <li><a class="js_rename_script" href="#"><span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Изменить название</a></li>
                            <li><a href="#" class="js_copy_script"><span class="glyphicon glyphicon-duplicate"></span>&nbsp;&nbsp;Скопировать</a></li>
                        </ul>
                    </div>
                    <div class="target hidden">
                        <div class="input-group">
                            <span class="input-group-addon"><span class="glyphicon glyphicon-record"></span> Цель</span>
                            <input type="text" class="form-control js_script_target" placeholder="Например, назначить встречу с ЛПР">
                        </div>
                    </div>
                    <div class="sales-infos">
                        <div class="sales-info">
                            <b>Конверсия</b>
                            <br />
                            <span class="js_conversion_count">0</span>%
                        </div>

                        <div class="sales-info">
                            <b>Проходы</b>
                            <br />
                            <span class="js_passages_count">0</span>
                        </div>
                    </div>
                    <div class="script-buttons">
                        <a class="btn btn-default btn-sm js_scripts_action_delete"><span class="glyphicon glyphicon-trash"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
