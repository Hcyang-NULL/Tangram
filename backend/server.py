# coding=utf-8 ##

import os
import time
import stopit
import smtplib
import requests
import read as gp
import config as c
import random as rd
import pymysql as mysql
from aiohttp import web
from email.header import Header
from email.mime.text import MIMEText
from stopit.utils import TimeoutException

'''
获取当前时间并格式化
'''
def getTime(raw):
    try:
        if raw:
            return round(time.time(), 2)
        else:
            return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    except Exception as e:
        print("Unknown Error during getting time")
    return -1

'''
连接数据库
'''
def connect():
    db = mysql.connect(c.db_server, c.db_user, c.db_pwd, c.db_database)
    return db

'''
写入日志文件
'''
def log(t):
    with open('log.txt', 'a+', encoding='utf8') as f:
        f.write(str(t))
        f.write('\n----------------------\n')

'''
发送验证邮件
'''
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
        print(e)
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n具体信息:\n%s')%(email, str(getTime(False)), str(e)))
        print(e)
        return 1
    except Exception as e:
        print(e)
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n具体信息:\n%s')%(email, str(getTime(False)), str(e)))
        print(e)
        return 1
    log(('发送邮件成功\n目标邮箱:%s\n时间:%s')%(email, str(getTime(False))))
    return 0

'''
登陆响应模块
'''
async def SignInHandler(request):
    print('\n>> sign in request')
    try:
        data = await request.json()
        username = data['username']
        password = data['password']
        response_dict = {}

        db = connect()
        cursor = db.cursor()
        print(username)
        print(password)
        sql = ("SELECT verify FROM Information WHERE username='%s' AND pwd='%s'")%(username, password)
        print(sql)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) == 0:
            cursor.close()
            response_dict['code'] = 602
            response_dict['msg'] = '用户名或密码不正确'
            return web.json_response(response_dict)
        elif len(results) == 1:
            verify = results[0][0]
            if verify != 0:
                cursor.close()
                response_dict['code'] = 603
                response_dict['msg'] = '未验证邮箱'
                return web.json_response(response_dict)
            else:
                pass
        else:
            cursor.close()
            log(('Information表发生错误，出现重名且重密码:\n<%s> <%s>\n时间: %s')%(username, password, str(getTime(False))))
            response_dict['code'] = 901
            response_dict['msg'] = '服务暂时不可用'
            return web.json_response(response_dict)

        sql = ("SELECT score FROM Grecord WHERE username='%s'")%(username)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) == 1:
            pass
        else:
            cursor.close()
            if(len(results) == 0):
                log(('Grecord表发生错误，查找不到用户:\n<%s>\n时间: %s')%(username, str(getTime(False))))
            else:
                log(('Grecord表发生错误，出现重名用户:\n<%s>\n时间: %s')%(username, str(getTime(False))))
            response_dict['code'] = 901
            response_dict['msg'] = '服务暂时不可用'
            return web.json_response(response_dict)

        score = results[0][0]
        response_dict['code'] = 701
        response_dict['score'] = score
        response_dict['msg'] = '登陆成功'

        cursor.close()
        return web.json_response(response_dict)

    except Exception as e:
        print(e)
        cursor.close()
        response_dict['code'] = 900
        response_dict['msg'] = '服务暂不可用'
        log(('登陆出现未知错误:\n%s\n时间: %s具体信息:\n%s')%(str(e), str(getTime(False), str(e))))
        return web.json_response(response_dict)

