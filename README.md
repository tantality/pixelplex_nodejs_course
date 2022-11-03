# PixelPlex Nodejs_course

### Разработчик **Третьяк Ангелина**.

## Тема проекта "Flashсards".

В рамках данного проекта необходимо разработать бэкэнд для приложения, позволяющего изучать иностранные слова по технике флэш-карточек.

## Функциональность приложения.

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

# Entities and relations

## Entities

```TypeScript
1. Language:
{
  id: number,
  name: string,
  code: string,
  createdAt: Date,
  updatedAt: Date
}

2. User:
{
  id: number,
  mainLanguageId: number,
  name: string,
  email: string,
  password: string,
  role: string,
  refreshToken: string,
  createdAt: Date,
  updatedAt: Date
}

3. UserCard:
{
  userId: number,
  cardId: numebr,
  createdAt: Date,
  updatedAt: Date
}

4. Card:
{
  id: number,
  createdAt: Date,
  updatedAt: Date
}

5. Translation:
{
  id: number,
  languageId: number,
  meaningId: number,
  cardId: number,
  createdAt: Date,
  updatedAt: Date
}

6. Meaning:
{
  id: number,
  name: string,
  createdAt: Date,
  updatedAt: Date
}

7. UserTask:
{
  userId: number,
  taskId: number,
  createdAt: Date,
  updatedAt: Date
}

8. Task:
{
  id: number,
  type: string,
  answerStatus: string,
  hiddenWordId: number,
  receivedAnswer: string,
  createdAt: Date,
  updatedAt: Date
}

9. TaskCorrectAnswer:
{
  taskId: number,
  translationId: number,
  createdAt: Date,
  updatedAt: Date
}
```

## Relations

```TypeScript
1. Language - User: one-to-many relation
Language.id(PK) - User.mainLanguageId(FK)

2. User - UserCard: one-to-many relation
User.id(PK) - UserCard.userId(FK)

3. Card - UserCard: one-to-many relation
Card.id(PK) - UserCard.cardId(FK)

4. Card - Translation: one-to-many relation
Card.id(PK) - Translation.cardId(FK)

5. Language - Translation: one-to-many relation
Language.id(PK) - Translation.languageId(FK)

6. Translation - Meaning: one-to-many relation
Meaning.id(PK) - Translation.meaningId(FK)

7. User - UserTask: one-to-many relation
User.id(PK) - UserTask.userId(FK)

8. Task - UserTask: one-to-many relation
Task.id(PK) - UserTask.taskId(FK)

9. Translation - Task: one-to-many relation
Translation.id(PK) - Task.hiddenWordId(FK)

10. Task - TaskCorrectAnswer: one-to-many relation
Task.id(PK) - TaskCorrectAnswer.taskId(FK)

11. Translation - TaskCorrectAnswer: one-to-many relation
Translation.id(PK) - TaskCorrectAnswer.translationId(FK)
```
