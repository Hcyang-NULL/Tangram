# coding=utf-8 ##

import os
import time
import stopit
import smtplib
import requests
import config as c
import random as rd
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
        f.write('\n----------------------\n')


@stopit.threading_timeoutable()
def sendEmail(email, username, verify):
    try:
        smtp = smtplib.SMTP_SSL('smtp.163.com',465)  
        smtp.login(c.EMAIL_USER, c.EMAIL_PASSWORD) 
        content = '请点击以下链接完成验证\n'
        content += c.VERIFY_URL+username+'&verify='+str(verify)
        content += ('\n时间：%s \n')%(str(getTime(False)))
        msg = MIMEText(content,'plain','utf-8')
        subject = '七巧板速算注册'
        msg['Subject'] = Header(subject, 'utf-8')
        msg['From'] = ('七巧板官方团队 <%s>')%(c.EMAIL_NAME)
        msg['To'] = email
        smtp.sendmail(c.EMAIL_NAME, email, msg.as_string()) 
        smtp.quit()
    except TimeoutException as e:
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n具体信息:\n%s')%(email, str(getTime(False)), str(e)))
        print(e)
        return 1
    except Exception as e:
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n具体信息:\n%s')%(email, str(getTime(False)), str(e)))
        print(e)
        return 1
    log(('发送邮件成功\n目标邮箱:%s\n时间:%s')%(email, str(getTime(False))))
    return 0


async def SignInHandler(request):
    print('>> sign in request')
    try:
        data = await request.json()
        username = data['username']
        password = data['password']
        response_dict = {}

        db = connect()
        cursor = db.cursor()
        sql = ("SELECT verify FROM Information WHERE username='%s' AND password='%s'")%(username, password)
        print(sql)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) == 0:
            response_dict['code'] = 602
            response_dict['msg'] = '用户名或密码不正确'
            return web.json_response(response_dict)
        elif len(results) == 1:
            verify = results[0][0]
            if verify != 0:
                response_dict['code'] = 603
                response_dict['msg'] = '未验证邮箱'
                return web.json_response(response_dict)
            else:
                pass
        else:
            log(('Information表发生错误，出现重名且重密码:\n<%s> <%s>')%(username, password))
            response_dict['code'] = 901
            response_dict['msg'] = '服务暂时不可用'
            return web.json_response(response_dict)

        sql = ("SELECT score FROM Grecord WHERE username='%s'")%(username)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) == 1:
            pass
        else:
            log(('Grecord表发生错误，出现重名用户:\n<%s>')%(username))
            response_dict['code'] = 901
            response_dict['msg'] = '服务暂时不可用'
            return web.json_response(response_dict)

        score = results[0][0]
        response_dict['code'] = 701
        response_dict['score'] = score
        response_dict['msg'] = '登陆成功'

        return web.json_response(response_dict)

    except Exception as e:
        response_dict['code'] = 900
        response_dict['msg'] = '服务暂不可用'
        log(('登陆出现未知错误:\n%s')%(str(e)))
        return web.json_response(response_dict)


async def SignUpHandler(request):
    print('>> sign up request')
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
        
        verify = rd.randint(1,9999)
        sql = ("INSERT INTO Information VALUES ('%s','%s','%s', %d)")%(username, pwd, email, verify)
        print(sql)
        cursor.execute(sql)
        sql = ("INSERT INTO Grecord VALUES ('%s',%d,%d,%d)")%(username, 0, 0, 0)
        print(sql)
        cursor.execute(sql)

        res = sendEmail(email, username ,verify, timeout=c.EMAIL_TIMEOUT)

        if res == 0:
            response_dict['code'] = 700
            response_dict['msg'] = '注册成功，邮件已发送，登陆前请先验证'
            db.commit()
            log(('用户: %s 已成功提交注册信息，等待邮箱验证')%(username))
            return web.json_response(response_dict)
        elif res == 1:
            response_dict['code'] = 601
            response_dict['msg'] = '发送邮件失败，请重试'
            db.rollback()
            return web.json_response(response_dict)

    except Exception as e:
        db.rollback()
        log(("注册出现未知错误:\n%s")%(str(e)))
        if 'code' not in response_dict:
            response_dict['code'] = '900'
        response_dict['msg'] = '服务暂不可用'
        return web.json_response(response_dict)


async def WebHandler(request):
    print('hello')
    return web.Response(text="Hello, world")


async def VerifyHandler(request):
    try:
        username = request.rel_url.query['username']
        verify = request.rel_url.query['verify']

        db = connect()
        cursor = db.cursor()
        sql = ("SELECT verify FROM Information WHERE username='%s'")%(username)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) == 1:
            if results[0][0] == int(verify):
                sql = ("UPDATE Information SET verify=0 WHERE username='%s'")%(username)
                cursor.execute(sql)
                db.commit()
                return web.Response(text="激活成功")       
            elif results[0][0] == 0:
                return web.Response(text="账号已处于激活状态")

        return web.Response(text="激活失败，若为正常操作，请联系官方人员处理（首页有邮箱地址）")

    except Exception as e:
        db.rollback()
        log(("激活出现未知错误:\nusername:%s verify:%s\n具体信息:\n%s")%(username, verify, str(e)))
        return web.Response(text="激活失败，服务暂不可用")


def init(app):
    app.router.add_get('/', WebHandler)
    app.router.add_get('/verify', VerifyHandler)
    app.router.add_post('/signup', SignUpHandler)
    app.router.add_post('/signin', SignInHandler)

if __name__ == "__main__":
    app = web.Application()
    init(app)
    web.run_app(app, host='127.0.0.1', port=19552)
