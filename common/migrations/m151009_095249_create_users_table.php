<?php

use yii\db\Migration;
use app\common\models\User;

class m151009_095249_create_users_table extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%users}}', [
            'id' => $this->primaryKey(),
            'username' => $this->string()->notNull()->unique(),
            'auth_key' => $this->string(32)->notNull(),
            'password_hash' => $this->string()->notNull(),
            'password_reset_token' => $this->string()->unique(),
            'email' => $this->string()->notNull()->unique(),
            'status' => $this->smallInteger()->notNull()->defaultValue(10),
            'group' => $this->smallInteger()->notNull()->defaultValue(1),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull(),
        ], $tableOptions);

        $security = Yii::$app->security;
        $columns = ['id', 'group', 'email', 'username', 'password_hash', 'status', 'created_at', 'updated_at', 'auth_key'];

        $this->batchInsert('{{%users}}', $columns, [
            [
                1,
                User::ROLE_SUPER_ADMIN,
                'super-admin@granat-digital.ru',
                'super_admin',
                $security->generatePasswordHash('super_admin'),
                User::STATUS_ACTIVE,
                time(),
                time(),
                $security->generateRandomString(),
            ],
        ]);

        $this->batchInsert('{{%users}}', $columns, [
            [
                2,
                User::ROLE_ADMIN,
                'admin@granat-digital.ru',
                'admin',
                $security->generatePasswordHash('admin'),
                User::STATUS_ACTIVE,
                time(),
                time(),
                $security->generateRandomString(),
            ],
        ]);

        $this->batchInsert('{{%users}}', $columns, [
            [
                3,
                User::ROLE_OPERATOR,
                'operator@granat-digital.ru',
                'operator',
                $security->generatePasswordHash('operator'),
                User::STATUS_ACTIVE,
                time(),
                time(),
                $security->generateRandomString(),
            ],
        ]);
    }

    public function down()
    {
        $this->dropTable('{{%users}}');

        return true;
    }
}
