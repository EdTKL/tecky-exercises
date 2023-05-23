CREATE TABLE "users" (
    id text primary key
    , username varchar(30) not null unique
    , password varchar(100) not null
    , user_icon varchar(80)
    , created_at timestamp default CURRENT_TIMESTAMP
);

CREATE TABLE "memo"(
    id serial primary key
    , content text
    , users_id text references "users"(id) not null
    , created_at timestamp default CURRENT_TIMESTAMP
);