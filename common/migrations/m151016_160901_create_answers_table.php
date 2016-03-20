<?php

use yii\db\Schema;
use yii\db\Migration;

class m151016_160901_create_answers_table extends Migration
{
    public function up()
    {
        $tableOptions = null;

        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%answers}}', [
            'id' => $this->primaryKey(),
            'script_id' => $this->integer(),
            'start_id' => $this->integer()->notNull(),
            'finish_id' => $this->integer()->notNull(),
            'text' => $this->string(),
        ], $tableOptions);

        $columns = ['id', 'script_id', 'start_id', 'finish_id', 'text'];

        $this->batchInsert('{{%answers}}', $columns, [
            [
                1,
                1,
                1,
                3,
                'Ответ 1',
            ]
        ]);

        $this->batchInsert('{{%answers}}', $columns, [
            [
                2,
                1,
                1,
                2,
                'Ответ 2',
            ]
        ]);

        $this->batchInsert('{{%answers}}', $columns, [
            [
                3,
                1,
                3,
                4,
                'Ответ 3',
            ]
        ]);

        $this->batchInsert('{{%answers}}', $columns, [
            [
                4,
                1,
                4,
                2,
                'Ответ 4',
            ]
        ]);

        $this->batchInsert('{{%answers}}', $columns, [
           [
               5,
               1,
               1,
               1,
               'Ответ 5',
           ]
        ]);

        $this->batchInsert('{{%answers}}', $columns, [
           [
               6,
               1,
               1,
               2,
               'Ответ 6',
           ]
        ]);

        $this->addForeignKey('script_answer_fk', '{{%answers}}', 'script_id', '{{%scripts}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('start_step_fk', '{{%answers}}', 'start_id', '{{%steps}}', 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('finish_step_fk', '{{%answers}}', 'finish_id', '{{%steps}}', 'id', 'CASCADE', 'CASCADE');
    }

    public function down()
    {
        $this->dropTable('{{%answers}}');

        return true;
    }
}
