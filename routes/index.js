var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config.js');
var today = false;
var connection = mysql.createConnection({
	host: config.host,
	user: config.username,
	password: config.password,
	database: config.database
});

connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
	var message = req.query.msg;
	if(message == 'added'){
		message = "You task was added";
	}else if(message == 'deleted'){
		message = 'You deleted a task';
	}else if(message == 'today'){
		message = 'Here is your tasks for today';
	}
	if (!today){
		var selectQuery = "SELECT * FROM tasks";
	}else{
		var selectQuery = 'SELECT * FROM tasks WHERE taskDate = curdate()';
	}
	connection.query(selectQuery, (error, results)=>{
		console.log(results);
		today = false;
		res.render('index', { message: message, taskArray: results });
	});
});

router.post('/addItem', (req, res, next)=>{
	var newTask = req.body.newTask;
	var dueDate = req.body.newTaskDate;
	var insertQuery = `INSERT INTO tasks (taskName, taskDate) VALUES ('${newTask}', '${dueDate}');`;
	// res.send(insertQuery);
	connection.query(insertQuery, (error, results)=>{
		if (error) throw error;
		res.redirect('/?msg=added');
	});

	// res.render('index', {newTask: newTask, dueDate: dueDate});
});

router.get('/delete/:id', (req, res)=>{
	var idToDelete = req.params.id;
	var deleteQuery = `DELETE FROM tasks WHERE id= '${idToDelete}';`;
	connection.query(deleteQuery, (error, results)=>{
		res.redirect('/?msg=deleted');
	});
});

router.get('/today-tasks', (req,res)=>{
	today = true;
	res.redirect('/?msg=today');
});
module.exports = router;