'''
注册响应模块
'''
async def SignUpHandler(request):
    print('\n>> sign up request')
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
            cursor.close()
            response_dict['code'] = 600
            response_dict['msg'] = '用户名已存在'
            return web.json_response(response_dict)
        
        verify = rd.randint(1,9999)
        sql = ("INSERT INTO Information VALUES ('%s','%s','%s', %d)")%(username, pwd, email, verify)
        print(sql)
        cursor.execute(sql)
        db.commit()

        res = sendEmail(email, username ,verify, timeout=c.EMAIL_TIMEOUT)

        if res == 0:
            response_dict['code'] = 700
            response_dict['msg'] = '注册成功，邮件已发送，登陆前请先验证'
            cursor.close()
            db.commit()
            log(('用户: %s 已成功提交注册信息，等待邮箱验证\n时间: %s')%(username, str(getTime(False))))
            return web.json_response(response_dict)
        elif res == 1:
            response_dict['code'] = 601
            response_dict['msg'] = '发送邮件失败，请重试'
            cursor.close()
            db.rollback()
            return web.json_response(response_dict)

    except Exception as e:
        print(e)
        cursor.close()
        db.rollback()
        log(("注册出现未知错误:\n时间: %s具体信息:\n%s")%(str(getTime(False)), str(e)))
        if 'code' not in response_dict:
            response_dict['code'] = '900'
        response_dict['msg'] = '服务暂不可用'
        return web.json_response(response_dict)

'''
根响应模块
'''
async def WebHandler(request):
    print('hello')
    return web.Response(text="Hello, world")

'''
验证邮件响应模块
'''
async def VerifyHandler(request):
    print("\n verify email")
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
                print(sql)
                cursor.execute(sql)
                db.commit()
                sql = ("INSERT INTO Grecord VALUES ('%s',%d,%d,%d)")%(username, 0, 0, 0)
                print(sql)
                cursor.execute(sql)
                db.commit()
                sql = ("INSERT INTO Precord VALUES ('%s', 1, 0)")%(username)
                print(sql)
                cursor.execute(sql)
                db.commit()
                sql = ("INSERT INTO Precord VALUES ('%s', 2, 0)")%(username)
                print(sql)
                cursor.execute(sql)
                db.commit()
                sql = ("INSERT INTO Precord VALUES ('%s', 3, 0)")%(username)
                print(sql)
                cursor.execute(sql)
                db.commit()

                cursor.close()
                return web.Response(text="激活成功")       
            elif results[0][0] == 0:
                cursor.close()
                return web.Response(text="账号已处于激活状态")

        cursor.close()
        return web.Response(text="激活失败，若为正常操作，请联系官方人员处理（首页有邮箱地址）")

    except Exception as e:
        print(e)
        cursor.close()
        db.rollback()
        log(("激活出现未知错误:\nusername:%s verify:%s\n具体信息:\n%s\n时间: %s具体信息:\n%s")%(username, verify, str(e), str(getTime(False), str(e))))
        return web.Response(text="激活失败，服务暂不可用")

'''
获取题目响应模块
'''
async def GetProblemHandler(request):
    print("\n>> get problem")
    try:
        data = await request.json()
        level = data['level']
        response_dict = {}

        level = int(level)
        problems = gp.read(level)
        response_dict['code'] = 702
        response_dict['msg'] = "获取题目成功"
        response_dict['problems'] = problems

        return web.json_response(response_dict)

    except Exception as e:
        print(e)
        log(("获取题目发生未知错误:\n%s\n时间: %s具体信息:\n%s")%(str(e), str(getTime(False), str(e))))
        response_dict['code'] = 900
        response_dict['msg'] = "服务暂不可用"
        return web.json_response(response_dict)

