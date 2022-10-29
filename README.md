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

### Auth

```TypeScript
AuthDTO{
  id: string,
  accessToken: string,
  refreshToken: string
}

UserDTO{
  id: string,
  name: string,
  email: string,
  mainLanguageId: string
}
```

- `POST api/v1/auth/login` - эндпоинт для логина пользователя.

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
    statusCode: 200,
    message: "Authentification succeeded.",
    user: {
    ...AuthDTO,
    ...UserDTO
   }
  }
  ```

- `GET api/v1/auth/logout` - эндпоинт для выхода пользователя из системы. Id пользователя получается из accessToken.
  Возвращает следующий DTO:
  ```TypeScript
  {
    statusCode: 200,
    message: "The user logged out."
  }
  ```
- `GET api/v1/auth/refreshTokens` - эндпоинт для обнолвления токенов пользователя. Id пользователя получается из accessToken.

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "Tokens have been updated.",
    user: {
     ...UserDTO,
     ...AuthDTO
    }
  }
  ```

### Users

- `POST api/v1/users` - эндпоинт для создания пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    name: string,
    password: string,
    email: string,
    mainLanguageId: string
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 201,
    message: "The user has been registered.",
    user: {
     ...UserDTO,
     ...AuthDTO
    }
  }
  ```

- `PATCH api/v1/users/{userId}` - эндпоинт для редактирование данных пользователя.

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    name: string,
    email: string,
    mainLanguageId: string
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "User data has been updated.",
    user: UserDTO
  }
  ```

### Languages

```TypeScript
LanguageDTO{
  id: string,
  name: string,
  code: string,
  dateAdded: Date
}
```

- `GET api/v1/languages` - эндпоинт для получения списка языков.

  Возможно установить следующие query parameters:

  ```TypeScript
  search: string,
  page: number,
  limit: number,
  sort: "date" | "name",
  sortDirection: "asc" | "desc"
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "The list of languages was received.",
    languages: Array<LanguageDTO>
  }
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
  {
    statusCode: 201,
    message: "The language was created.",
    language: LanguageDTO
  }
  ```

- `PАTCH api/v1/languages/{languageId}` - эндпоинт для обновления определенного языка.

  Принимает следующий параметр:

  ```TypeScript
  languageId: string
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
  {
    statusCode: 200,
    message: "The language has been updated.",
    language: LanguageDTO
  }
  ```

- `DELETE api/v1/languages/{languageId}` - эндпоинт для удаления определенного языка.

  Принимает следующий параметр:

  ```TypeScript
  languageId: string
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "The language has been deleted."
  }
  ```

### Users/Cards

```TypeScript
UserCardDTO{
  cardId: string,
  words: Array<TranslationDTO>,
  addDate: Date
}

TranslationDTO{
  id: string,
  languageId: string,
  meanings: Array<MeaningDTO>
}

MeaningDTO{
  id: string,
  name: string
}
```

- `GET api/v1/users/{userId}/cards` - эндпоинт для получения списка карточек пользователя.

  Принимает следующий параметр:

  ```TypeScript
  userId: string
  ```

  Возможно установить следующие query parameters:

  ```TypeScript
  search: string,
  page: number,
  limit: number,
  filter: "all" | languageId,
  sort: "date" | "word",
  sortDirection: "asc" | "desc"
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "The user's cards have been received.",
    cards: Array<UserCardDTO>
  }
  ```

- `POST api/v1/users/{userId}/cards` - эндпоинт для создания карточки пользователя.

  Принимает следующий параметр:

  ```TypeScript
  userId: string
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    translations: [
     {
       languageId: string,
       meanings: string[]
     }
    ]
  }

   Массив translations должен содержать минимум 2 перевода.
   Если languageId совпадает с mainLanguageId пользователя, то в массив meanings можно добавить только одно значение.
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 201,
    message: "The user card has been created.",
    card: UserCardDTO
  }
  ```

- `POST api/v1/users/{userId}/cards/{cardId}/translations` - эндпоинт для добавления переводов слова в карточку пользователя.

  Принимает следующие параметры:

  ```TypeScript
  userId: string,
  cardId: string
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    translations: [
     {
       languageId: string,
       meanings: string[]
     }
    ]
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 201,
    message: "The translation(s) were successfully added to the user's card.",
    card: UserCardDTO
  }
  ```

- `PАTCH api/v1/users/{userId}/cards/{cardId}` - эндпоинт для обновления переводов определенной карточки пользователя.

  Принимает следующие параметры:

  ```TypeScript
  userId: string,
  cardId: string
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    translations: Array<TranslationDTO>
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "The user card has been updated.",
    card: UserCardDTO
  }
  ```

- `DELETE api/v1/users/{userId}/cards/{cardId}` - эндпоинт для удаления определенной карточки пользователя.

  Принимает следующие параметры:

  ```TypeScript
  userId: string,
  cardId: string
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "The user card has been deleted."
  }
  ```

### Users/Tasks

```TypeScript
UserTaskDTO{
  id: string,
  type: "to_base_lang" | "to_studied_lang",
  answerStatus: string,
  hiddenWord: string,
  correctAnswers: string[],
  receivedAnswer: string,
  addDate: Date
}
```

- `GET api/v1/users/{userId}/tasks` - эндпоинт для получения списка заданий пользователя.

  Принимает следующий параметр:

  ```TypeScript
  userId: string
  ```

  Возможно установить следующие query parameters:

  ```TypeScript
  search: string,
  page: number,
  limit: number,
  filterByLang: "all" | languageId,
  filterByAnswerStatus: "all" | "unanswered" | "correct" | "incorrect",
  sort: "date",
  sortDirection: "asc" | "desc"
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "The list of user tasks was received.",
    tasks: Array<UserTaskDTO>
  }
  ```

- `POST api/v1/users/{userId}/tasks/statistics` - эндпоинт для получения статистики ответов на задания пользователя.

  Принимает следующий параметр:

  ```TypeScript
  userId: string
  ```

  Возможно установить следующие query parameters:

  ```TypeScript
  fromDate: Date,
  toDate: Date
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    languageIds: string[],
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "Statistics on user answers to tasks were received.",
    statistics: [
     {
       language: LanguageDTO,
       answers: {
         all: string,
         correct: string,
         incorrect: string
       }
     }
    ]
  }
  ```

- `POST api/v1/users/{userId}/tasks` - эндпоинт создания задания для пользователя.

  Принимает следующий параметр:

  ```TypeScript
  userId: string
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    languageId: string,
    type: "to_base_lang" | "to_studied_lang"
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 201,
    message: "The task has been created for the user.",
    task: {
      id: string,
      word: string
    }
  }
  ```

- `PATCH api/v1/users/{userId}/tasks/{taskId}` - эндпоинт для отправки ответа на задание.

  Принимает следующие параметры:

  ```TypeScript
  userId: string,
  taskId: string
  ```

  Ожидает следующее тело запроса:

  ```TypeScript
  {
    answer: string
  }
  ```

  Возвращает следующий DTO:

  ```TypeScript
  {
    statusCode: 200,
    message: "The answer to the task was recorded.",
    task: UserTaskDTO
  }
  ```
