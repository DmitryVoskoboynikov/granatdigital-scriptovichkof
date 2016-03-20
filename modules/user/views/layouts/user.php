<?php

use yii\helpers\Html;
use app\assets\AppAsset;
use app\assets\ScriptAssets;

AppAsset::register($this);
ScriptAssets::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
    <?php $this->beginContent('@app/views/layouts/base.php'); ?><?php $this->endContent(); ?>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
