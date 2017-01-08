# 物流管理信息系统

## 下载

```shell
git clone git@github.com:fengyuanzemin/logistics.git
```

## 数据库建表

```sql
create database 
if not exists logistics
default charset utf8 
collate utf8_general_ci;

use logistics;

create table if not exists user (
	id int not null  auto_increment primary key,
	name varchar(20) default '张飞',
	phone varchar(30) not null unique,
	admin int default 0,
	address varchar(50) default '',
	password varchar(50) not null,
	sex char(1) default 'm',
	email varchar(30) default '233333@qq.com'
);
	
create table  if not exists logistics (
	id int not null auto_increment primary key,
	finish int default 0,
	userId int not null,
	title varchar(50) not null,
	`describe` varchar(140),
	foreign key (userId) references user (id) on delete cascade
);

create table  if not exists detail (
	id int not null auto_increment primary key,
	createdAt timestamp default current_timestamp,
	`action` varchar(100) not null,
	logisticsId int not null,
	foreign key (logisticsId) references `logistics`(id) on delete cascade
);
```

## 运行

### 1. 安装依赖

    npm install
    
### 2. 根据你的数据库配置`./config/config.js`

### 3. 确保MySQL开启，并成功建表

### 4. 运行
    npm start

打开 http://localhost:3000

# 关于

### 借鉴
图书馆管理系统 https://github.com/lxz612/libsystem

### License
  MIT