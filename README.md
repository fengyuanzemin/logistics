# 物流管理信息系统

## 下载

```shell
git clone 
```

## 数据库建表

```sql
create database 
if not exists logistics
default charset utf8 
collate utf8_general_ci;

use logistics;

create table user (
	id int not null  auto_increment primary key,
	name varchar(20) not null,
	phone varchar(30) not null,
	admin int not null,
	address varchar(50) not null,
	passsword varchar(50) not null,
	sex char(1) not null,
	email varchar(30) not null);
	
create table logistics (
	id int not null auto_increment primary key,
	finish char(1) not null,
	userId int not null,
	foreign key (userId)  references user (id)
);

create table detail (
	id int not null auto_increment primary key,
	createAt varchar(30) not null,
	`action` varchar(100) not null,
	logisticsId int not null,
	foreign key (logisticsId) references `logistics`(id)
);

```



## 运行

### 安装依赖

    npm install
    
### 确保MySQL开启，并成功建表

### 运行
    npm start

打开 http://localhost:3000

