<?php

namespace app\common\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\common\models\User;

/**
 * UserSearch represents the model behind the search form about `app\models\Country`.
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class UserSearch extends User
{
    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = User::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            return $dataProvider;
        }

        $query->andFilterWhere(['like', 'username', $this->username]);
        $query->andFilterWhere(['like', 'email', $this->email]);
        $query->andFilterWhere(['status' => $this->status]);
        $query->andFilterWhere(['group' => $this->group]);

        return $dataProvider;
    }

    /**
     * Find the user by email
     *
     * @return \yii\db\ActiveQuery
     */
    public static function findByEmail($email, $group = self::ROLE_OPERATOR)
    {
        return User::findOne(['email' => trim($email), 'group' => $group]);
    }
}
