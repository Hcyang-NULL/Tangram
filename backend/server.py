# coding=utf-8 ##

import os
import time
import stopit
import smtplib
import requests
import config as c
import pymysql as mysql
from aiohttp import web
from email.header import Header
from email.mime.text import MIMEText
from stopit.utils import TimeoutException

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

@stopit.threading_timeoutable()
def sendEmail(email):
    try:
        smtp = smtplib.SMTP_SSL('smtp.163.com',465)  
        smtp.login(c.EMAIL_USER, c.EMAIL_PASSWORD) 
        content = '请点击以下链接完成验证\n'
        content += c.VERIFY_URL
        content += ('\n时间：%s \n')%(str(getTime(False)))
        msg = MIMEText(content,'plain','utf-8')
        subject = '七巧板速算注册'
        msg['Subject'] = Header(subject, 'utf-8')
        msg['From'] = ('七巧板官方团队 <%s>')%(c.EMAIL_NAME)
        msg['To'] = email
        smtp.sendmail(c.EMAIL_NAME, email, msg.as_string()) 
        smtp.quit()
    except TimeoutException as e:
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
        print(e)
        return 1
    except Exception as e:
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
        print(e)
        return 1
    log(('发送邮件成功\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
    return 0


async def SignUpHander(request):
    print('request')
    try:
        data = await request.json()
        username = data['username']
        email = data['email']
        pwd = data['password']
        response_dict = {}

        db = connect()
        cursor = db.cursor()
        sql = ("SELECT * FROM Information WHERE username='%s'")%(username)
        print(sql)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) != 0:
            response_dict['code'] = 600
            response_dict['msg'] = '用户名已存在'
            return web.json_response(response_dict)
        
        sql = ("INSERT INTO Information VALUES ('%s','%s','%s')")%(username, pwd, email)
        print(sql)
        cursor.execute(sql)

        res = sendEmail(email, timeout=c.EMAIL_TIMEOUT)

        if res == 0:
            response_dict['code'] = 700
            response_dict['msg'] = '注册成功'
            db.commit()
            log(('用户: %s 已成功提交注册信息，等待邮箱验证\n')%(username))
            return web.json_response(response_dict)
        elif res == 1:
            response_dict['code'] = 601
            response_dict['msg'] = '发送邮件失败，请重试'
            db.rollback()
            return web.json_response(response_dict)

    except Exception as e:
        db.rollback()
        log(str(e)+'\n')
        if 'code' not in response_dict:
            response_dict['code'] = '900'
        response_dict['msg'] = '未知错误'
        return web.json_response(response_dict)


async def WebHandler(request):
    print('hello')
    return web.Response(text="Hello, world")


def init(app):
    app.router.add_get('/', WebHandler)
    app.router.add_post('/signup', SignUpHander)
    # app.router.add_post('/signin', SignInHander)

if __name__ == "__main__":
    app = web.Application()
    init(app)
    web.run_app(app, host='127.0.0.1', port=19552)
