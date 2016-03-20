<?php

namespace app\assets;

use yii\web\AssetBundle;

/**
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class ScriptAssets extends AssetBundle
{
    public $sourcePath = '@app/modules/user/web';
    public $baseUrl = '@web';

    public $js = [
        'js/apploadscripts.js',
        'js/libloadscripts.js',
    ];

    public $depends = [
        'yii\bootstrap\BootstrapPluginAsset',
        'app\assets\JPlumbAsset',
    ];

    public $publishOptions = [
        'forceCopy' => YII_DEBUG,
    ];
}
