# Проектная работа "WebLarek. Плохой сервер.", спринт 17

## Об авторе

- **Автор:** Alex Climanov
- **Когорта:** 17
- **Курс:** Веб-разработчик (Яндекс Практикум)
- **Репозиторий:** https://github.com/autoclaiming/bad-server
- **Опубликованная версия:** не публиковалась

## Подготовка к работе

1. Склонировать репозиторий
2. Создать файл `backend/.env` на основе `backend/.env.example` и указать в нём собственные значения секретов
   (`AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`, `CSRF_SECRET`).
3. Запустить docker

```bash
docker compose up -d
```

4. Наполнить базу данных
   [README.md](.dump%2FREADME.md)
5. Перейти по адресу http://localhost/ и на странице должны быть продукты.
6. На странице http://localhost/login/ можно авторизоваться.
7. Админка находится по адресу http://localhost/admin/

