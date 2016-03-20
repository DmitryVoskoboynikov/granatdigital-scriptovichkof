<?php

use yii\db\Schema;
use yii\db\Migration;

use app\common\models\User;

class m151201_091252_add_status_inactive_to_users_table extends Migration
{
    public function up()
    {
        $this->alterColumn('{{%users}}', 'status', $this->smallInteger()->notNull()->defaultValue(USER::STATUS_INACTIVE));
    }

    public function down()
    {
        $this->alterColumn('{{%users}}', 'status', $this->smallInteger()->notNull()->defaultValue(USER::STATUS_ACTIVE));

        return true;
    }
}
