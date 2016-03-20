<?php

use yii\db\Schema;
use yii\db\Migration;

class m150930_130752_create_session_table extends Migration
{
    public function up()
    {
        $this->createTable('session',[
            'id' => "varchar(40) NOT NULL",
            'expire' => "int(12)",
            'data' => "blob",
        ]);
        $this->addPrimaryKey('idx','session','id');
    }

    public function down()
    {
        $this->dropTable('{{%session}}');

        return true;
    }
}
