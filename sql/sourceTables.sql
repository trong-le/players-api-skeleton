create schema if not exists ping_pong;

begin;

set schema 'ping_pong';

create table if not exists users (
    id serial primary key,
    first_name text not null,
    last_name text not null,
    email text not null,
    password text not null
);

create table if not exists players (
    id serial primary key,
    created_by int null references users on delete cascade,
    first_name text not null,
    last_name text not null,
    rating text not null,
    handedness text not null
);

commit;