var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var uuid = require('uuid');
const Excel = require("exceljs")
//var bcrypt = require('bcrypt');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const bcrypt = require("bcrypt")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.json());
app.use(session(JSON.parse(fs.readFileSync("config/session.json", "utf-8"))));

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  next(createError(404));
});
*/

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function readFileToObject(filepath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (err, data) => {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(JSON.parse(data))
			}
		})
	})
}
function readedf(filepath) {
	return new Promise (( resolve, reject ) => {
		fs.readFile(filepath, (err, data) => {
			if(err) {
				console.log(err)
				reject(err)
			}else {
				resolve(data)
			}
		})
	})
}
const compare = function (text, hash) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(text, hash, function(err, res) {
			if (err) {
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
	
}
const salt = JSON.parse(fs.readFileSync("config/hash.json"))["salt"]
const passwordHash = function(password) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, salt, function(err, hash) {
			if (err) {
				reject(err)
			} else {
				resolve(hash)
			}
		})
	})
}
const writeExcel = function(workbook, file) {
	return new Promise((resolve, reject) => {
		workbook.xlsx.writeFile(file).then(function() {
			resolve()
		})
	})
}
const pool = mysql.createPool(JSON.parse(fs.readFileSync("config/database.json"))[0])
const query = function( sql, values ) {
	return new Promise(( resolve, reject ) => {
		pool.query(sql, values, ( err, result) => {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/*
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});
*/
//const getEpochQry = fs.readFileSync("sql/get_epoch.sql", "utf-8")
const getFileInfoQry = fs.readFileSync("sql/get_file_info.sql", "utf-8")
//const getFileLengthQry = fs.readFileSync("sql/get_file_length.sql", "utf-8")
const listAllFileQry = fs.readFileSync("sql/list_all_file_.sql", "utf-8")
//const loadUserStagingQry = fs.readFileSync("sql/load_user_staging.sql", "utf-8")
const loginQry = fs.readFileSync("sql/login.sql", "utf-8")
const checkFileCompletedQry = fs.readFileSync("sql/check_file_completed.sql", "utf-8")
const statQry = fs.readFileSync("sql/stat.sql", "utf-8")
//const deletePauseQry = fs.readFileSync("sql/delete_pause.sql", "utf-8")
//const insertPauseQry = fs.readFileSync("sql/insert_pause.sql", "utf-8")
//const loadPauseQry = fs.readFileSync("sql/load_pause.sql", "utf-8")
const showStagingQry = fs.readFileSync("sql/show_staging.sql", "utf-8")
const showEventQry = fs.readFileSync("sql/show_event.sql", "utf-8")
const getFileNameQry = fs.readFileSync("sql/get_file_name.sql", "utf-8")
const resetPasswordQry = fs.readFileSync("sql/reset_password.sql", "utf-8")
//const scoreTimesQry = fs.readFileSync("sql/score_times.sql", "utf-8")
//const getArousalQry = fs.readFileSync("sql/get_arousal.sql", "utf-8")
const getchsegQry = fs.readFileSync("sql/get_ch_seg_info.sql", "utf-8")
const getFilenameNumsQry = fs.readFileSync("sql/get_epoch_data.sql", "utf-8")
const getStagePrediction = fs.readFileSync("sql/get_stage_prediction.sql", "utf-8")
const getEventPrediction = fs.readFileSync("sql/get_event_prediction.sql", "utf-8")
const pause_info = fs.readFileSync("sql/pause_info.sql", "utf-8")
const insert_pause = fs.readFileSync("sql/insert_pause_info.sql", "utf-8")
const insert_pause_stage = fs.readFileSync("sql/insert_pause_stage.sql", "utf-8")
const insert_pause_event = fs.readFileSync("sql/insert_pause_event.sql", "utf-8")
const update_jump = fs.readFileSync("sql/update_jump.sql", "utf-8")
const del_pause_stage = fs.readFileSync("sql/del_pause_stage.sql", "utf-8")
const del_pause_event = fs.readFileSync("sql/del_pause_event.sql", "utf-8")
const stage_result_qry = fs.readFileSync("sql/stage_result_qry.sql", "utf-8")
const pause_stage_qry = fs.readFileSync("sql/pause_stage_qry.sql", "utf-8")
const insert_stage_result = fs.readFileSync("sql/insert_stage_result.sql", "utf-8")
const insert_event_result = fs.readFileSync("sql/insert_event_result.sql", "utf-8")
const pause_event_qry = fs.readFileSync("sql/pause_event_qry.sql", "utf-8")
const del_pause_info_all = fs.readFileSync("sql/del_pause_info(all).sql", "utf-8")
const del_pause_stage_all = fs.readFileSync("sql/del_pause_stage(all).sql", "utf-8")
const del_pause_event_all = fs.readFileSync("sql/del_pause_event(all).sql", "utf-8")
const stage_result_qry_all = fs.readFileSync("sql/stage_result_qry_all.sql", "utf-8")
const event_result_qry_all = fs.readFileSync("sql/event_result_qry_all.sql", "utf-8")
const get_psg_file_info = fs.readFileSync("sql/get_psg_file_info.sql", "utf-8")
const stage_result_qry_times = fs.readFileSync("sql/stage_result_qry_times.sql", "utf-8")
const update_event = fs.readFileSync("sql/update_event.sql", "utf-8")
const getAnswerFile = fs.readFileSync("sql/get_answer_file.sql", "utf-8")

//????????????????????????????????????
/*
app.get("/", async function(req, res) {
	let account = req.session.account
	if (!account) {
    //??????????????????????????????????????????
		res.sendFile(__dirname + "/html/index.html")
		return
 	}
  //??????????????????????????????????????????
	let result = await query(listAllFileQry, [account, account])
	res.render("view", {account: account, files: result})
})

app.get("/reset", function(req, res) {
	let account = req.session.account
	if (!account) {
		res.redirect("/")
		return
	}
	res.sendFile(__dirname + "/html/reset.html")
})
*/
//????????????
app.post("/ajax_reset_pass", async function(req, res) {
	let responseObj = {
		success: false,
		msg: null
	}
	let account = req.session.account
	let oldPass = req.body.oldPass
	let newPass = req.body.newPass
	let newPass2 = req.body.newPass2
	// ??????????????????
	if (!account) {
		responseObj.msg = "???????????????"
		res.send(responseObj)
		return
	}
	let accountResult = await query(loginQry, [account])
	// ?????????????????????
	if (!(await compare(oldPass, accountResult[0]["password"]))) {
		responseObj.msg = "???????????????"
		res.send(responseObj)
		return
	}
	// ?????????????????????
	if (newPass != newPass2) {
		responseObj.msg = "??????????????????"
		res.send(responseObj)
		return
	}
	let passTest = /^[a-zA-Z0-9]{4,}$/
	// Regex????????????
	if (!newPass.match(passTest)) {
		responseObj.msg = "?????????????????????"
		res.send(responseObj)
		return
	}
	// ????????????
	let passHash = await passwordHash(newPass)
	// ???????????????
	await query(resetPasswordQry, [passHash, account])
	responseObj.success = true
	res.send(JSON.stringify(responseObj))
})

//????????????
app.post("/ajax_login", async function(req, res) {

	let accountResult = await query(loginQry, [req.body.account])
	// ?????????????????????
	if (accountResult.length == 0) {
		res.send({
			success: false,
			msg: '??????????????????'
		})
		return
	}
	
	// ??????????????????
	if (await compare(req.body.password, accountResult[0]["password"])) {
		req.session.account = req.body.account
		res.send({
			success: true
		})
		return
	}
	/*
	if(req.body.password == accountResult[0]["password"]) {
		req.session.account = req.body.account
		res.send({
			success: true
		})
		return
	}
	*/
	/*if (await compare(req.body.password, accountResult[0]["password"])) {
		req.session.account = req.body.account
		res.send("success")
		return
	}*/
	res.send({
		success: false,
		msg: '????????????????????????'
	})
})

//??????
app.post("/ajax_logout", function(req, res) {
	if (req.session.account) {
		//console.log(req.session.account + " logout")
		req.session.destroy(function(err) {
			if (err) {
				console.log("error: ", err)
			} else {
				res.send({
					success: true
				})
			}
		})
	}
})

//??????PSG??????channel?????????????????????(??????????????????????????????ephoc?????????)
//????????????PSG file???offset ??? length(????????????0 6001 > 24004 6001...)
app.post("/ajax_ch_seg", async function(req, res) {
	//console.log(req)
	let account = req.session.account
	let psgFileId = parseInt(req.body.psgFileId)
  	// ??????????????????
  	if (!account) {
    	res.send({
			success: false,
			msg: '???????????????'
		})
    	return
	}
	// ??????????????????channel sample rate
	let result = await query(getchsegQry, [psgFileId])
	if(result.length == 0) {
		res.send({
			success: false,
			msg: '??????????????????'
		})
		return
	}
	let a = {}
	let ch_name = ['C3M2', 'C4M1', 'F3M2', 'F4M1', 'O1M2', 'O2M1', 'E1M2', 'E2M2', 'EMGR', 'ECG', 'Sound', 'NPress', 'Therm', 'Thor', 'Abdo', 'SpO2', 'LimbL', 'LimbR', 'Pulse', 'Position']
	a.lowerChannels = []
	a.upperChannels = []
	var now = 0;
	// ?????????10 channels?????????
	for (let i = 1; i <= 10; i++) {
		a.upperChannels.push({
			channelName: ch_name[i - 1],
			offset: now,
			length: result[0]['ch'+String(i)] * 30 + 1,
		})
		now += (result[0]['ch'+String(i)] * 30 + 1) * 4
	}
	// ?????????10 channels?????????
	//console.log(result)
	now = 0
	for (let i = 11; i <= 20; i++) {
		a.lowerChannels.push({
			channelName: ch_name[i - 1],
			offset: now,
			length: result[0]['ch'+String(i)] * 30 + 1,
		})
		now += (result[0]['ch'+String(i)] * 30 + 1) * 4
	}
	a.totalEpochNumber = result[0]['nums']
	//console.log(a)
	//res.setHeader('Access-Control-Allow-Origin', '*')
	a.success = true
	res.send(a)
})

// ????????????ephoc???????????????
app.post("/ajax_epoch_upper", async function(req, res) {
	//await timeout(3000)
	//console.log(req)
	let account = req.session.account
	let psgFileId = parseInt(req.body.psgFileId)
	let epochNum = parseInt(req.body.epochNum)
	//console.log(psgFileId)
	// ??????????????????
	/*
	if (!account) {
		res.send("failed")
		return
	}
	*/
	let result = await query(getFilenameNumsQry, [psgFileId])
	//console.log(result)
	if(result.length == 0) {
		res.send("")
		return
	}
	// ???????????????epoch????????????
	if(epochNum > result[0].nums && epochNum <= 0) {
		res.send("Invalid")
		return
	}
	//console.log(result)
	res.setHeader('Access-Control-Allow-Origin', '*')
	// res.sendFile(__dirname + "/psgfile/" + result[0].name + "_" + String(epochNum + 1) + "_up")
	res.sendFile(__dirname + "/psgfile/" + result[0].name + "/" + result[0].name + "_" + String(epochNum + 1) + "_up")
})

  //????????????ephoc???????????????
app.post("/ajax_epoch_lower", async function(req, res) {
	//await timeout(3000)
	let account = req.session.account
	let psgFileId = parseInt(req.body.psgFileId)
	let epochNum = parseInt(req.body.epochNum)
	// ??????????????????
	/*if (!account) {
		res.send("failed")
		return
	}*/
	let result = await query(getFilenameNumsQry, [psgFileId])
	if(result.length == 0) {
		res.send("")
		return
	}
	// ???????????????epoch????????????
	if(epochNum > result[0].nums && epochNum <= 0) {
		res.send("Invalid")
		return
	}
	//console.log(result)
	res.setHeader('Access-Control-Allow-Origin', '*')
	// res.sendFile(__dirname + "/psgfile/" + result[0].name + "_" + String(epochNum + 1) + "_down")
	res.sendFile(__dirname + "/psgfile/" + result[0].name + "/" + result[0].name + "_" + String(epochNum + 1) + "_down")
})

// ?????????????????????
app.post("/ajax_update_pause", async function(req, res) {
	let account = req.session.account
	//console.log('account', account)
	// ??????????????????
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
	let stages = req.body.stages
	let events = req.body.events
	//console.log(events)
	let intervalStrToInt = {
		'10 sec': 10,
		'30 sec': 30,
		'1 min': 60,
		'2 min': 120,
		'3 min': 180,
		'5 min': 300,
		'10 min': 600
	}
	let jump = req.body.jump
	//console.log([account, psgFileId])
	let result = await query(pause_info, [account, psgFileId])
	// ????????????????????????????????????????????????pause ID
	if(result.length == 0) {
		let pause_id = uuid.v1()
		let sql_add2 = "INSERT INTO pause_stage (pause_id, epoch, stage) VALUES "
		let add_data2 = []
		// ???????????????pause_info(pause_id, jump)
		if (jump !== null) {
			let result2 = await query(insert_pause, [pause_id, account, psgFileId, jump.upperTimeFrom, intervalStrToInt[jump.upperTimeInterval], jump.lowerTimeFrom, intervalStrToInt[jump.lowerTimeInterval], jump.cursorLine])
		}else {
			let rrrrrr2 = await query(insert_pause, [pause_id, account, psgFileId, 0, 30, 0, 30, 0])
		}
		// ???????????????pause_stage(pause_id, epoch, stage)
		if (stages !== null) {
			/*for(var i = 0; i < stages.length; i++) {
				let result3 = await query(insert_pause_stage, [pause_id, stages[i].epochNum, stages[i].stage])
			}*/
			for(var i = 0; i < stages.length; i++) {
				if(i !== stages.length - 1) {
					sql_add2 = sql_add2 + "(?, ?, ?),"
					add_data2.push(pause_id, stages[i].epochNum, stages[i].stage)
				}
				else {
					sql_add2 = sql_add2 + "(?, ?, ?);"
					add_data2.push(pause_id, stages[i].epochNum, stages[i].stage)
				}
			}
			if(stages.length > 0) {
				let result3 = await query(sql_add2, add_data2)
			}
		}
		// ???????????????pause_event(pause_id, type, timefrom, timeto, eventid, channelid)
		if (events !== null) {
			for(var i = 0; i < events.length; i++) {
				let result4 = await query(insert_pause_event, [pause_id, events[i].type, events[i].timeFrom, events[i].timeTo, events[i].eventId, events[i].channelId])
			}
		}
	}
	// ???????????????????????????ID
	else {
		let pause_id = result[0].pause_id
		// update jump
		if (jump !== null) {
			//console.log([jump.upperTimeFrom, jump.upperTimeInterval, jump.lowerTimeFrom, jump.lowerTimeInterval, jump.cursorLine, pause_id])
			let result2 = await query(update_jump, [jump.upperTimeFrom, intervalStrToInt[jump.upperTimeInterval], jump.lowerTimeFrom, intervalStrToInt[jump.lowerTimeInterval], jump.cursorLine, pause_id])
		}
		// insert stage (??????????????????)
		let sql_del = "DELETE FROM pause_stage WHERE "
		let sql_add = "INSERT INTO pause_stage (pause_id, epoch, stage) VALUES "
		let add_data = []
		let del_data = []
		if (stages !== null) {
			for(var i = 0; i < stages.length; i++) {
				//let result3 = await query(del_pause_stage, [pause_id, stages[i].epochNum])
				//let result4 = await query(insert_pause_stage, [pause_id, stages[i].epochNum, stages[i].stage])
				//console.log(stages[i].epochNum)
				if(i !== stages.length - 1) {	
					sql_del = sql_del + "(pause_id = " + '?' + " AND " + "epoch = " + '?' + ") OR ";
					sql_add = sql_add + "(?, ?, ?),"
					add_data.push(pause_id, stages[i].epochNum, stages[i].stage)
					del_data.push(pause_id, stages[i].epochNum)
				}
				else {
					sql_del = sql_del + "(pause_id = " + '?' + " AND " + "epoch = " + '?' + ");";
					sql_add = sql_add + "(?, ?, ?);"
					add_data.push(pause_id, stages[i].epochNum, stages[i].stage)
					del_data.push(pause_id, stages[i].epochNum)
				}
			}
			if(stages.length > 0) {
				let result3 = await query(sql_del, del_data)
				let result4 = await query(sql_add, add_data)
			}
		}
		// event
		if (events !== null) {
			let result5 = null
			for(var i = 0; i < events.length; i++) {
				switch(events[i].action) {
					case "add":
						result5 = await query(insert_pause_event, [pause_id, events[i].type, events[i].timeFrom, events[i].timeTo, events[i].eventId, events[i].channelId])
						break;
					case "delete":
						//console.log('delete', [pause_id, events[i].eventId, events[i].channelId])
						result5 = await query(del_pause_event, [pause_id, events[i].eventId])
						break;
					case "set":
						//console.log('update_event', [events[i].type, pause_id, events[i].eventId, events[i].channelId])
						result5 = await query(update_event, [events[i].type, pause_id, events[i].eventId])
						break;
				}
			}
		}
	}
	let responseObj = {
		success: true,
		msg: null
	}
	res.send(JSON.stringify(responseObj))
})

// ?????????????????????
app.post("/ajax_submit_stage", async function(req, res) {
	let account = req.session.account
	// ??????????????????
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
	// ??????pause_id, psg_file_id
	let result = await query(pause_info, [account, psgFileId])
	// ??????????????????
	let result2 = await query(stage_result_qry, [account, psgFileId])
	let times = 1;
	//console.log(result2)
	if(result2['times'] !== null) {
		//console.log('before add', times)
		//console.log('result2[\'times\']', result2['times'])
		times = result2[0]['times'] + 1;
		//console.log('after add', times)
	}
	// ??????pause_stage
	let result3 = await query(pause_stage_qry, [result[0].pause_id])
	// ???pause_stage??????stage_result
	let sql_add = "INSERT INTO stage_result (user_account, psg_file_id, times, epoch, stage) VALUES "
	let add_data = []
	for(var i = 0; i < result3.length; i++) {
		//console.log([account, psgFileId, times, result3[i].epoch, result3[i].stage])
		//let result4 = await query(insert_stage_result, [account, psgFileId, times, result3[i].epoch, result3[i].stage])
		if(i !== result3.length - 1) {	
			sql_add = sql_add + "(?, ?, ?, ?, ?),"
			add_data.push(account, psgFileId, times, result3[i].epoch, result3[i].stage)
		}
		else {
			sql_add = sql_add + "(?, ?, ?, ?, ?);"
			add_data.push(account, psgFileId, times, result3[i].epoch, result3[i].stage)
		}
	}
	let result4 = await query(sql_add, add_data)
	// ??????pause_event
	let result5 = await query(pause_event_qry, [result[0].pause_id])
	// ???pause_event??????event_result
	for(var i = 0; i < result5.length; i++) {
		let result6 = await query(insert_event_result, [account, psgFileId, times, result5[i].type, result5[i].timefrom, result5[i].timeto, result5[i].eventid, result5[i].channelid])
	}
	// ??????pause_info, pause_stage, pause_event
	let result7 = await query(del_pause_info_all, [result[0].pause_id])
	let result8 = await query(del_pause_stage_all, [result[0].pause_id])
	let result9 = await query(del_pause_event_all, [result[0].pause_id])
	let responseObj = {
		success: true,
		msg: null
	}
	res.send(JSON.stringify(responseObj))
})

// ?????????????????????
app.post("/ajax_load_pause", async function(req, res) {
	let account = req.session.account
	// ??????????????????
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
	// ?????????????????????
	let result = await query(pause_info, [account, psgFileId])
	var result_stage = null
	var result_event = null
	if(result.length > 0) {
		result_stage = await query(pause_stage_qry, [result[0].pause_id])
		result_event = await query(pause_event_qry, [result[0].pause_id])
	}
	// ??????epoch??????
	let result2 = await query(getchsegQry, [psgFileId])
	let total_num = result2[0].nums;
	// ?????????10
	let stages = new Array(total_num).fill(10);
	// ????????????????????????array
	if(result_stage != null) {
		for(var i = 0; i < result_stage.length; i++) {
			stages[result_stage[i].epoch] = result_stage[i].stage
		}
	}
	let events = []
	// ????????????????????????
	if(result_event != null) {
		for(var i = 0; i < result_event.length; i++) {
			events.push({
				eventId: result_event[i].eventid,
				secondFrom: result_event[i].timefrom,
				secondTo: result_event[i].timeto,
				type: result_event[i].type,
				channelId: result_event[i].channelid
			})
		}
	}
	let jump = {
		upperTimeFrom: 0,
		lowerTimeFrom: 0,
		upperTimeInterval: '30 sec',
		lowerTimeInterval: '30 sec',
		cursorLine: 0
	}
	let intervalIntToStr = {
		10: '10 sec',
		30: '30 sec',
		60: '1 min',
		120: '2 min',
		180: '3 min',
		300: '5 min',
		600: '10 min'
	}
	// ?????????jump???????????????
	if(result.length > 0) {
		jump = {
			upperTimeFrom: result[0].uppertime_from,
			lowerTimeFrom: result[0].lowertime_from,
			upperTimeInterval: intervalIntToStr[result[0].uppertime_interval],
			lowerTimeInterval: intervalIntToStr[result[0].lowertime_interval],
			cursorLine: result[0].cursorline
		}
	}
	let responseObj = {
		success: true,
		msg: null,
		stages: stages,
		events: events,
		jump: jump
	}
	res.send(responseObj)
})

// ??????????????????
app.post("/ajax_load_result", async function(req, res) {
	let account = req.session.account
	// ??????????????????
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
	let scoringTimes = parseInt(req.body.scoringTimes)
	// ??????stage??????
	let result = await query(stage_result_qry_all, [account, psgFileId, scoringTimes])
	// ??????event??????
	let result2 = await query(event_result_qry_all, [account, psgFileId, scoringTimes])
	// ??????epoch??????
	let result3 = await query(getchsegQry, [psgFileId])
	let total_num = result3[0].nums;
	let stages = new Array(total_num).fill(10);
	for(var i = 0; i < result.length; i++) {
		stages[result[i].epoch] = result[i].stage
	}
	let events = []
	for(var i = 0; i < result2.length; i++) {
		events.push({
			secondFrom: result2[i].timefrom,
			secondTo: result2[i].timeto,
			type: result2[i].type,
			eventId: result2[i].eventid,
			channelId: result2[i].channelid
		})
	}
	let responseObj = {
		success: true,
		msg: null,
		stages: stages,
		events: events,
	}
	res.send(responseObj)
})

// ????????????PSG??????
app.post("/ajax_list_files", async function(req, res) {
	let account = req.session.account
	// ??????????????????
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let result = await query(get_psg_file_info)
	let psgInfo = []
	let scoringTimes = 0
	let totalTimes = 0
	let paused = false
	//console.log('start')
	for(var i = 0; i < result.length; i++) {
		// ????????????????????????????????????
		let result2 = await query(stage_result_qry, [account, result[i].id])
		//console.log('result2', result2)
		if(result2.length !== 0) {
			scoringTimes = result2[0]['times'] === null ? 0 : result2[0]['times']
		}
		// ????????????????????????
		var result3 = await query(stage_result_qry_times, [result[i].id])
		//console.log('result3')
		for(var j = 0; j < result3.length; j++) {
			totalTimes += result3[0]['times']
		}
		//console.log('after loop')
		// ?????????????????????
		var result4 = await query(pause_info, [account, result[i].id])
		//console.log('result4')
		if(result4.length == 0) {
			paused = false;
		}else {
			paused = true;
		}
		psgInfo.push({
			psgFileId: result[i].id,
			name: result[i].name,
			scoringTimes: scoringTimes,
			totalTimes: totalTimes,
			paused: paused
		})
		//console.log('push')
	}
	let responseObj = {
		success: true,
		msg: null,
		psgInfo: psgInfo
	}
	res.send(responseObj)
})

// ???????????????
app.post("/ajax_who_am_i", async function(req, res) {
	let account = req.session.account
	// ??????????????????
	/*if (!account) {
		res.send("failed")
		return
	}*/
	//console.log(account)
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.send({
		account: account
	})
})

// ??????SpO2
app.post("/calculate_spo2", async function(req, res) {
	//console.log(req.body)
	let account = req.session.account
	let psgFileId = parseInt(req.body.psgFileId)
	//console.log('psgFileId', psgFileId)
	let result = await query(getFilenameNumsQry, [psgFileId])
	//let data = fs.readFileSync('psgfile/' + result[0].name)
	let timeA = parseInt(req.body.timeA)
	let timeB = parseInt(req.body.timeB)
	let a_epoch = Math.floor(timeA / 30);
	let b_epoch = Math.floor(timeB / 30);
	//console.log('a_epoch b_epoch', [a_epoch, b_epoch])
	let timeAA = timeA % 30;
	let timeBB = timeB % 30;
	//console.log('timeAA timeBB', [timeAA, timeBB])
	//let data_a = fs.readFileSync('psgfile/' + result[0].name + "_" + String(a_epoch + 1) + "_down")
	//let data_b = fs.readFileSync('psgfile/' + result[0].name + "_" + String(b_epoch + 1) + "_down")
	let data_a = await readedf('psgfile/' + result[0].name + "_" + String(a_epoch + 1) + "_down")
	let data_b = await readedf('psgfile/' + result[0].name + "_" + String(b_epoch + 1) + "_down")
	let a_value = data_a.readFloatLE((3755+timeAA)*4)
	let b_value = data_b.readFloatLE((3755+timeBB)*4)
	// ??????????????????
	/*if (!account) {
		res.send("failed")
		return
	}*/
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.send({
		spo2: a_value - b_value
	})
})

app.post('/ajax_load_stat', async function(req, res) {
	let account = req.session.account
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
	let statResult = await query(statQry, [psgFileId])
	res.send({
		success: true,
		stat: statResult
	})
})
app.post('/ajax_load_stat_grp', async function(req, res) {
	let account = req.session.account
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
})

app.post('/ajax_has_answer', async function(req, res) {
	let account = req.session.account
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
	let answerResult = await query(getAnswerFile, psgFileId)
	if (answerResult.length === 0) {
		res.send({
			success: false,
			msg: '?????????????????????'
		})
		return
	}
	res.send({
		success: true,
		hasAnswer: answerResult[0].answer_file !== null
	})
})
// ????????????????????????
app.post('/ajax_answer', async function(req, res) {
	let account = req.session.account
	if (!account) {
		res.send({
			success: false,
			msg: '???????????????'
		})
		return
	}
	let psgFileId = parseInt(req.body.psgFileId)
	let answerResult = await query(getAnswerFile, psgFileId)
	if (answerResult.length === 0) {
		res.send({
			success: false,
			msg: '?????????????????????'
		})
		return
	}
	if (answerResult[0].prediction === null) {
		res.send({
			success: false,
			msg: '????????????????????????'
		})
		return
	}
	// ??????????????????????????????pause_info??????????????????????????????
	console.log("??????API");
	let result = await query(pause_info, [account, psgFileId])
	let pause_id = null;
	if(result.length == 0) {
		pause_id = uuid.v1();
		let insert_pause_result = await query(insert_pause, [pause_id, account, psgFileId, 0, 30, 0, 30, 0]);
	}
	else {
		pause_id = result[0].pause_id;
		let update_jump_result = await query(update_jump, [0, 30, 0, 30, 0, pause_id]);
		let del_pause_stage_all_result = await query(del_pause_stage_all, [pause_id]);
		let del_pause_event_all_result = await query(del_pause_event_all, [pause_id]);
	}
	console.log("??????pause id");
	// ???stage_prediction???event_prediction??????????????????pause????????????????????????????????????????????????
	let stage_prediction = await query(getStagePrediction, [psgFileId]);
	for(let i=0; i<stage_prediction.length; i++){
		// ??????????????????????????????
		let stage = stage_prediction[i].stage_smooth_reliable;
		let stage_result = Math.trunc(stage); // 0???1???2???3???-1
		if(stage_result === 4) stage_result = -1;

		// ????????????
		let node = stage_prediction[i].node_stage;

		let sqlstr = "insert into pause_stage (pause_id, epoch, stage, reason) values (?, ?, ?, ?)";
		let insert_pause_stage_result = await query(sqlstr, [pause_id, i, stage_result, node]);
	}
	let event_prediction = await query(getEventPrediction, [psgFileId]);
	for(let i=0; i<event_prediction.length; i++){
		let sqlstr = "insert into pause_event (pause_id, `type`, timefrom, timeto, eventid, channelid) values (?, ?, ?, ?, ?, ?)";
		let insert_pause_event_result = await query(sqlstr, [pause_id, event_prediction[i].type, event_prediction[i].timefrom, event_prediction[i].timeto, event_prediction[i].eventid, event_prediction[i].channelid]);
	}
	console.log("??????pause??????");
	
	res.send({
		success: true
	})
})
// ??????????????????(not yet)
app.get("/download", async function(req, res) {
	let account = req.session.account
	// ??????????????????
	if (!account) {
		res.redirect("/")
		return
	}
	let id = parseInt(req.query.id)
	// ?????????????????????
	if (isNaN(id)) {
		res.redirect("/")
		return
	}
	// ????????????????????????
	let completed = (await query(checkFileCompletedQry, [account, id]))[0].completed
	if (!completed) {
		res.redirect("/")
		return
	}
	let name = (await query(getFileNameQry, [id]))[0].name
	let stages = await query(showStagingQry, [id])
	let events = await query(showEventQry, [id])
	//console.log(events)
	//let csv = "epoch_num,account,stage\n"
	const num2StageMap = {
		"0": "W",
		"1": "N1",
		"2": "N2",
		"3": "N3",
		"-1": "REM",
		"-2": "?"
	}
	// ????????????????????????
	let rows = []
	let accountSet = new Set()
	for (let i = 0; i < stages.length; i++) {
		let epochNum = stages[i].epoch
		let account = stages[i].user_account
		let stage = num2StageMap[stages[i].stage]
		let times = stages[i].times
		let accountRescore = account + "-" + times
		if (!rows[epochNum]) {
			rows[epochNum] = {}
		}
		rows[epochNum][accountRescore] = stage
		if (!accountSet.has(accountRescore)) {
			accountSet.add(accountRescore)
		}
	}
	let accountArray = Array.from(accountSet)
	
	// ??????excel???
	let workbook = new Excel.Workbook()
	// ?????????????????????
	let worksheet1 = workbook.addWorksheet("Worksheet 1")
	// ??????????????????
	let columns  = [{
		header: "Epoch Number",
		key: "$epochNum"
	}]
	for (let i = 0; i < accountArray.length; i++) {
		columns.push({
			header: accountArray[i],
			key: accountArray[i]
		})
	}
	//console.log(columns)
	worksheet1.columns = columns
	// ????????????
	for (let i = 0; i < rows.length; i++) {
		rows[i]["$epochNum"] = i + 1
		worksheet1.addRow(rows[i])
	}
	// ?????????????????????
	let worksheet2 = workbook.addWorksheet("Worksheet 2")
	// ??????events??????
	let event_columns  = [
		{header: "user_account", key: "user_account"},
		{header: "psg_file_id", key: "psg_file_id"},
		{header: "times", key: "times"},
		{header: "type", key: "type"},
		{header: "timefrom", key: "timefrom"},
		{header: "timeto", key: "timeto"},
		{header: "channelid", key: "channelid"}
	]
	worksheet2.columns = event_columns
	for (let i = 0; i < events.length; i++) {
		worksheet2.addRow(events[i])
	}
	
	// ??????excel??????
	let fileName = "excel/" + uuid.v1() + ".xlsx"
	await writeExcel(workbook, fileName)
	kk_name=name.split('_')
	let n_name=String(kk_name[0])+".xlsx"
	res.set({"content-disposition": "attachment; filename=" + n_name})
	//res.set({"content-disposition": "attachment; filename=" + n_name,"content-type": "application/vnd.ms-excel;"})
	res.sendFile(__dirname + "/" + fileName)
})

module.exports = app
