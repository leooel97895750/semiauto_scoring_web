# -*- coding: utf-8 -*-
"""
Created on Wed May 13 13:32:38 2020

@author: HAN
"""

from mne.io import concatenate_raws, read_raw_edf
import mne
from array import array
import math
import numpy as np
import tkinter as tk
from tkinter import filedialog
import os
import mysql.connector

root = tk.Tk()
root.title("edf conveter")
root.geometry("400x400")
edf_path = ""
ans_file = ""

def rate_change(edflist):
    anslist = []
    for i in range(750):
        anslist.append((edflist[4*i]+edflist[4*i+1]+edflist[4*i+2]+edflist[4*i+3])/4)
    anslist.append(edflist[3000])
    return anslist
def rate_change2(edflist):
    anslist = []
    for i in range(750):
        num=0
        for j in range(20):
            num=num+edflist[20*i+j]
        anslist.append(num/20)
    anslist.append(edflist[15000])
    return anslist
def rate_change3(edflist):
    anslist = []
    for i in range(30):
        if(edflist[i]==0):
            for j in range(25):
                anslist.append(-2)
        if (edflist[i] == 3):
            for j in range(25):
                anslist.append(2)
        if (edflist[i] == 6):
            for j in range(25):
                anslist.append(1)
        if (edflist[i] == 9):
            for j in range(25):
                anslist.append(-1)
        if (edflist[i] == 12):
            for j in range(25):
                anslist.append(0)
    if (edflist[30] == 0):
        anslist.append(-2)
    if (edflist[30] == 3):
        anslist.append(2)
    if (edflist[30] == 6):
        anslist.append(1)
    if (edflist[30] == 9):
        anslist.append(-1)
    if (edflist[30] == 12):
        anslist.append(0)
    return anslist
def select_edf(label):
    global edf_path
    types = [('Edf File', '*.edf')]
    get = filedialog.Open(root, filetypes=types)
    get2 = get.show()
    edf_path = get2
    label.config(text="Edf path = " + edf_path)


def select_ans(label):
    global ans_file
    types = [('Ans File', '*.json')]
    get = filedialog.Open(root, filetypes=types)
    get2 = get.show()
    ans_file = get2
    label.config(text="Ans path = " + ans_file)


