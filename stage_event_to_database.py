# -*- coding: utf-8 -*-
"""
Created on Wed Apr 27 13:38:15 2022

@author: leo
"""
# pip install mysql-connector-python
import mysql.connector

# 設定要連線的server位置
mydb = mysql.connector.connect(host="140.116.245.44", user="root", password="sfliang62549", database="staging_online_db2")
mycursor = mydb.cursor()

# 讀取預測與偵測結果的檔案
psg_file_id = input("psg file id ? : ")
path = r"G:/共用雲端硬碟/Sleep center data/auto_detection/sleep_scoring_AI/2022_Sleep_Scoring_AI/2022result/result_answer/"
filename = input("result_answer file name: ")
file = open(path + filename, 'r')
data = file.readlines()
epoch = len(data)
print("epoch number: " + str(epoch))
start = input("press enter key to conitune...")

# 標記此檔案有預測資料
sql = "update psg_file (prediction)"
val = (1)
mycursor.execute(sql, val)
mydb.commit()

# 插入每一頁預測的stage
for i in range(epoch):
    # 標準答案、樹的節點、預測答案、預測答案經過模糊、預測答案機過模糊且替換低信賴區間
    stage = data[i].split('\n')[0].split(',')
    
    # 插入資料庫
    sql = "insert into stage_prediction (psg_file_id, epoch, golden_stage, node_stage, auto_stage, stage_smooth, stage_smooth_reliable)"
    val = (psg_file_id, i, stage[0], stage[1], stage[2], stage[3], stage[4])
    mycursor.execute(sql, val)
    mydb.commit()
    
# 插入預測的event
for i in range()