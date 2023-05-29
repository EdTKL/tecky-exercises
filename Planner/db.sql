CREATE TABLE "tasks" (
    id serial primary key
    , task_description varchar(255) not null
    , task_duration integer not null
    , task_location varchar(255) not null
    -- Maybe POINT type is better for geometry? --
    , remarks varchar(255)
    , priority boolean not null
    -- , plans_id text references "plans"(id) not null
    , created_at timestamp default CURRENT_TIMESTAMP
);