def run(label):
    global edf_path
    global ans_file
    if edf_path == "" or ans_file == "":
        label.config(text="Status:Edf or Ans is None")
        return
    label.config(text="Status:Edf File Loading...")
    label.update()
    raw = read_raw_edf(edf_path, preload=True)
    event_id, event = mne.events_from_annotations(raw)
    times = math.floor(len(raw[0][0][0])/30001.0)
    # print(times)
    # units = raw._orig_units
    # ch_names = raw.ch_names
    # print(units['C3-M2'])
    # print(ch_names[0])
    # unit convert
    label.config(text="Status:Converting...")
    label.update()
    '''for i in range(len(ch_names)):

        if unit[ch_names[i]] == "µV":
            raw[i][0][0][::] = 

    '''
    for i in range(100,times):
        print(i + 1 - 100)
        fp = open(os.path.splitext(os.path.split(edf_path)[1])[0] + "_" + str(i + 1 - 100) + "_up", "wb")
        output_array = array('f', [])
        output_array.extend(np.take(raw[0][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000000)
        output_array.extend(np.take(raw[1][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000000)
        output_array.extend([0 for i in range(0, 6001)])
        output_array.extend(np.take(raw[2][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000000)
        output_array.extend([0 for i in range(0, 6001)])
        output_array.extend(np.take(raw[3][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000000)
        output_array.extend(np.take(raw[4][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000000)
        output_array.extend(np.take(raw[5][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000000)
        output_array.extend(np.take(raw[6][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000000)
        output_array.extend(np.take(raw[11][0][0], range(30000 * i, 30000 * (i + 1) + 1,5)) * 1000)
        output_array.tofile(fp)
        output_array = []
        fp.close()

        fp2 = open(os.path.splitext(os.path.split(edf_path)[1])[0] + "_" + str(i + 1 - 100) + "_down", "wb")
        output_array2 = array('f', [])
        output_array2.extend(rate_change2(np.take(raw[16][0][0], range(30000 * i, 30000 * (i + 1) + 1, 2))))
        output_array2.extend(raw[16][0][0][30000 * (i + 1):30000 * (i + 1)])
        output_array2.extend(rate_change(np.take(raw[15][0][0], range(30000 * i, 30000 * (i + 1) + 1, 10))*0.025))
        output_array2.extend(raw[15][0][0][30000 * (i + 1):30000 * (i + 1)]*0.025)
        output_array2.extend(rate_change(np.take(raw[14][0][0], range(30000 * i, 30000 * (i + 1) + 1, 10))*25))
        output_array2.extend(raw[14][0][0][30000 * (i + 1):30000 * (i + 1)]*50)
        output_array2.extend(rate_change(np.take(raw[12][0][0], range(30000 * i, 30000 * (i + 1) + 1, 10))*25))
        output_array2.extend(raw[12][0][0][30000 * (i + 1):30000 * (i + 1)]*50)
        output_array2.extend(rate_change(np.take(raw[13][0][0], range(30000 * i, 30000 * (i + 1) + 1, 10))*25))
        output_array2.extend(raw[13][0][0][30000 * (i + 1):30000 * (i + 1)]*50)
        output_array2.extend(np.take(raw[17][0][0], range(30000 * i, 30000 * (i + 1) + 1, 1000)))
        output_array2.extend(raw[17][0][0][30000 * (i + 1):30000 * (i + 1)])
        output_array2.extend(np.take(raw[7][0][0], range(30000 * i, 30000 * (i + 1) + 1, 5)) * 1000000)
        output_array2.extend(np.take(raw[8][0][0], range(30000 * i, 30000 * (i + 1) + 1, 5)) * 1000000)
        output_array2.extend(np.take(raw[23][0][0], range(30000 * i, 30000 * (i + 1) + 1, 1000)))
        output_array2.extend(raw[23][0][0][30000 * (i + 1):30000 * (i + 1)])
        output_array2.extend(rate_change3(np.take(raw[18][0][0], range(30000 * i, 30000 * (i + 1 ) + 1, 1000))))
        output_array2.extend(raw[18][0][0][30000 * (i + 1):30000 * (i + 1)])
        output_array2.tofile(fp2)
        output_array2 = []
        fp2.close()

        label.config(text="Status:Converting... " + str(i + 1 - 100) + "/" + str(times-100))
        label.update()

    label.config(text="Status:Convert Success")
    label.update()

    # ----------------------- insert into database ---------------------------
    mydb = mysql.connector.connect(host="127.0.0.1", user="root", password="sfliang62549",
                                   database="staging_online_db2")
    mycursor = mydb.cursor()

    sql = "INSERT INTO psg_file (name, nums, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12, ch13, ch14, ch15, ch16, ch17, ch18, ch19, ch20, answer_file) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (
    os.path.splitext(os.path.split(edf_path)[1])[0], str(times-100), "200", "200", "200", "200", "200", "200", "200", "200",
    "200", "200", "25", "25", "25", "25", "25", "1", "200", "200", "1", "25",
    os.path.splitext(os.path.split(ans_file)[1])[0])
    print(val)
    mycursor.execute(sql, val)

    mydb.commit()
    # ----------------------- insert into database ---------------------------
    label.config(text="Status:Insert Database Success")

label1 = tk.Label(root, text="Edf Path = ", anchor='w')
label1.place(x = 10, y = 50, width = 400, height = 30)
button1 = tk.Button(root, text="Open Edf File", command=lambda:select_edf(label1))
button1.place(x = 10, y = 10, width = 100, height = 30)
label3 = tk.Label(root, text="Status:", anchor='w')
label3.place(x = 10, y = 210, width = 400, height = 30)
button2 = tk.Button(root, text="Convert", command=lambda:run(label3))
button2.place(x = 10, y = 170, width = 100, height = 30)
label2 = tk.Label(root, text="Ans Path = ", anchor='w')
label2.place(x = 10, y = 130, width = 400, height = 30)
button3 = tk.Button(root, text="Open Ans File", command=lambda:select_ans(label2))
button3.place(x= 10, y = 90, width = 100, height= 30)




root.mainloop()
