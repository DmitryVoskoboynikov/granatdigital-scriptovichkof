<?php

use yii\db\Schema;
use yii\db\Migration;

class m151125_130629_create_scripts_stats_table extends Migration
{
    public function up()
    {
        $tableOptions = null;

        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%scripts_stats}}', [
            'id' => $this->primaryKey(),
            'script_id' => $this->integer()->notNull(),
            'user_id' => $this->integer()->notNull(),
            'passages_count' => $this->integer()->defaultValue(0),
            'success_count' => $this->integer()->defaultValue(0),
            'conversion_count' => $this->integer()->defaultValue(0),
        ], $tableOptions);

        $this->addForeignKey('script_scripts_stats_fk', '{{%scripts_stats}}', 'script_id', '{{%scripts}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('user_scripts_stats_fk', '{{%scripts_stats}}', 'user_id', '{{%users}}', 'id', 'CASCADE', 'CASCADE');
    }

    public function down()
    {
        $this->dropForeignKey('script_scripts_stats_fk', '{{%scripts_stats}}');
        $this->dropForeignKey('user_scripts_stats_fk', '{{%scripts_stats}}');
        $this->dropTable('{{%scripts_stats}}');

        return true;
    }
}
