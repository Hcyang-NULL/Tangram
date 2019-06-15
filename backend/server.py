# coding=utf-8 ##

from aiohttp import web
import os
import config as c
import requests
import pymysql as mysql
from email.mime.text import MIMEText
from email.header import Header
import smtplib
import time

def getTime(raw):
    try:
        if raw:
            return round(time.time(), 2)
        else:
            return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    except Exception as e:
        print("Unknown Error during getting time")
    return -1

def connect():
    db = mysql.connect(c.db_server, c.db_user, c.db_pwd, c.db_database)
    return db

def log(t):
    with open('log.txt', 'a+', encoding='utf8') as f:
        f.write(str(t))

def sendEmail(email):
    try:
        smtp = smtplib.SMTP() 
        smtp.connect('smtp.163.com','25') 
        smtp.login(c.EMAIL_USER, c.EMAIL_PASSWORD) 
        content = '请点击以下链接完成验证\n'
        content += c.VERIFY_URL
        content += ('\n时间：%s \n')%(str(getTime(False)))
        msg = MIMEText(content,'plain','utf-8')
        subject = '七巧板速算注册'
        msg['Subject'] = Header(subject, 'utf-8')
        msg['From'] = ('Auto-Detector<%s>')%(c.EMAIL_NAME)  
        email = ','.join(email)
        msg['To'] = email
        smtp.sendmail(c.EMAIL_NAME, email.split(','), msg.as_string()) 
        smtp.quit()
    except Exception as e:
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
        print(e)
        return 1
    log(('发送邮件成功\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
    return 0

async def helloHandler(request):
    print('hello')
    return web.Response(text="Hello, world")

async def SignUpHander(request):
    try:
        data = await request.json()
        username = data['username']
        email = data['email']
        pwd = data['password']
        response_dict = []

        db = connect()
        cursor = db.cursor()
        sql = ("SELECT * FROM Information WHERE username='%s'")%(username)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) != 0:
            response_dict['code'] = 600
            response_dict['msg'] = '用户名已存在'
            return web.json_response(response_dict)
        
        sql = ("INSERT INTO Information ('%s','%s','%s')")%(username, pwd, email)
        cursor.execute(sql)
        db.commit()

        res = sendEmail(email)
        if res == 0:
            response_dict['code'] = 700
            response_dict['msg'] = '注册成功'
        else:
            response_dict['code'] = 601
            response_dict['msg'] = '发送邮件失败'

        return web.json_response(response_dict)

    except Exception as e:
        log(e+'\n')
        return web.Response(text='error')
    log(('用户: %s 已成功提交注册信息，等待邮箱验证\n')%(username))

def init(app):
    app.router.add_get('/', helloHandler)
    app.router.add_post('/signup', SignUpHander)
    # app.router.add_post('/signin', SignInHander)

if __name__ == "__main__":
    app = web.Application()
    init(app)
    web.run_app(app, host='127.0.0.1', port=19552)
