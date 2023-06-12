CREATE USER planner WITH PASSWORD 'planner' SUPERUSER;
CREATE DATABASE planner;

-- reset
DROP TABLE tasks;
DROP TABLE results;
DROP TABLE plans;
DROP TABLE temp;
DROP TABLE users;

-- create tables
CREATE TABLE users (
    id SERIAL primary key,
    name VARCHAR(30) not null unique,
    email VARCHAR(100) not null unique,
    password VARCHAR(100) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();

CREATE TABLE temp (
    id uuid DEFAULT uuid_generate_v4() primary key,
    user_id integer NOT NULL,
    content text NOT NULL,
    star boolean,
    favorite BOOLEAN DEFAULT false,
    foreign key (user_id) references users(id)
);

CREATE TABLE plans (
    id SERIAL primary key,
    plan_id uuid NOT NULL,
    name VARCHAR(100) not null,
    date DATE NOT NULL,
    start_location VARCHAR(100),
    return_location VARCHAR(100),
    start_time time not null,
    end_time time,
    lunch_start time,
    lunch_end time,
    dinner_start time,
    dinner_end time,
    pub_trans boolean,
    walk boolean,
    drive boolean,
    user_id integer not null,
    foreign key (user_id) references users(id),
    foreign key (plan_id) references temp(id)
);

CREATE TABLE tasks (
    id serial primary key,
    description varchar(255) not null,
    duration integer,
    location varchar(255) not null,
    remarks varchar(255),
    priority boolean,
    plan_id uuid not null,
    foreign key (plan_id) references temp(id)
);


CREATE TABLE results (
    plan_id uuid NOT NULL,
    q_content text NOT NULL,
    a_content text NOT NULL,
    foreign key (plan_id) references temp(id)
);

-- show tables
select * from users;
select * from temp;
select * from plans;
select * from tasks;
select * from results;


-- trying to insert data to tables
INSERT INTO users (
    name, email, password, created_at
    ) VALUES (
        'katie','katie@gmail.com','katie',CURRENT_TIMESTAMP
        );

INSERT INTO temp (
    user_id,content
) VALUES (
    1,'abc'
);

INSERT INTO plans (
    plan_id,
    name,
    date,
    start_location,
    return_location,
    start_time,
    end_time,
    lunch_start,
    lunch_end,
    dinner_start,
    dinner_end,
    pub_trans,
    walk,
    drive,
    user_id
) VALUES (
    '0f411e4f-07c3-45e8-9bfb-f58ced8ff979',
    'Test Plan',
    '2023-05-31',
    'Tsuen Wan',
    'Tsim Sha Tsui',
    '09:00',
    '22:00',
    '12:30',
    '13:30',
    '18:30',
    '19:30',
    true,
    false,
    true,
    1
);

INSERT INTO tasks (
    description,
    duration, 
    location, 
    remarks, 
    priority,
    plan_id
) VALUES (
    'buy things',
    1,
    'tai wai MTR station',
    'first thing to do',
    true,
    '0f411e4f-07c3-45e8-9bfb-f58ced8ff979'
);

INSERT INTO results (
    plan_id,
    q_content,
    a_content
) VALUES (
    '0f411e4f-07c3-45e8-9bfb-f58ced8ff979',
    'abcQestion',
    'efgAnswer'
);

