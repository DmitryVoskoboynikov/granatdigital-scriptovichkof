<?php

namespace app\assets;

use yii\web\AssetBundle;

/**
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/site.css',
        'css/jquery.fancybox.css',
    ];

    public $js = [
        'js/jquery.fancybox.js',
        'js/app.js',
        'js/appall.js',
        'js/appscript.js',
        'js/appaddscript.js',
    ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\jui\JuiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];

    public $publishOptions = [
        'forceCopy' => YII_DEBUG,
    ];
}
