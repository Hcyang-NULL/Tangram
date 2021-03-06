# 数据库设计
（在E-R图基础上进行关系模式及逻辑结构设计）

## 1.E-R图向逻辑模型转换
        数据库名：   七巧板速算练习(tangram)
        用户信息表  （`用户名`，密码，电子邮箱，是否验证邮箱）
        做题情况记录（`用户名`，积分，正确题数，做题总数）
        历史做题记录（`用户名`，`难易度`，当前题号）
        简单题记录  （`用户名`，`题号%100`，是否正确，做题时间）
        中等题记录  （`用户名`，`题号%100`，是否正确，做题时间）
        困难题记录  （`用户名`，`题号%100`，是否正确，做题时间）

## 2.关系模式的优化 - 函数依赖集
        F（用户信息表）={用户名->密码，用户名->电子邮箱，用户名->是否验证邮箱}；
        F（做题情况记录）={用户名->积分，用户名->正确题数，用户名->做题总数}

## 3.逻辑结构设计结果

### 1.用户信息表（Information)
|属性|中文名|数据类型|长度|允许空|主码或索引|约束条件|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|username|用户名|Varchar(20)|20|No|主属性|无|不能重名|
|pwd|密码|Varchar(20)|20|No|索引|无|高于一定复杂度|
|email|电子邮箱|Varchar(40)|40|No|索引|无|注册时需验证|
|verify|是否验证邮箱|Int(4)|4|No|索引|无|记录邮箱是否已被验证|

### 2.做题情况记录表（Grecord)
|属性|中文名|数据类型|长度|允许空|主码或索引|约束条件|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|username|用户名|Varchar(20)|20|No|主属性|||
|score|积分|Float||No|索引|无||
|correct|正确题数|Int(10)|10|No|索引|无||
|total|做题总数|Int(10)|10|No|索引|无||

### 3.历史做题记录表（Precord)
|属性|中文名|数据类型|长度|允许空|主码或索引|约束条件|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|username|用户名|Varchar(20)|20|No|主属性|||
|difficulty|难易度|Int(1)|1|No|主属性|0/1/2|简单/中等/困难|
|pointer|当前题号|Int(10)|10|No|索引|无||

### 4.简单题记录表（Srecord)（只记录近期100道题，更有参考价值）
|属性|中文名|数据类型|长度|允许空|主码或索引|约束条件|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|username|用户名|Varchar(20)|20|No|主属性|||
|position|题号%100|Int(3)|3|No|索引|主属性||
|isright|是否正确|Int(1)|1|No|索引|0/1|错误/正确|
|usetime|做题时间|Float(4,2)|整数2位，小数2位，一共4位|No|索引|无||

### 5.中等题记录表（Mrecord)（只记录近期100道题，更有参考价值）
|属性|中文名|数据类型|长度|允许空|主码或索引|约束条件|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|username|用户名|Varchar(20)|20|No|主属性|||
|position|题号%100|Int(3)|3|No|索引|主属性||
|isright|是否正确|Int(1)|1|No|索引|0/1|错误/正确|
|usetime|做题时间|Float(4,2)|整数2位，小数2位，一共4位|No|索引|无||

### 6.困难题记录表（Hrecord)（只记录近期100道题，更有参考价值）
|属性|中文名|数据类型|长度|允许空|主码或索引|约束条件|备注|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|username|用户名|Varchar(20)|20|No|主属性|||
|position|题号%100|Int(3)|3|No|索引|主属性||
|isright|是否正确|Int(1)|1|No|索引|0/1|错误/正确|
|usetime|做题时间|Float(4,2)|整数2位，小数2位，一共4位|No|索引|无||