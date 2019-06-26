# -*- coding: UTF-8 -*-
import os
from code import Genfour

def read(lever):
    if lever == 1:
        if os.path.isfile('test.txt') == False:
            Genfour(1)
        f=open("test.txt","r")
        list2=[]
        for line in f.readlines():
            location=str(line).find('=')
            list1 = [line[0:location+1],line[location+1:-1]]
            list2.append(list1)
        text = list2
    elif lever == 2:
        if os.path.isfile('test1.txt') == False:
            Genfour(2)
        f=open("test1.txt","r")
        list2=[]
        for line in f.readlines():
            location=str(line).find('=')
            list1 = [line[0:location+1],line[location+1:-1]]
            list2.append(list1)
        text = list2
    elif lever == 3:
        if os.path.isfile('test2.txt') == False:
            Genfour(3)
        f=open("test2.txt","r")
        list2=[]
        for line in f.readlines():
            location=str(line).find('=')
            list1 = [line[0:location+1],line[location+1:-1]]
            list2.append(list1)
        text = list2
    else:
        text=0
    f.close()
    Genfour(lever)
    return text
    