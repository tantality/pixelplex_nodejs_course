# Collections, schemas and models

## Collections

- ### languages;
- ### users;
- ### cards;
- ### tasks.

## Schemas and models

- ### language

```TypeScript
const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, index: true, required: true },
}, { timestamps: true });

languageSchema.index({ createdAt: 1});

const Language = mongoose.model('language', languageSchema);
```

- ### user

```TypeScript
enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

const userSchema = new mongoose.Schema({
  nativeLanguageId: { ref: 'language', type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  normalizedEmail: { type: String, unique: true, index: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: [USER_ROLE.USER, USER_ROLE.ADMIN], default: USER_ROLE.USER, required: true },
  refreshToken: { type: String },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);
```

- ### card

```TypeScript
const cardSchema = new mongoose.Schema({
  userId: { ref: 'user', type: mongoose.Schema.Types.ObjectId, index: true, required: true },
  nativeLanguageId: { ref: 'language', type: mongoose.Schema.Types.ObjectId, required: true },
  nativeWords: { type: [String], index: true, required: true },
  foreignLanguageId: { ref: 'language', type: mongoose.Schema.Types.ObjectId, required: true },
  foreignWords: { type: [String], index: true, required: true },
}, { timestamps: true });

cardSchema.index({ createdAt: 1});
cardSchema.index({ nativeLanguageId: 1, foreignLanguageId: 1 });

const Card = mongoose.model('card', cardSchema);
```

- ### task

```TypeScript
enum TASK_STATUS {
  UNANSWERED = 'unanswered',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

enum TASK_TYPE {
  TO_NATIVE = 'to_native',
  TO_FOREIGN = 'to_foreign',
}

const taskSchema = new mongoose.Schema({
  userId: { ref: 'user', type: mongoose.Schema.Types.ObjectId, index: true, required: true },
  hiddenWord: { type: String, required: true },
  nativeLanguageId: { ref: 'language', type: mongoose.Schema.Types.ObjectId, required: true },
  foreignLanguageId: { ref: 'language', type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: [TASK_TYPE.TO_NATIVE, TASK_TYPE.TO_FOREIGN], required: true },
  status: { 
    type: String, enum: [TASK_STATUS.UNANSWERED, TASK_STATUS.CORRECT, TASK_STATUS.INCORRECT], default: TASK_STATUS.UNANSWERED, 
    index: true, required: true 
  },
  correctAnswers: { type: [String], default: null },
  receivedAnswer: { type: String, default: null },
}, { timestamps: true });

taskSchema.index({ createdAt: 1});
taskSchema.index({ nativeLanguageId: 1, foreignLanguageId: 1 });
taskSchema.index({ hiddenWord: 1, receivedAnswer: 1 });

const Task = mongoose.model('task', taskSchema);
```
