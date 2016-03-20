<?php

namespace app\assets;

use yii\web\AssetBundle;

/**
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class JPlumbAsset extends AssetBundle
{
    public $sourcePath = '@app/web/js';
    public $baseUrl = '@web';

    public $js = [
        'jquery.jsplumb.js',
    ];

    public $publishOptions = [
        'forceCopy' => YII_DEBUG,
    ];
}