'''
更新用户做题数据响应模块
'''
async def UpdateHandler(request):
    print("\n>> update request")
    try:
        data = await request.json()
        username = data['username']
        score = data['score']
        correct = data['correct']
        total = data['total']
        level = data['level']
        record = data['record']
        response_dict = {}

        db = connect()
        cursor = db.cursor()

        # check user
        sql = ("SELECT * FROM Grecord WHERE username='%s'")%(username)
        print(sql)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) == 0:
            log(("更新数据时Grecord表找不到用户: %s\n时间: %s")%(username, str(getTime(False))))
            response_dict['code'] = 604
            response_dict['msg'] = '服务暂不可用'
            return web.json_response(response_dict)
        elif len(results) > 1:
            log(("更新数据时Grecord表存在多个重名用户: %s\n时间: %s")%(username, str(getTime(False))))
            response_dict['code'] = 605
            response_dict['msg'] = '服务暂不可用'
            return web.json_response(response_dict)
        elif len(results) == 1:
            now_score = results[0][1]
            now_correct = results[0][2]
            now_total = results[0][3]
        else:
            log(("更新数据时Grecord表出现负数个用户: %s\n时间: %s")%(username, str(getTime(False))))
            response_dict['code'] = 900
            response_dict['msg'] = '服务暂不可用'
            return web.json_response(response_dict)
            
        # update Grecord
        now_score = float(score)
        for i in range(total):
            now_score += record[i][4]
        now_correct += correct
        now_total += total
        sql = ("UPDATE Grecord SET score=%.2f,correct=%d,total=%d WHERE username='%s'")%(now_score, now_correct, now_total, username)
        print(sql)
        cursor.execute(sql)

        # check Precord
        level = int(level)
        if level == 1:
            table = 'Srecord'
        elif level == 2:
            table = 'Mrecord'
        elif level == 3:
            table = 'Hrecord'
        else:
            log(("更新数据时level出现不可控值: %d\n时间: %s")%(level, str(getTime(False))))
            response_dict['code'] = 900
            response_dict['msg'] = '服务暂不可用'
            return web.json_response(response_dict)

        sql = ("SELECT * FROM Precord WHERE username='%s' AND difficulty=%d")%(username, level)
        print(sql)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) == 0:
            log(("更新数据时Precord表找不到用户: <user: %s> <level: %d>\n时间: %s")%(username, level, str(getTime(False))))
            response_dict['code'] = 604
            response_dict['msg'] = '服务暂不可用'
            return web.json_response(response_dict)
        elif len(results) > 1:
            log(("更新数据时Precord表存在多个重名用户: <user: %s> <level: %d>\n时间: %s")%(username, level, str(getTime(False))))
            response_dict['code'] = 605
            response_dict['msg'] = '服务暂不可用'
            return web.json_response(response_dict)
        elif len(results) == 1:
            pointer = results[0][2]
        else:
            log(("更新数据时Precord表出现负数个用户: <user: %s> <level: %d>\n时间: %s")%(username, level, str(getTime(False))))
            response_dict['code'] = 900
            response_dict['msg'] = '服务暂不可用'
            return web.json_response(response_dict)

        # update record
        for i in range(total):
            now_record = record[i]
            if now_record[2] == now_record[3]:
                isright = 1
            else:
                isright = 0
            # delete first
            sql = ("DELETE FROM %s WHERE username='%s' AND position=%d")%(table, username, (i+pointer)%100)
            print(sql)
            cursor.execute(sql)
            sql = ("INSERT INTO %s VALUES ('%s', %d, %d, %.2f)")%(table, username, (i+pointer)%100, isright, now_record[5])
            print(sql)
            cursor.execute(sql)
        
        # update pointer
        sql = ("UPDATE Precord SET pointer=%d WHERE username='%s' AND difficulty=%d")%((pointer+total)%100, username, level)
        print(sql)
        cursor.execute(sql)
        db.commit()

        cursor.close()
        response_dict['code'] = 703
        response_dict['msg'] = "数据更新成功"
        return web.json_response(response_dict)

    except Exception as e:
        print(e)
        cursor.close()
        db.rollback()
        log(("更新数据出现未知错误:\n%s\n时间: %s具体信息:\n%s")%(str(e), str(getTime(False)), str(e)))
        response_dict['code'] = 900
        response_dict['msg'] = "服务暂不可用"
        return web.json_response(response_dict)

