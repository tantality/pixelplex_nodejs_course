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
  mainLanguageId: number
}
```

- `POST api/v1/auth/sign-up` - эндпоинт для регистрации пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    name: string,
    password: string,
    email: string,
    mainLanguageId: number
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { auth: { ...AuthDTO } }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The user with the specified email already exists."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Invalid email."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Invalid name."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Invalid password."}
    ```

- `POST api/v1/auth/log-in` - эндпоинт для логина пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    password: string,
    email: string
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    user: {
    ...AuthDTO,
    ...UserDTO
   }
  }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "The user with the specified email does not exist."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Invalid password."}
    ```

- `POST api/v1/auth/refresh-tokens` - эндпоинт для обнолвления токенов пользователя.

  Возвращает следующий DTO:

  ```TypeScript
  {
    user: {
     ...UserDTO,
     ...AuthDTO
    }
  }
  ```

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

### Users

- `PATCH api/v1/users` - эндпоинт для редактирования данных пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  { mainLanguageId: number }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { user: UserDTO }
  ```

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
  limit: number,
  sortBy: "date" | "name",
  sortDirection: "asc" | "desc"
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
     { statusCode: 400, message: "Invalid query parameter(s)."}
    ```

- `GET api/v1/languages/{languageId}` - эндпоинт для получения информации по определенному языку.

  Принимает следующий параметр:

  ```TypeScript
  languageId: number
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { language: LanguageDTO }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```

- `POST api/v1/languages` - эндпоинт для создания языка.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    name: string,
    code: string
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { language: LanguageDTO }
  ```

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
     { statusCode: 400, message: "Invalid code."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Invalid name."}
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

  Возвращает следующий DTO:

  ```TypeScript
  { language: LanguageDTO }
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
     { statusCode: 400, message: "The language with the specified code already exists."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Invalid code."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Invalid name."}
    ```

- `DELETE api/v1/languages/{languageId}` - эндпоинт для удаления определенного языка.

  Принимает следующий параметр:

  ```TypeScript
  languageId: number
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { languageId: number }
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

### Cards

```TypeScript
CardDTO{
  id: number,
  translations: Array<TranslationDTO>,
  createdAt: Date
}

TranslationDTO{
  id: number,
  languageId: number,
  meanings: Array<MeaningDTO>
}

MeaningDTO{
  id: number,
  name: string
}
```

- `GET api/v1/cards` - эндпоинт для получения списка карточек пользователя.

  Возможно установить следующие query parameters:

  ```TypeScript
  search?: string,
  offset: number,
  limit: number,
  languageId: number,
  sortBy: "date" | "word",
  sortDirection: "asc" | "desc"
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
     { statusCode: 400, message: "Invalid query parameter(s)."}
    ```

- `POST api/v1/cards` - эндпоинт для создания карточки пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    translations: [
     {
       languageId: number,
       meanings: string[]
     }
    ]
  }

   Массив translations должен содержать минимум 2 перевода.
   Если languageId совпадает с mainLanguageId пользователя, то в массив meanings можно добавить только одно значение.
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { card: CardDTO }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Language(s) not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The card with the specified data has already been created."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The translations array containing at least 2 elements was not received."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The elements of the translations array must contain unique language identifiers."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The meanings array containing a single value for the main language was not passed."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The meanings array(s) contains invalid values."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Translation(s) into the specified languages is/are not contained in the card."}
    ```

- `PUT api/v1/cards/{cardId}` - эндпоинт для обновления переводов определенной карточки пользователя.

  Принимает следующий параметр:

  ```TypeScript
  cardId: number
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  { translations: Array<TranslationDTO> }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { card: CardDTO }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Card not found."}
    ```
  - ```TypeScript
     { statusCode: 404, message: "Language(s) not found."}
    ```
  - ```TypeScript
     { statusCode: 404, message: "Translation(s) not found."}
    ```
  - ```TypeScript
     { statusCode: 404, message: "Meaning(s) not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "A valid array of translations was not received."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The elements of the translations array must contain unique language identifiers."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The meanings array containing a single value for the main language was not passed."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "The meanings array(s) contains invalid values."}
    ```

- `DELETE api/v1/cards/{cardId}` - эндпоинт для удаления определенной карточки пользователя.

  Принимает следующий параметр:

  ```TypeScript
  cardId: number
  ```

  Возвращает следующий DTO:

  ```TypeScript
  { cardId: number }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Card not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```

### Tasks

```TypeScript
TaskDTO{
  id: number,
  type: "to_main_lang" | "to_studied_lang",
  answerStatus: string,
  hiddenWordId: number,
  correctAnswers: string[],
  receivedAnswer: string,
  createdAt: Date
}
```

- `GET api/v1/tasks` - эндпоинт для получения списка заданий пользователя.

  Возможно установить следующие query parameters:

  ```TypeScript
  search?: string,
  offset: number,
  limit: number,
  languageId: number,
  taskStatus: "unanswered" | "correct" | "incorrect",
  sortBy: "date",
  sortDirection: "asc" | "desc"
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
     { statusCode: 400, message: "Invalid query parameter(s)."}
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
         correct: string,
         incorrect: string
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
     { statusCode: 400, message: "Invalid query parameter(s)."}
    ```

- `POST api/v1/tasks` - эндпоинт создания задания для пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    languageId: number,
    type: "to_main_lang" | "to_studied_lang"
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    task: {
      id: number,
      languageId: number,
      word: string,
      type: "to_main_lang" | "to_studied_lang",
    }
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
     { statusCode: 400, message: "The languageId must be different from the user's main languageId."}
    ```
  - ```TypeScript
     { statusCode: 400, message: "Invalid task type."}
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

  Возвращает следующий DTO:

  ```TypeScript
  { task: TaskDTO }
  ```

  Возможные ошибки:

  - ```TypeScript
     { statusCode: 404, message: "Task not found."}
    ```
  - ```TypeScript
     { statusCode: 401, message: "Access token is missing or invalid."}
    ```
