import smtplib
from email.mime.text import MIMEText
from email.header import Header
import config as c
import _thread as td
import stopit
from stopit.utils import TimeoutException
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

def log(t):
    with open('log.txt', 'a+', encoding='utf8') as f:
        f.write(str(t))

@stopit.threading_timeoutable()
def sendEmail(email):
    try:
        print('step 0')
        smtp = smtplib.SMTP('smtp.163.com',465) 
        print('step 0.1')
        print('step 0.2')
        smtp.login(c.EMAIL_USER, c.EMAIL_PASSWORD) 
        print('step 1')
        content = '请点击以下链接完成验证\n'
        content += c.VERIFY_URL
        content += ('\n时间：%s \n')%(str(getTime(False)))
        msg = MIMEText(content,'plain','utf-8')
        print('step 2')
        subject = '七巧板速算注册'
        msg['Subject'] = Header(subject, 'utf-8')
        msg['From'] = ('七巧板官方团队 <%s>')%(c.EMAIL_NAME)  
        # msg['From'] = c.EMAIL_NAME
        msg['To'] = email
        print('step 3')
        smtp.sendmail(c.EMAIL_NAME, email, msg.as_string()) 
        smtp.quit()
    except TimeoutException as e:
        print('error 1')
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
        print(e)
        return 1
    except Exception as e:
        print('error 2')
        log(('发送邮件失败\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
        print(e)
        return 1
    print('step 4')
    log(('发送邮件成功\n目标邮箱:%s\n时间:%s\n')%(email, str(getTime(False))))
    return 0

from time import sleep
from threading import Thread

def async_call(fn):
    def wrapper(*args, **kwargs):
        Thread(target=fn, args=args, kwargs=kwargs).start()

    return wrapper


@stopit.threading_timeoutable()
def hello():
    try:
        print('thread start')
        t = 1
        for i in range(1000000000):
            t += 1
        print('thread end')
        return
    except TimeoutException as e:
        print('catch time out')
    except Exception as e:
        print(type(e))


def temp(email):
    pass

if __name__ == "__main__":
    res = sendEmail('hcy_null@163.com', timeout = 15)
    if res == 0:
        print('发送成功')
    elif res == 1:
        print('发送失败')
    else:
        print('未知错误')
    # hello(timeout = 2)
