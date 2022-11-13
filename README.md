# PixelPlex Nodejs_course

### Разработчик **Третьяк Ангелина**.

# Тема проекта "Flashсards".

В рамках данного проекта необходимо разработать бэкэнд для приложения, позволяющего изучать иностранные слова по технике флэш-карточек.

# Функциональность приложения.

Реализовать четыре основные сущности: **пользователь, язык, карточка, задание**.

### **Пользователь**:

- Пользователи могут иметь одну из двух ролей: user, admin.
- Регистрация пользователя происходит по электронной почте, имени пользователя и паролю. Email должен быть уникальным. Пароль должен состоять не менее чем из 8 латинских символов нижнего и верхнего регистра, как минимум одной цифры и как минимум одного спецсимвола (!@#$%^&\*()\_+=). Имя пользователя должно иметь длину не менее 5 и не более 256 символов.
- Вход в аккаунт осуществляется по email и паролю.
- Пользователь с ролью “admin” создается с помощью миграции (установить стандартные параметры для входа: email: admin@admin.com, password:
  Admin123!, username: admin).

### **Язык**:

- Пользователь с ролью “admin” может создавать, редактировать и удалять языки.
- Сущность язык включает в себя полное название (например, “English”) и уникальный код языка (например, “en”).
- Авторизованный пользователь может просматривать список всех доступных языков. Список должен включать пагинацию и возможность сортировки по дате добавления (по возрастанию и по убыванию) и по названию (по возрастанию и по убыванию), а также регистронезависимый поиск по названию языка.
- Если админ добавляет новый язык, необходимо уведомить об этом всех пользователей (продемонстрировать работу уведомления через html страницу).

### **Карточка**:

- Авторизованный пользователь может создавать, редактировать и удалять карточки. Необходимо запрещать создание одинаковых слов для одного и того же языка.
- Сущность карточка должна включать в себя слово на родном языке, перевод слова на иностранный язык (**\*реализовать возможность добавления нескольких вариантов перевода**).
- Авторизованный пользователь может просматривать список карточек выбранного языка. Список должен включать пагинацию и возможность сортировки по дате добавления (по возрастанию и по убыванию), по слову на родном/иностранном языке (по возрастанию и по убыванию), а также регистронезависимый поиск по слову на родном/иностранном языке.

### **Задание**:

- Авторизованный пользователь может получить задание. Для этого необходимо передать в запрос идентификатор языка и тип задания (to_foreign/to_native). Запрос возвращает идентификатор задания и слово на родном/иностранном языке в зависимости от типа задания.
- Авторизованный пользователь может ответить на задание. Запрос принимает идентификатор задания и перевод. Возвращает результат “верно/неверно”.
- Авторизованный пользователь может просмотреть список неотвеченных заданий для выбранного языка. Список должен включать пагинацию и возможность сортировки по дате добавления (по возрастанию и по убыванию), а также регистронезависимый поиск по слову из формулировки задания.
- Авторизованный пользователь может просмотреть статистику по правильным/неправильным ответам за выбранный период и по выбранным языкам.

# API

Id пользователя получается из accessToken.

### Auth

```TypeScript
AuthDTO{
  id: number,
  accessToken: string,
  refreshToken: string
}

UserDTO{
  id: number,
  name: string,
  email: string,
  nativeLanguageId: number
}
```

- `POST api/v1/auth/sign-up` - эндпоинт для регистрации пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    name: string,
    password: string,
    email: string,
    nativeLanguageId: number
  }
  ```

  Возвращает `AuthDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The user with the specified email already exists."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `POST api/v1/auth/log-in` - эндпоинт для логина пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    password: string,
    email: string
  }
  ```

  Возвращает `AuthDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "The user with the specified email does not exist."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Invalid password."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `POST api/v1/auth/refresh-tokens` - эндпоинт для обнолвления токенов пользователя.

  Возвращает `AuthDTO`

  Возможная ошибка:

  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```

- `GET api/v1/auth/log-out` - эндпоинт для выхода пользователя из системы.

  Возвращает следующий DTO:

  ```TypeScript
  { id: number }
  ```

  Возможная ошибка:

  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```

- `GET api/v1/auth/me` - эндпоинт для получения данных пользоватлея.

  Возвращает `UserDTO`

  Возможная ошибка:

  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```

### Users

- `PATCH api/v1/users` - эндпоинт для редактирования данных пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  { nativeLanguageId: number }
  ```

  Возвращает `UserDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```

### Languages

```TypeScript
LanguageDTO{
  id: number,
  name: string,
  code: string,
  createdAt: Date
}
```

