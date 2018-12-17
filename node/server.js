const express    = require('express');
const path 	     = require('path');
const url        = require('url');
var fs           = require('fs');
const app        = express();
const bodyParser = require('body-parser');
const formidable = require('express-formidable');

var mongoose     = require('mongoose');

mongoose.connect('mongodb://dongyao:041108ldy93122@ds163826.mlab.com:63826/employee');

app.use(express.static(path.join(__dirname, '/www')));

// base
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(formidable());

const port = process.env.PORT || 8888;    

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Resource-With, Content-Type, Accept");
    console.log("requst url = " + req.url);
	next();
})

const Employee = require('./Employee');

// MongoDB
app.get('/getall', async (req, res) => {
	let query = url.parse(req.url, true).query;
	let symbol_query = query.search && query.search.startsWith('(') ? '^\\' + query.search : '^' + query.search;
	let search_input = query.search ? { 
		$or: [ 
			{ name           : { $regex: new RegExp(symbol_query) } }, 
			{ title          : { $regex: new RegExp(symbol_query) } },
			{ sex            : { $regex: new RegExp(symbol_query) } },
			{ start_date     : { $regex: new RegExp(symbol_query) } },
			{ office_number  : { $regex: new RegExp(symbol_query) } },
			{ cell_number    : { $regex: new RegExp(symbol_query) } },
			{ sms            : { $regex: new RegExp(symbol_query) } },
			{ email          : { $regex: new RegExp(symbol_query) } },
			{ "manager.name" : { $regex: new RegExp(symbol_query) } }
		]
	} : {};
	let search_manager = query.manager_id ? {
		_id : query.manager_id
	} : {};
	if (query.DR)
		var DRs = await Employee.findById(query.DR)
	let search_DR = query.DR ? {
		_id : DRs ? DRs.report : DRs
	} : {};
	let search = { $and : [ 
		search_input,
		search_manager,
		search_DR
	]};
	let sort_obj = query.sort === '{}' ? { _id : 1 } : JSON.parse(query.sort).manager ? { "manager.name" : JSON.parse(query.sort).manager } : JSON.parse(query.sort);
	let count = await Employee.countDocuments(search);
	Employee.find(search, function(err, empolyees) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			// console.log({empolyees, count});
			res.send(JSON.stringify({empolyees, count}));
		}
	}).sort(sort_obj).limit(parseInt(query.limit));
});

app.get('/getmanager', (req, res) => {
	Employee.find({}, 'name', function(err, employee) {
		if (err) {
  			console.log(err);
			res.send(err);
		}
		else {
 			console.log(employee);
			res.send(JSON.stringify(employee));
		}
	}).select({ "name": 1, "manager._id": 1}).sort({ _id : 1 });
});

app.post('/addemployee', (req, res) => {
	var employee               = new Employee();
	employee.name              = req.fields.name;
	employee.title             = req.fields.title;
	employee.sex               = req.fields.sex;
	employee.start_date        = req.fields.start_date;
	employee.office_number     = req.fields.office_number;
	employee.cell_number       = req.fields.cell_number;
	employee.sms               = req.fields.sms;
	employee.email             = req.fields.email;
	employee.manager._id       = JSON.parse(req.fields.manager)._id;
	employee.manager.name      = JSON.parse(req.fields.manager).name;
	employee.report            = [];
 	employee.photo.data        = fs.readFileSync(req.files.photo.path);
	employee.photo.contentType = 'image/png';
	employee.save(function(err, newEmployee) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(employee.manager)
			if (employee.manager._id) {
				Employee.findById(employee.manager._id, function(err, manager) {
			 		if (err) {
						console.log(err);
					}
					else {
						console.log(manager);
						manager.report = manager.report.concat(newEmployee._id);
						manager.save(function(err) {
							if (err) {
								console.log(err);
							}
							else {
								console.log('Employee created');
								console.log(req.files.photo)
								res.send(newEmployee._id);
							}
						});
					}
				});
			} else {
				console.log('Employee created!');
				res.send('Employee created!');
			}
		}
	});
});

