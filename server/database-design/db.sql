CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);

CREATE TYPE USER_ROLE AS ENUM ('user', 'admin');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nativeLanguageId INTEGER REFERENCES languages (id), 
  name VARCHAR(257) NOT NULL,
  email VARCHAR(255) NOT NULL,
  normalizedEmail VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role USER_ROLE DEFAULT 'user' NOT NULL,
  refreshToken VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);

CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users (id) ON DELETE CASCADE,
  nativeLanguageId INTEGER REFERENCES languages (id),
  foreignLanguageId INTEGER REFERENCES languages (id),
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);

CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  languageId INTEGER REFERENCES languages (id),
  cardId INTEGER REFERENCES cards (id) ON DELETE CASCADE,
  value VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);

CREATE TYPE TASK_TYPE AS ENUM ('to_native', 'to_foreign');
CREATE TYPE TASK_STATUS AS ENUM ('unanswered', 'correct', 'incorrect');

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users (id) ON DELETE CASCADE,
  hiddenWordId INTEGER REFERENCES words (id) ON DELETE CASCADE,
  type TASK_TYPE NOT NULL,
  status TASK_STATUS DEFAULT 'unanswered' NOT NULL,
  correctAnswers VARCHAR(255)[],
  receivedAnswer VARCHAR(255),
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);