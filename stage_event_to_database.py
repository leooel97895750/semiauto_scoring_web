# -*- coding: utf-8 -*-
"""
Created on Wed Apr 27 13:38:15 2022

@author: leo
"""
# pip install mysql-connector-python
import mysql.connector
import json
import math


# 設定要連線的server位置
with open('passwd.json' , 'r') as reader:
    passwd = json.loads(reader.read())
mydb = mysql.connector.connect(host=passwd['host'], user=passwd['user'], password=passwd['password'], database=passwd['database'])
mycursor = mydb.cursor()

stage_path = r"G:/共用雲端硬碟/Sleep center data/auto_detection/sleep_scoring_AI/2022_Sleep_Scoring_AI/2022result/result_answer/"
event_path = r"G:/共用雲端硬碟/Sleep center data/auto_detection/respiratory_detect/2022data/result/"
# 讀取預測與偵測結果的檔案
# stage
psg_file_id = input("psg file id ? : ")
filename_stage = input("result_answer(stage) file name: ")
file_stage = open(stage_path + filename_stage, 'r')
data_stage = file_stage.readlines()
epoch = len(data_stage)
print("epoch number: " + str(epoch))

# event
filename_event = input("result(event) file name: ")
file_event = open(event_path + filename_event, 'r')
data_event = file_event.read().split('\n')[:-1]
#apnea_artifact = data_event[0].split(',')
apnea = data_event[1].split(',')
#hypopnea_artifact = data_event[2].split(',')
hypopnea = data_event[3].split(',')
spo2_artifact = data_event[4].split(',')
spo2 = data_event[5].split(',')
arousal = data_event[6].split(',')

start = input("press enter key to conitune...")



# 標記此檔案有預測資料
sql = "update psg_file set prediction = %s where id = %s"
val = (1, psg_file_id)
mycursor.execute(sql, val)
mydb.commit()

answer_stage = []
# 插入每一頁預測的stage
for i in range(epoch):
    # 標準答案、樹的節點、預測答案、預測答案經過模糊、預測答案機過模糊且替換低信賴區間
    stage = data_stage[i].split('\n')[0].split(',')
    answer_stage.append(stage[4])
    
    # 插入資料庫
    sql = "insert into stage_prediction (psg_file_id, epoch, golden_stage, node, auto_stage, stage_smooth, stage_smooth_reliable) values(%s, %s, %s, %s, %s, %s, %s)"
    val = (psg_file_id, i, stage[0], stage[1], stage[2], stage[3], stage[4])
    mycursor.execute(sql, val)
    mydb.commit()

    
    
# 插入事件
eventid = 0
# 插入預測的apnea
timefrom = 0
timeto = 0
start = 0
for i in range(len(apnea)):
    if answer_stage[math.floor(i/30)] != '0':
        if apnea[i] == '1' and start == 0:
            print('start')
            timefrom = i
            start = 1
        elif apnea[i] == '0' and start == 1:
            timeto = i - 1
            start = 0
            # 將此段事件插入資料庫
            sql = "insert into event_prediction (psg_file_id, type, timefrom, timeto, eventid, channelid) values(%s, %s, %s, %s, %s, %s)"
            val = (psg_file_id, "Obstructive Apnea", timefrom, timeto, eventid, 12)
            mycursor.execute(sql, val)
            mydb.commit()
            eventid = eventid + 1
    else:
        start = 0

start = 0
for i in range(len(hypopnea)):
    if answer_stage[math.floor(i/30)] != '0':
        if hypopnea[i] == '1' and start == 0:
            timefrom = i
            start = 1
        elif hypopnea[i] == '0' and start == 1:
            timeto = i - 1
            start = 0
            # 將此段事件插入資料庫
            sql = "insert into event_prediction (psg_file_id, type, timefrom, timeto, eventid, channelid) values(%s, %s, %s, %s, %s, %s)"
            val = (psg_file_id, "Obstructive Hypopnea", timefrom, timeto, eventid, 12)
            mycursor.execute(sql, val)
            mydb.commit()
            eventid = eventid + 1
    else:
        start = 0
        
start = 0
for i in range(len(spo2_artifact)):
    if answer_stage[math.floor(i/30)] != '0':
        if spo2_artifact[i] == '1' and start == 0:
            timefrom = i
            start = 1
        elif spo2_artifact[i] == '0' and start == 1:
            timeto = i - 1
            start = 0
            # 將此段事件插入資料庫
            sql = "insert into event_prediction (psg_file_id, type, timefrom, timeto, eventid, channelid) values(%s, %s, %s, %s, %s, %s)"
            val = (psg_file_id, "SpO2 Artifact", timefrom, timeto, eventid, 16)
            mycursor.execute(sql, val)
            mydb.commit()
            eventid = eventid + 1
    else:
        start = 0    
    
start = 0
for i in range(len(spo2)):
    if answer_stage[math.floor(i/30)] != '0':
        if spo2[i] == '1' and start == 0:
            timefrom = i
            start = 1
        elif spo2[i] == '0' and start == 1:
            timeto = i - 1
            start = 0
            # 將此段事件插入資料庫
            sql = "insert into event_prediction (psg_file_id, type, timefrom, timeto, eventid, channelid) values(%s, %s, %s, %s, %s, %s)"
            val = (psg_file_id, "SpO2 Desat", timefrom, timeto, eventid, 16)
            mycursor.execute(sql, val)
            mydb.commit()
            eventid = eventid + 1
    else:
        start = 0    
        
start = 0
for i in range(len(arousal)):
    if answer_stage[math.floor(i/30)] != '0':
        if arousal[i] == '1' and start == 0:
            timefrom = i
            start = 1
        elif arousal[i] == '0' and start == 1:
            timeto = i - 1
            start = 0
            # 將此段事件插入資料庫
            sql = "insert into event_prediction (psg_file_id, type, timefrom, timeto, eventid, channelid) values(%s, %s, %s, %s, %s, %s)"
            val = (psg_file_id, "ARO SPONT", timefrom, timeto, eventid, 2)
            mycursor.execute(sql, val)
            mydb.commit()
            eventid = eventid + 1
    else:
        start = 0   
        