'''
获取总积分排名响应模块
'''
async def GetScoreRankHandler(request):
    print("\n>> Request score rank")
    try:
        data = await request.json()
        username = data['username']
        response_dict = {}

        db = connect()
        cursor = db.cursor()

        rd_vari = "@tangram"+str(rd.randint(1,1000000))
        sql = ("SET %s = 0")%(rd_vari)
        cursor.execute(sql)
        sql = ("SELECT * FROM (SELECT (%s := %s + 1) as row, username from score_rank) a where username='%s'")%(rd_vari, rd_vari, username)
        print(sql)
        cursor.execute(sql)
        results = cursor.fetchall()

        if len(results) != 1:
            if len(results) == 0:
                log(("获取总积分排名时找不到用户: %s\n时间: %s")%(username, str(getTime(False))))
                response_dict['code'] = 604
                response_dict['msg'] = '错误'
                return web.json_response(response_dict)
            elif len(results) > 1:
                log(("获取总积分排名时存在多个重名用户: %s\n时间: %s")%(username, str(getTime(False))))
                response_dict['code'] = 605
                response_dict['msg'] = '错误'
                return web.json_response(response_dict)
            else:
                log(("获取总积分排名时用户个数为负数: %s\n时间: %s")%(username, str(getTime(False))))
                response_dict['code'] = 900
                response_dict['msg'] = '错误'
                return web.json_response(response_dict)
        
        row = results[0][0]
        sql = ("SELECT * FROM Grecord")
        cursor.execute(sql)
        results = cursor.fetchall()
        total_rows = len(results)
        print('total row:' + str(total_rows))
        few = False
        
        if total_rows < c.BEFORE + c.AFTER + 1:
            few = True
        else:
            before = row-c.BEFORE
            if before <= 0:
                row += -(before-1)
            after = row+c.AFTER
            if after > total_rows:
                row -= (after-total_rows)
        
        print('few: '+str(few))
        if few:
            sql = ("select * from score_rank")
            cursor.execute(sql)

            results = cursor.fetchall()
            reslist = []
            print('results row: '+str(len(results)))
            for i in range(len(results)):
                temp = []
                temp.append(i+1)
                for j in range(2):
                    temp.append(results[i][j])
                reslist.append(temp)
        else:
            sql = ("SET %s = 0")%(rd_vari)
            cursor.execute(sql)
            sql = ("select * from (select (%s := %s + 1) as row, username, score from score_rank) a where a.row >= %d and a.row <= %d")%(rd_vari, rd_vari, before, after)
            print(sql)
            cursor.execute(sql)

            results = cursor.fetchall()
            reslist = []
            print('results row: '+str(len(results)))
            for i in range(len(results)):
                temp = []
                for j in range(3):
                    temp.append(results[i][j])
                reslist.append(temp)
        
        db.commit()
        response_dict['code'] = 704
        response_dict['msg'] = '获取总分榜成功'
        response_dict['grecord'] = reslist

        return web.json_response(response_dict)

    except Exception as e:
        print(e)
        db.rollback()
        log(("获取总积分排名时数据出现未知错误:\n用户: %s\n时间: %s\n具体信息: %s")%(username, str(getTime(False)), str(e)))
        response_dict['code'] = 900
        response_dict['msg'] = '服务暂不可用'
        return web.json_response(response_dict)

'''
获取简单难度统计数据响应模块
'''
async def GetEasyDataHandler(request):
    print('\n>> Request easy data')
    try:
        data = await request.json()
        username = data['username']
        response_dict = {}

        db = connect()
        cursor = db.cursor()

        sql = ("SELECT isright,usetime FROM Srecord WHERE username='%s'")%(username)
        cursor.execute(sql)
        results = cursor.fetchall()

        total_num = len(results)
        total_correct = 0
        total_time = 0.0

        for i in range(len(results)):
            if results[i][0] == 1:
                total_correct += 1
            total_time += results[0][1]
        
        if total_num != 0:
            acc_rate = round(float(total_correct)/total_num, 2)
            time_rate = round(total_time/total_num, 2)
        else:
            acc_rate = 0
            time_rate = 0

        response_dict['code'] = 705
        response_dict['msg'] = "获取简单模式数据成功"
        response_dict['acc_rate'] = acc_rate
        response_dict['time_rate'] = time_rate

        return web.json_response(response_dict)

    except Exception as e:
        print(e)
        log(("获取简单难度数据时出现未知错误:\n用户: %s\n时间: %s\n具体信息: %s")%(username, str(getTime(False)), str(e)))
        response_dict['code'] = 900
        response_dict['msg'] = '服务暂不可用'
        return web.json_response(response_dict)

