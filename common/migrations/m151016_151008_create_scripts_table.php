<?php

use yii\db\Schema;
use yii\db\Migration;

class m151016_151008_create_scripts_table extends Migration
{
    public function up()
    {
        $tableOptions = null;

        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%scripts}}', [
            'id' => $this->primaryKey(),
            'title' => $this->string()->notNull(),
            'target' => $this->string()->notNull(),
            'scale' => $this->float()->notNull()->defaultValue(1.0),
            'conversion_count' => $this->integer()->notNull()->defaultValue(0),
            'conversion_success' => $this->integer()->notNull()->defaultValue(0),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ], $tableOptions);

        $columns = ['id', 'title', 'target', 'created_at', 'updated_at'];

        $this->batchInsert('{{%scripts}}', $columns, [
           [
               1,
               'test',
               'Make an appointment',
               time(),
               time(),
           ]
        ]);
    }

    public function down()
    {
        $this->dropTable('{{%scripts}}');

        return true;
    }
}
