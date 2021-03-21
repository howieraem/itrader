use itrader;
create table users (
        id bigint not null auto_increment,
        username varchar(20) not null,
        password varchar(15) not null,
        primary key (id)
    ) engine=InnoDB;
 

alter table users
   add constraint UK_6dotkott2kjsp8vw4d0m25fb7 unique (username);
