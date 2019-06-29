import os

lines = 0
js = 0
a = os.walk('./html')
for item in a:
    files = item[2]
    for file in files:
        if file.endswith('.js'):
            with open(item[0]+'\\'+file, encoding='utf-8') as f:
                for line in f.readlines():
                    if line != "\n":
                        # lines += 1
                        js += 1
        elif file.endswith('.html') or file.endswith('.css'):
            with open(item[0]+'\\'+file, encoding='utf-8') as f:
                for line in f.readlines():
                    if line != "\n":
                        lines += 1
                    
print("前端代码行数:"+str(lines))
print("JS总代码行数:"+str(js))

lines = 0
ld = 0
a = os.walk('./backend')
for item in a:
    files = item[2]
    for file in files:
        if file.endswith('code.py') or file.endswith('read.py'):
            with open(item[0]+'\\'+file, encoding='utf-8') as f:
                for line in f.readlines():
                    if line != "\n":
                        # lines += 1
                        ld += 1
        elif file.endswith('server.py'):
            with open(item[0]+'\\'+file, encoding='utf-8') as f:
                for line in f.readlines():
                    if line != "\n":
                        lines += 1

print("后端出题代码行数:"+str(ld))
print("后端框架代码行数:"+str(lines))

