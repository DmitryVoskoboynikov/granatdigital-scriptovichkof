<?php

use yii\db\Schema;
use yii\db\Migration;

class m151125_154051_create_steps_stats_table extends Migration
{
    public function up()
    {
        $tableOptions = null;

        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%steps_stats}}', [
            'id' => $this->primaryKey(),
            'script_id' => $this->integer()->notNull(),
            'user_id' => $this->integer()->notNull(),
            'step_id' => $this->integer()->notNull(),
            'forced_interruption' => $this->integer()->defaultValue(0),
            'unexpected_answer' => $this->integer()->defaultValue(0),
        ], $tableOptions);

        $this->addForeignKey('script_steps_stats_fk', '{{%steps_stats}}', 'script_id', '{{%scripts}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('user_steps_stats_fk', '{{%steps_stats}}', 'user_id', '{{%users}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('step_steps_stats_fk', '{{%steps_stats}}', 'step_id', '{{%steps}}', 'id', 'CASCADE', 'CASCADE');
    }

    public function down()
    {
        $this->dropForeignKey('script_steps_stats_fk', '{{%steps_stats}}');
        $this->dropForeignKey('user_steps_stats_fk', '{{%steps_stats}}');
        $this->dropForeignKey('step_steps_stats_fk', '{{%steps_stats}}');
        $this->dropTable('{{%steps_stats}}');

        return true;
    }
}
