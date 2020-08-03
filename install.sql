drop database "smart-brain";
create database "smart-brain";
drop user milton;
create user milton with password 'milton';
grant all privileges on database "smart-brain" to milton;