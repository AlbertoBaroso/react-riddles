DROP TABLE user;
DROP TABLE riddle;
DROP TABLE answer;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(32),
    points INTEGER CHECK(points >= 0),
    profile_image VARCHAR(64),
    hash VARCHAR(128),
    salt VARCHAR(128)
);

CREATE TABLE riddle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question VARCHAR(500),
    response VARCHAR(100),
    first_hint VARCHAR(100),
    second_hint VARCHAR(100),
    solution_found BOOLEAN CHECK(solution_found IN (0, 1)),
    duration INTEGER CHECK(duration >= 30 AND duration <= 600),
    difficulty CHECK( difficulty IN ('easy','average','hard') ),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    start_time DATETIME NULL,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE answer (
    user_id INTEGER,
    riddle_id INTEGER,
    answer VARCHAR(100),
    winner BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, riddle_id),
    FOREIGN KEY(user_id) REFERENCES user(id),
    FOREIGN KEY(riddle_id) REFERENCES riddle(id)
);