CREATE USER planner WITH PASSWORD 'planner' SUPERUSER;
CREATE DATABASE planner;

CREATE TABLE users (
    id SERIAL primary key,
    username VARCHAR(30) not null unique,
    email VARCHAR(100) not null unique,
    password VARCHAR(100) not null,
    created_at timestamp default CURRENT_TIMESTAMP not null
);

CREATE TABLE plans (
    id SERIAL primary key,
    plan_name VARCHAR(100) not null unique,
    plan_date date not null,
    start_location VARCHAR(100) not null,
    return_location VARCHAR(100),
    start_time time not null,
    end_time time not null,
    lunch_start time,
    lunch_end time,
    dinner_start time,
    dinner_end time,
    pub_trans boolean,
    walk boolean,
    drive boolean,
    user_id integer not null,
    foreign key (user_id) references users(id)
);

CREATE TABLE "tasks" (
    id serial primary key
    , task_description varchar(255) not null
    , task_duration integer
    , task_location varchar(255) not null
    , remarks varchar(255)
    , priority boolean
    , plan_id integer not null,
    foreign key (plan_id) references plans(id)
);

INSERT INTO plans (
    plan_name,
    plan_date,
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
)