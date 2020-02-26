/*
Creating and setting schema
*/
drop schema if exists project0 cascade;
create schema project0;
set schema 'project0';

/*
 * Dropping tables for testing
 */
drop table if exists "Role";
drop table if exists "User";
drop table if exists "ReimbursementStatus";
drop table if exists "ReimbursementType";
drop table if exists "Reimbursement";


/*
 Create tables
*/
create table "Role"
(
	role_id serial primary key,
	"role" text not null unique
);

create table "User"
(
	user_id serial primary key,
	username text not null unique,
	"password" text not null,
	first_name text not null,
	last_name text not null,
	email text not null,
	"role" int references "Role"(role_id)
	
);

create table "ReimbursementStatus"
(
	status_id serial primary key,
	status text not null unique
);

create table "ReimbursementType"
(
	type_id serial primary key,
	"type" text not null unique
);


create table "Reimbursement"
(
	reimbursement_id serial primary key,
	author int references "User"(user_id) not null,
	amount numeric(10,2) not null,
	date_submitted date not null,
	date_resolved date not null,
	description text not null,
	resolver int references "User"(user_id),
	status int references "ReimbursementStatus"(status_id) not null,
	"type" int references "ReimbursementType"(type_id)
);




/*
Insert data into tables
*/

--possible roles include user, finance-manager, and admin
insert into "Role"("role")
	values('User'),('Finance-Manager'),('Admin');


--possible statuses include pending, approved, and denied
insert into "ReimbursementStatus"(status)
	values('Pending'),('Approved'),('Denied');

--possible types include lodging, travel, food, and other
insert into "ReimbursementType"("type")
	values('Lodging'),('Travel'),('Food'),('Other');
	
--creating dummy user rows
insert into "User"(username,"password",first_name,last_name,email,"role")
	values('devjames98','password','Devon','James','devjames98@gmail.com',3),
		('user1','password','Green','Lantern','gl@dcu.com',1),
		('user2','password','Peter','Parker','spiderman@marvel.com',1),
		('manager1','password','Naruto','Uzumaki','9tails@naruto.com',2),
		('manager2','password','Gon','Freccs','thebesthunter@hxh.com',2)
	;


--creating dummy reimbursements
insert into "Reimbursement"(author,amount,date_submitted,date_resolved,description,resolver,status,"type")
	values(1,123.45,'2020-01-01','2020-01-02','dummy lodge',4,1,1),
		(2,123.45,'2020-01-02','2020-01-03','dummy travel',4,2,2),
		(3,123.45,'2020-01-03','2020-01-04','dummy food',4,2,3),
		(5,123.45,'2020-01-08','2020-01-09','dummy other',4,3,4),
		(4,123.45,'2020-01-10','2020-01-15','dummy other',5,3,4),
		(1,123.45,'2020-01-13','2020-02-02','dummy food',5,1,3),
		(3,123.45,'2020-01-20','2020-01-31','dummy travel',5,1,2),
		(2,123.45,'2020-02-01','2020-02-05','dummy lodge',5,2,1)
	;


--Testing Query commands
--select * from "Role";
--select * from "User";
--select * from "ReimbursementStatus";
--select * from "ReimbursementType";
--select * from "Reimbursement";

--Test query to find user by username and password
--SELECT * 
--FROM project0."User" U 
--inner join project0."Role" R on U."role" = R.role_id  
--WHERE username = 'devjames98'  and "password" = 'password';

--Test query to find all users
--SELECT * 
--FROM project0."User" U 
--inner join project0."Role" R on U."role" = R.role_id;

--select * from project0."User" U
--where U.user_id = 1;

--update project0."User" 
--set username = 'testUpdate'
--where user_id = 1;

--SELECT * 
--FROM project0."Reimbursement" R 
--inner join project0."ReimbursementStatus" RS on R.status = RS.status_id 
--WHERE RS.status_id = 1
--order by R.date_submitted ;

--select *
--from project0."Reimbursement" R
--where author = 1;

--Saving a reimbursement
--INSERT INTO project0."Reimbursement" (author,amount,date_submitted,date_resolved,description,resolver,status,"type") 
--values (4,123.45,'2020-05-05','2020-05-08','dummy lodge',4,1,1);

--find reimbursement by id
--select *
--from project0."Reimbursement" R
--where R.reimbursement_id = 1;

--update reimbursement
--update project0."Reimbursement" 
--set amount = 333
--where reimbursement_id = 1;