CREATE TABLE languages (
	id SERIAL PRIMARY KEY,
	name VARCHAR(51) NOT NULL,
	code VARCHAR(5) UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	native_language_id INTEGER REFERENCES languages (id) ON DELETE CASCADE, 
	name VARCHAR(257) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	normalized_email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	role user_role DEFAULT 'user' NOT NULL,
	refresh_token VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE cards (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
	native_language_id INTEGER REFERENCES languages (id) ON DELETE CASCADE,
	foreign_language_id INTEGER REFERENCES languages (id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE words (
	id SERIAL PRIMARY KEY,
	language_id INTEGER REFERENCES languages (id) ON DELETE CASCADE,
	card_id INTEGER REFERENCES cards (id) ON DELETE CASCADE,
	value VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TYPE task_type AS ENUM ('to_native', 'to_foreign');
CREATE TYPE task_answer_status AS ENUM ('unanswered', 'correct', 'incorrect');

CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
	hidden_word_id INTEGER REFERENCES words (id) ON DELETE CASCADE,
	type task_type NOT NULL,
	answer_status task_answer_status DEFAULT 'unanswered' NOT NULL,
	correct_answers VARCHAR(255)[],
	received_answer VARCHAR(255),
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);