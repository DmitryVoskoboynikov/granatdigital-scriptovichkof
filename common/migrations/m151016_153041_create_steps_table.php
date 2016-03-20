<?php

use yii\db\Schema;
use yii\db\Migration;

class m151016_153041_create_steps_table extends Migration
{
    public function up()
    {
        $tableOptions = null;

        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%steps}}', [
            'id' => $this->primaryKey(),
            'script_id' => $this->integer()->notNull(),
            'is_start' => $this->integer()->notNull(),
            'is_target' => $this->boolean()->defaultValue(false),
            'title' => $this->text(),
            'description' => $this->text(),
            'position_x' => $this->float()->defaultValue('0.0'),
            'position_y' => $this->float()->defaultValue('0.0'),
        ], $tableOptions);

        $columns = ['id', 'script_id', 'is_start', 'is_target', 'title', 'description', 'position_x', 'position_y'];

        $this->batchInsert('{{%steps}}', $columns, [
            [
                1,
                1,
                true,
                false,
                'Старт',
                'Начало Инструкции оператору, что он должен говорить.',
                92,
                266,
            ]
        ]);

        $this->batchInsert('{{%steps}}', $columns, [
            [
                2,
                1,
                false,
                true,
                'Цель',
                'Цель',
                343,
                44,
            ]
        ]);

        $this->batchInsert('{{%steps}}', $columns, [
           [
               3,
               1,
               false,
               false,
               'Шаг 2',
               'Шаг 2',
               437,
               336,
           ]
        ]);

        $this->batchInsert('{{%steps}}', $columns, [
           [
               4,
               1,
               false,
               false,
               'Шаг 3',
               'Шаг 3',
               610,
               141,
           ]
        ]);

        $this->addForeignKey('script_step_fk', '{{%steps}}', 'script_id', '{{%scripts}}', 'id', 'CASCADE', 'CASCADE');
    }

    public function down()
    {
        $this->dropTable('{{%steps}}');

        return true;
    }
}
