<?php

use yii\db\Schema;
use yii\db\Migration;

class m151020_123546_create_users_scripts_table extends Migration
{
    public function up()
    {
        $tableOptions = null;

        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%user_script}}', [
            'user_id' => $this->integer(),
            'script_id' => $this->integer(),
            'PRIMARY KEY (user_id,script_id)'
        ], $tableOptions);

        $columns = ['user_id', 'script_id'];

        $this->batchInsert('{{%user_script}}', $columns, [
            [
                2,
                1
            ]
        ]);

        $this->addForeignKey('user_script_user_fk', '{{%user_script}}', 'user_id', '{{%users}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('user_script_script_fk', '{{%user_script}}', 'script_id', '{{%scripts}}', 'id', 'CASCADE', 'CASCADE');
    }

    public function down()
    {
        $this->dropTable('{{%user_script}}');

        return true;
    }
}
