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
  nativeLanguageId: number,
  name: string,
  email: string,
  normalizedEmail: string,
  password: string,
  role: string,
  refreshToken: string,
  createdAt: Date,
  updatedAt: Date
}

3. Card:
{
  id: number,
  userId: number,
  nativeLanguageId: number,
  foreignLanguageId: number,
  createdAt: Date,
  updatedAt: Date
}

4. Word:
{
  id: number,
  languageId: number,
  cardId: number,
  value: string,
  createdAt: Date,
  updatedAt: Date
}

5. Task:
{
  id: number,
  userId: number,
  hiddenWordId: number,
  type: string,
  answerStatus: string,
  correctAnswers: string[],
  receivedAnswer: string | null,
  createdAt: Date,
  updatedAt: Date
}
```

## Relations

```TypeScript
1. Language - User: one-to-many relation
Language.id(PK) - User.nativeLanguageId(FK)

2. User - Card: one-to-many relation
User.id(PK) - Card.userId(FK)

3. Card - Word: one-to-many relation
Card.id(PK) - Word.cardId(FK)

4. Language - Card: one-to-many relation
Language.id(PK) - Card.nativeLanguageId(FK)

5. Language - Card: one-to-many relation
Language.id(PK) - Card.foreignLanguageId(FK)

6. Language - Word: one-to-many relation
Language.id(PK) - Word.languageId(FK)

7. Word - Task: one-to-many relation
Word.id(PK) - Task.hiddenWordId(FK)

8. User - Task: one-to-many relation
User.id(PK) - Task.userId(FK)
```
