# -*- coding: UTF-8 -*-
from aiohttp import web

async def index(request):
    f = open('test.txt','r')
    return web.Response(text=f.read())