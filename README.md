## Требования:

* php-fpm
* Mysql
* nginx
* Yii2 framework
* codeception

## Installation:

### Миграции:
    1. yii migrate --migrationPath=@yii/rbac/migrations
    2. yii migrate/up

### Что готово по текущему тз.

1. Авторизация Пользователя.
2. Функционал пользователя с правами Администратор.
    a) Просмотр раздела Скрипты.
    б) [Скрипты] Создать новый скрипт
    в) [Скрипты] Копировать скрипт
    д) [Скрипты] Удалить скрипт
    г) [Скрипты]Задать Цель
       скрипта
    e) [Скрипты]Просмотреть список созданных скриптов
    ж) [Скрипты] Переключиться на другой скрипт
    з) [Скрипты] Конструктор скриптов
    и) [Скрипты] Конструктор скриптов - Создание шага.
    к) [Скрипты] Конструктор скриптов – Редактирование шага
    л) [Скрипты] Конструктор скриптов – Редактирование ответа
    м) [Скрипты] Конструктор скриптов – Удаление шага
    н) [Скрипты] Просмотреть скрипт оператором
    о) [Скрипты] Доступ пользователей
    п) [Скрипты] Конверсия
    р) [Скрипты] Конверсия — Карта скрипта
    c) [Скрипты] Конверсия — Блок конверсия операторов
    т) [Скрипты] Конверсия — Блок общей статистики
    у) [Скрипты] Перейти на Панель скриптов

3. Функционал пользователя с правами Оператор