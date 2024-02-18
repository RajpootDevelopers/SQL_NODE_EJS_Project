create table if not exists random (
    id varchar(50) primary key,
    username varchar(40) not null,
    email varchar(50) unique,
    avatar varchar(255),
    password varchar(20) unique,
    birthdate varchar(30),
    registeredAt  varchar(30)
);