'''
获取中等难度统计数据响应模块
'''
async def GetMediumDataHandler(request):
    print('\n>> Request medium data')
    try:
        data = await request.json()
        username = data['username']
        response_dict = {}

        db = connect()
        cursor = db.cursor()

        sql = ("SELECT isright,usetime FROM Mrecord WHERE username='%s'")%(username)
        cursor.execute(sql)
        results = cursor.fetchall()

        total_num = len(results)
        total_correct = 0
        total_time = 0.0

        for i in range(len(results)):
            if results[i][0] == 1:
                total_correct += 1
            total_time += results[0][1]
        
        if total_num != 0:
            acc_rate = round(float(total_correct)/total_num, 2)
            time_rate = round(total_time/total_num, 2)
        else:
            acc_rate = 0
            time_rate = 0
            

        response_dict['code'] = 706
        response_dict['msg'] = "获取中等模式数据成功"
        response_dict['acc_rate'] = acc_rate
        response_dict['time_rate'] = time_rate

        return web.json_response(response_dict)

    except Exception as e:
        print(e)
        log(("获取中等难度数据时出现未知错误:\n用户: %s\n时间: %s\n具体信息: %s")%(username, str(getTime(False)), str(e)))
        response_dict['code'] = 900
        response_dict['msg'] = '服务暂不可用'
        return web.json_response(response_dict)

'''
获取困难难度统计数据响应模块
'''
async def GetHardDataHandler(request):
    print('\n>> Request hard data')
    try:
        data = await request.json()
        username = data['username']
        response_dict = {}

        db = connect()
        cursor = db.cursor()

        sql = ("SELECT isright,usetime FROM Hrecord WHERE username='%s'")%(username)
        cursor.execute(sql)
        results = cursor.fetchall()

        total_num = len(results)
        total_correct = 0
        total_time = 0.0

        for i in range(len(results)):
            if results[i][0] == 1:
                total_correct += 1
            total_time += results[0][1]
        
        if total_num != 0:
            acc_rate = round(float(total_correct)/total_num, 2)
            time_rate = round(total_time/total_num, 2)
        else:
            acc_rate = 0
            time_rate = 0

        response_dict['code'] = 707
        response_dict['msg'] = "获取困难模式数据成功"
        response_dict['acc_rate'] = acc_rate
        response_dict['time_rate'] = time_rate

        return web.json_response(response_dict)

    except Exception as e:
        print(e)
        log(("获取困难难度数据时出现未知错误:\n用户: %s\n时间: %s\n具体信息: %s")%(username, str(getTime(False)), str(e)))
        response_dict['code'] = 900
        response_dict['msg'] = '服务暂不可用'
        return web.json_response(response_dict)

'''
初始化响应路径
'''
def init(app):
    app.router.add_get('/', WebHandler)
    app.router.add_get('/verify', VerifyHandler)
    app.router.add_post('/signup', SignUpHandler)
    app.router.add_post('/signin', SignInHandler)
    app.router.add_post('/getproblem', GetProblemHandler)
    app.router.add_post('/update', UpdateHandler)
    app.router.add_post('/getscorerank', GetScoreRankHandler)
    app.router.add_post('/geteasydata', GetEasyDataHandler)
    app.router.add_post('/getmediumdata', GetMediumDataHandler)
    app.router.add_post('/getharddata', GetHardDataHandler)

'''
主函数
'''
if __name__ == "__main__":
    app = web.Application()
    init(app)
    web.run_app(app, host='127.0.0.1', port=19552)
