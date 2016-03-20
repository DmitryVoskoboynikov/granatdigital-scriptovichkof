<?php

namespace app\assets;

use yii\web\AssetBundle;

/**
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class ConstructorAsset extends AssetBundle
{
    public $sourcePath = '@app/modules/admin/web';
    public $baseUrl = '@web';

    public $css = [
        'css/constructor.css',
        'css/desk.css',
        'css/access.css',
    ];

    public $js = [
        'js/constructor.js',
        'js/desk.js',
        'js/desk_conversion.js',
        'js/access.js',
        'js/conversion.js',
    ];

    public $depends = [
        'yii\bootstrap\BootstrapPluginAsset',
        'app\assets\JPlumbAsset',
    ];

    public $publishOptions = [
        'forceCopy' => YII_DEBUG,
    ];
}
