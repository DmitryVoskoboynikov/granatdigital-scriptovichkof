<?php

namespace app\common\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\common\models\Script;

/**
 * ScriptSearch represents the model behind the search form about `app\models\Country`.
 *
 * @author Voskoboynikov Dmitry <voskoboynikov@granat-digital.ru>
 */
class ScriptSearch extends Script
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
        $query = Script::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            return $dataProvider;
        }

        $query->andFilterWhere(['like', 'title', $this->title]);
        $query->andFilterWhere(['like', 'target', $this->target]);

        return $dataProvider;
    }
}