app.delete('/deleteemployee/', async (req, res) => {
	let query = url.parse(req.url, true).query;
	let symbol_query = query.search && query.search.startsWith('(') ? '^\\' + query.search : '^' + query.search;
	let search_input = query.search ? { 
		$or: [ 
			{ name           : { $regex: new RegExp(symbol_query) } }, 
			{ title          : { $regex: new RegExp(symbol_query) } },
			{ sex            : { $regex: new RegExp(symbol_query) } },
			{ start_date     : { $regex: new RegExp(symbol_query) } },
			{ office_number  : { $regex: new RegExp(symbol_query) } },
			{ cell_number    : { $regex: new RegExp(symbol_query) } },
			{ sms            : { $regex: new RegExp(symbol_query) } },
			{ email          : { $regex: new RegExp(symbol_query) } },
			{ "manager.name" : { $regex: new RegExp(symbol_query) } }
		]
	} : {};
	let sort_obj = query.sort === '{}' ? { _id : 1 } : JSON.parse(query.sort).manager ? { "manager.name" : JSON.parse(query.sort).manager } : JSON.parse(query.sort);
	let cur_employee     = await Employee.findById(query.id);
	let empolyee_DR      = cur_employee.report;
	let empolyee_manager = cur_employee.manager;
	let promises         = [];
	if (empolyee_manager._id){
		promises.push(new Promise((resolve, reject) => {
			Employee.findById(empolyee_manager._id, function(err, manager) {
				if (err) {
					console.log(err);
				}
				else {
					manager.report.splice(manager.report.findIndex(ele => ele === query.id), 1)
					Employee.updateOne({_id : empolyee_manager._id}, {$set: {
						report : manager.report.concat(empolyee_DR)
					}}, function(err, employee) {
						if (err) {
							console.log(err);
							res.send(err);
						}
						else {
							resolve(employee);
						}
					})
				}
			})
		}))
	}
	if (empolyee_DR.length !== 0){
		promises.push(new Promise((resolve, reject) => {
			Employee.updateMany({_id : empolyee_DR}, {$set: {
				manager : empolyee_manager._id ? empolyee_manager : {name : null, _id : null}
			}}, function(err, employee) {
				if (err) {
					console.log(err);
					res.send(err);
				}
				else {
					resolve(employee);
				}
			})
		}))
	}
	Promise.all(promises)
		.then(values => { 
			console.log(values);
			Employee.deleteOne({ _id: query.id}, async function(err) {
				if (err) {
					console.log(err);
					res.send(err);
				}
				else {
					if (query.DR)
						var DRs = await Employee.findById({_id : query.DR})
					let search_DR = query.DR ? {
						_id : DRs ? DRs.report : DRs
					} : {};
					let search = { $and : [ 
						search_input,
						search_DR
					]};
					Employee.find(search, function(err, empolyees) {
						if (err) {
							console.log(err);
							res.send(err);
						}
						else {
							res.send(JSON.stringify(empolyees));
						}
					}).sort(sort_obj).limit(parseInt(query.limit));
				}
			});
		})
	  	.catch(error => { 
			console.log(error);
			res.send(error);
	 	});
});

app.post('/editemployee', async (req, res) => {
	console.log(req.fields)
	let employee = await Employee.findById(req.fields.id);
	console.log(employee)
	let promises   = [];
	let newManager = JSON.parse(req.fields.manager);
	if (req.fields.changeName){
		promises.push(new Promise((resolve, reject) => {
			Employee.updateMany({_id : employee.report}, {$set: {
				"manager.name" : req.fields.name
			}}, function(err, newEmployee) {
				if (err) {
					console.log(err);
					res.send(err);
				}
				else {
					resolve(newEmployee);
				}
			})
		}))
	}
	if (newManager._id && employee.manager._id !== newManager._id){
		promises.push(new Promise((resolve, reject) => {
			Employee.findById(newManager._id, function(err, manager) {
				if (err) {
					console.log(err);
				}
				else {
					Employee.updateOne({_id : newManager._id}, {$set: {
						report : manager.report.concat(req.fields.id)
					}}, function(err, curEmployee) {
						if (err) {
							console.log(err);
							res.send(err);
						}
						else {
							resolve(curEmployee);
						}
					})
				}
			})
		}))
	}
	if (employee.manager._id && employee.manager._id !== JSON.parse(req.fields.manager)._id){
		promises.push(new Promise((resolve, reject) => {
			Employee.findById(employee.manager._id, function(err, manager) {
				if (err) {
					console.log(err);
				}
				else {
					manager.report.splice(manager.report.findIndex(ele => ele === req.fields.id), 1)
					Employee.updateOne({_id : employee.manager._id}, {$set: {
						report : manager.report
					}}, function(err, oldEmployee) {
						if (err) {
							console.log(err);
							res.send(err);
						}
						else {
							resolve(oldEmployee);
						}
					})
				}
			})
		}))
	}
	Promise.all(promises)
	.then(values => { 
		console.log(values);
		let update_info = {
			name                : req.fields.name,
			title               : req.fields.title,
			sex                 : req.fields.sex,
			start_date          : req.fields.start_date,
			office_number       : req.fields.office_number,
			cell_number         : req.fields.cell_number,
			sms                 : req.fields.sms,
			email               : req.fields.email,
			"photo.data"        : fs.readFileSync(req.files.photo.path),
			"photo.contentType" : 'image/png',
			manager             : {
				_id  : newManager._id,
				name : newManager.name
			}
		};
		Employee.updateOne({_id : req.fields.id}, {$set: update_info }, function(err, Updated) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			else {
				console.log(Updated);
				res.send("Updated");
			}
		})
		
	})
	  .catch(error => { 
		console.log(error);
		res.send(error);
	 });
});


app.listen(8888, () => {
	console.log('Express App started');
});