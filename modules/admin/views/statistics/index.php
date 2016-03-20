<div class="center-block">
    <h2>Cкрипты</h2>
    <table class="table">
        <thead>
        <tr>
            <th>Title</th>
            <th>Target</th>
            <th>Conversion</th>
            <th>Pass</th>
        </tr>
        </thead>
        <tbody>
        <?php foreach($scripts as $script): ?>
            <tr>
                <td><a href="#"><?= $script->title ?></a></td>
                <td><?= $script->target ?></td>
                <td><?= $script->conversion_success === 0 ? '0%' : sprintf('%05.2f', $script->conversion_success * 100 / $script->conversion_count) . '%' ?></td>
                <td><?= $script->conversion_count ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>