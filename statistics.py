import os

lines = 0
a = os.walk('./html')
for item in a:
    files = item[2]
    for file in files:
        if file.endswith('.js') or file.endswith('.html') or file.endswith('.css'):
            with open(item[0]+'\\'+file, encoding='utf-8') as f:
                for line in f.readlines():
                    if line != "\n":
                        lines += 1
                    
print("前端代码行数:"+str(lines))

lines = 0
a = os.walk('./backend')
for item in a:
    files = item[2]
    for file in files:
        if file.endswith('.py'):
            with open(item[0]+'\\'+file, encoding='utf-8') as f:
                for line in f.readlines():
                    if line != "\n":
                        lines += 1

print("后端代码行数:"+str(lines))
