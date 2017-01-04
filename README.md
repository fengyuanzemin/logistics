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
	name varchar(20) default '张飞',
	phone varchar(30) not null,
	admin int default 0,
	address varchar(50) default '',
	password varchar(50) not null,
	sex char(1) default 'm',
	email varchar(30) default '233333@qq.com');
	
create table logistics (
	id int not null auto_increment primary key,
	finish int default 0,
	userId int not null,
	foreign key (userId)  references user (id)
);

create table detail (
	id int not null auto_increment primary key,
	createAt timestamp not null,
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