- `GET api/v1/languages` - эндпоинт для получения списка языков.

  Возможно установить следующие query parameters:

  ```TypeScript
  search?: string,
  offset: number,
  limit: number = 20,
  sortBy: "date" | "name" = "date",
  sortDirection: "asc" | "desc" = "asc"
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    count: number,
    languages: Array<LanguageDTO>
  }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `GET api/v1/languages/{languageId}` - эндпоинт для получения информации по определенному языку.

  Принимает следующий параметр:

  ```TypeScript
  languageId: number
  ```

  Возвращает `LanguageDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `POST api/v1/languages` - эндпоинт для создания языка.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    name: string,
    code: string
  }
  ```

  Возвращает `LanguageDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 403, message: "This action is available only to the administrator."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The language with the specified code already exists."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `PUT api/v1/languages/{languageId}` - эндпоинт для обновления определенного языка.

  Принимает следующий параметр:

  ```TypeScript
  languageId: number
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    name: string,
    code: string
  }
  ```

  Возвращает `LanguageDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 403, message: "This action is available only to the administrator."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The language with the specified code already exists."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `DELETE api/v1/languages/{languageId}` - эндпоинт для удаления определенного языка.

  Принимает следующий параметр:

  ```TypeScript
  languageId: number
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { id: number }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 403, message: "This action is available only to the administrator."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

### Cards

```TypeScript
CardDTO{
  id: number,
  nativeLanguageId: number,
  nativeMeanings: Array<MeaningDTO>,
  foreignLanguageId: number,
  foreignMeanings: Array<MeaningDTO>,
  createdAt: Date
}

MeaningDTO{
  id: number,
  value: string
}
```

- `GET api/v1/cards` - эндпоинт для получения списка карточек пользователя.

  Возможно установить следующие query parameters:

  ```TypeScript
  search?: string,
  offset: number,
  limit: number = 20,
  languageId: number,
  sortBy: "date" | "word" = "date",
  sortDirection: "asc" | "desc" = "asc"
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    count: number,
    cards: Array<CardDTO>
  }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `POST api/v1/cards` - эндпоинт для создания карточки пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    nativeMeanings: string[],
    foreignLanguageId: number,
    foreignMeanings: string[]
  }

  В массивы meanings можно добавить не более 3 значений.
  ```

  Возвращает `CardDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The card with the specified data has already been created."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `PATCH api/v1/cards/{cardId}` - эндпоинт для обновления карточки пользователя.

  Принимает следующий параметр:

  ```TypeScript
  cardId: number
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    nativeMeanings: Array<MeaningDTO>,
    foreignLanguageId: number,
    foreignMeanings: Array<MeaningDTO>,
  }
  ```

  Возвращает `CardDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Card not found."}
    ```
  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 404, message: "Meaning(s) not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `DELETE api/v1/cards/{cardId}` - эндпоинт для удаления определенной карточки пользователя.

  Принимает следующий параметр:

  ```TypeScript
  cardId: number
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { id: number }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Card not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

### Tasks

```TypeScript
TaskDTO{
  id: number,
  nativeLanguageId: number,
  foreignLanguageId: number,
  type: "to_native" | "to_foreign",
  answerStatus: "unanswered" | "correct" | "incorrect",
  hiddenWordId: number,
  correctAnswers?: string[],
  receivedAnswer?: string,
  createdAt: Date
}
```

- `GET api/v1/tasks` - эндпоинт для получения списка заданий пользователя.

  Возможно установить следующие query parameters:

  ```TypeScript
  search?: string,
  offset: number,
  limit: number = 20,
  languageId: number,
  taskStatus: "unanswered" | "correct" | "incorrect",
  sortBy: "date" = "date",
  sortDirection: "asc" | "desc" = "asc"
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    count: number,
    tasks: Array<TaskDTO>
  }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `POST api/v1/tasks/statistics` - эндпоинт для получения статистики ответов на задания пользователя.

  Возможно установить следующие query parameters:

  ```TypeScript
  fromDate: Date,
  toDate: Date,
  languageIds: number[]
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statistics: [
     {
       language: LanguageDTO,
       answers: {
         correct: number,
         incorrect: number
       }
     }
    ]
  }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `POST api/v1/tasks` - эндпоинт создания задания для пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    foreignLanguageId: number,
    type: "to_native" | "to_foreign"
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    id: number,
    nativeLanguageId: number,
    foreignLanguageId: number,
    word: string,
    type: "to_native" | "to_foreign",
  }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "ForeignLanguageId must be different from the user's nativeLanguageId."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "No cards were created for the specified language."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```

- `POST api/v1/tasks/{taskId}/answer` - эндпоинт для отправки ответа на задание.

  Принимает следующий параметр:

  ```TypeScript
  taskId: number
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  { answer: string }
  ```

  Возвращает `TaskDTO`

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Task not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Validation error(s)."}
    ```
