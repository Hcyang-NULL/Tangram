# -*- coding: UTF-8 -*-
import random


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
                var+=str(temp1)+'-'+str(temp2)+'='+str(temp3)
            else:
                temp3=temp2-temp1
                var+=str(temp2)+'-'+str(temp1)+'='+str(temp3)
        var += '\n'
    f.write(var)
    f.close()

def Genmid():
    pass


def Gendif():
    pass


'''
Genfour is generate formula
simple only have two number,sub or add,two number is not beyond twenty
middle may have two number,sub , add, mul or div,two  number is not beyond 100
difficult will have four number ,mix all opreator,include ()
'''


def Genfour(a):
    if a == 1:
        Gensimple()
    elif a == 2:
        Genmid()
    elif a == 3:
        Gendif()
    else:
        print('Error')
        exit(0)


if __name__ == "__main__":
    Genfour(1)
