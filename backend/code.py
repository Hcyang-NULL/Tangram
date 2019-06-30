# -*- coding: UTF-8 -*-
import random

'''
Genfour is generate formula
simple only have two number,sub or add,two number is not beyond twenty
middle may have two number,sub , add, mul or div,two  number is not beyond 100
difficult will have four number ,mix all opreator,include ()
'''
'''simple only have two number,sub or add,two number is not beyond twenty'''
def Gensimple():
    f = open('test.txt', 'w')
    var = ''
    for i in range(50):
        temp1 = random.randint(1, 20)
        temp2 = random.randint(1, 20)
        op = random.randint(1, 2)
        if op == 1:
            temp3 = temp1+temp2
            var += str(temp1)+'+'+str(temp2)+'='+str(temp3)
        else:
            if temp1 >= temp2:
                temp3 = temp1-temp2
                var += str(temp1)+'-'+str(temp2)+'='+str(temp3)
            else:
                temp3 = temp2-temp1
                var += str(temp2)+'-'+str(temp1)+'='+str(temp3)
        var += '\n'
    f.write(var)
    f.close()

'''middle may have two number,sub , add, mul or div,two  number is not beyond 100'''
def Genmid():
    f = open('test1.txt', 'w')
    var = ''
    for i in range(50):
        op = random.randint(1, 4)
        if op == 1:
            temp1 = random.randint(1, 100)
            temp2 = random.randint(1, 100)
            temp3 = temp1+temp2
            var += str(temp1)+'+'+str(temp2)+'='+str(temp3)
        elif op == 2:
            temp1 = random.randint(1, 100)
            temp2 = random.randint(1, 100)
            if temp1 >= temp2:
                temp3 = temp1-temp2
                var += str(temp1)+'-'+str(temp2)+'='+str(temp3)
            else:
                temp3 = temp2-temp1
                var += str(temp2)+'-'+str(temp1)+'='+str(temp3)
        elif op == 3:
            temp1 = random.randint(1, 10)
            temp2 = random.randint(1, 10)
            temp3 = temp1*temp2
            var+=str(temp1)+'*'+str(temp2)+'='+str(temp3)
        else:
            temp1 = random.randint(1, 10)
            temp2 = random.randint(1, 10)
            temp3 = temp1*temp2
            var+=str(temp3)+'/'+str(temp1)+'='+str(temp2)
        var += '\n'
    f.write(var)
    f.close()

'''difficult will have four number ,mix all opreator,include ()'''
def Gendif():
    f = open('test2.txt','w')
    var = ''
    i=0
    while(i<50):
        var1=''
        type = random.randint(1,6)
        temp1=random.randint(1,10)
        temp2=random.randint(1,10)
        temp3=random.randint(1,10)
        temp4=random.randint(1,10)
        op1=random.choice('+-*/')
        op2=random.choice('+-*/')
        op3=random.choice('+-*/')
        if(type==1):
            var1+='('+str(temp1)+op1+str(temp2)+')'+op2+str(temp3)+op3+str(temp4)
            temp5=eval(var1)
            var1+='='+str(temp5)
        elif(type==2):
            var1+=str(temp1)+op1+'('+str(temp2)+op2+str(temp3)+')'+op3+str(temp4)
            temp5=eval(var1)
            var1+='='+str(temp5)
        elif(type==3):
            var1+=str(temp1)+op1+str(temp2)+op2+'('+str(temp3)+op3+str(temp4)+')'
            temp5=eval(var1)
            var1+='='+str(temp5)
        elif(type==4):
            var1+='('+str(temp1)+op1+str(temp2)+op2+str(temp3)+')'+op3+str(temp4)
            temp5=eval(var1)
            var1+='='+str(temp5)
        elif(type==5):
            var1+=str(temp1)+op1+'('+str(temp2)+op2+str(temp3)+op3+str(temp4)+')'
            temp5=eval(var1)
            var1+='='+str(temp5)
        else:
            var1+=str(temp1)+op1+str(temp2)+op2+str(temp3)+op3+str(temp4)
            temp5=eval(var1)
            var1+='='+str(temp5)
        var1+='\n'
        if( isinstance(temp5,int) and temp5>=0):
            var+=var1
            i=i+1
    f.write(var)
    f.close()


'''Genfour is generate formula'''
def Genfour(a):
    if a == 1:
        Gensimple()
    elif a == 2:
        Genmid()
    elif a == 3:
        try:
            Gendif()
        except:
            print('GENERAL FAILED')
    else:
        print('Error')
        exit(0)


if __name__ == "__main__":
    Genfour(1)
    Genfour(2)
    Genfour(3)