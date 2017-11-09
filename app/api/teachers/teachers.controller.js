'use strict';
/* jshint node: true */

var Teachers = require('./teachers.model.js'),
	async = require('async'),
	_ = require('lodash'),
	functions = require('./teachers.functions.js'), 
	functions2 = require('../courses/courses.functions.js'),
	Courses = require('../courses/courses.model.js'),
	mongoose = require('mongoose'),
	LOMS = require('../loms/loms.model.js');

/**
 *	List of requests:
 *
 *	- all: 				Returns all teachers.
 *
 *	- get: 				Returns a teacher by id.
 *
 *	- create: 			Creates a new teacher.
 *
 *	- update: 			Updates a teacher by id.
 *
 *	- login: 			Login a teacher.
 *
 *	- remove: 			Removes a teacher by id.
 *
 *	- destroy: 			Destroys all teachers.						
 */


/**
 * Returns all teachers
 */
exports.all = function (req, res) {
	Teachers.find({}, function (err, teacher) {
		functions.controlErrors(err, res, teacher);
	});
};


/**
 * Returns a teacher by id
 */
exports.get = function (req, res) {
	var finder;
	if(mongoose.Types.ObjectId.isValid(req.params.id)){
		finder = {_id: req.params.id};
	} else {
		finder = {'identification.email': req.params.id};
	}

	Teachers.findOne(finder, function(err, teacher) {
		if(err){
			console.log(err);
			res.status(err.code).send(err);
		}else if(!teacher){
			res.status(404).send('The teacher with id o email: ' + req.params.id + ' is not registrated');
		} else {
			res.json(teacher);
		}
	});
};


/**
 * Creates a new teacher
 */
exports.create = function(req, res) {
	var bool = false;
	if (req.body.identification.name && req.body.identification.email && req.body.identification.password){
		Teachers.findOne({'identification.name': req.body.identification.name}, function(err, teacher) {
			if(err){
				console.log(err);
	        	res.status(err.code).send(err);
			} else if(!teacher){
			    Teachers.findOne({'identification.email': req.body.identification.email}, function(err, teacher) {
					if(err){
						console.log(err);
			        	res.status(err.code).send(err);
					} else if(!teacher){
					    Teachers.create(req.body, function (err, teacher) {
					        if (err){
					        	console.log(err);
					        	res.status(err.code).send(err);
					        } else {
					        	console.log('teacher created!');
								res.json(teacher);
					        }
					    });
					} else {
							res.status(403).send('Ya existe un profesor con este email');
					}
				});
			} else {
				res.status(403).send('Ya existe un profesor con este nombre');
			}
		});
	} else {
		if(!req.body.identification.name && !req.body.identification.email && !req.body.identification.password)
			res.status(400).send('Todos los campos son requerido');
		else if(!req.body.identification.name && req.body.identification.email && req.body.identification.password)
			res.status(400).send('El campo nombre del profesor es requerido');
		else if(req.body.identification.name && !req.body.identification.email && req.body.identification.password) 
			res.status(400).send('El campo email del profesor es requerido');
		else if(req.body.identification.name && req.body.identification.email && !req.body.identification.password) 
			res.status(400).send('El campo password del profesor es requerido');
		else if(!req.body.identification.name && !req.body.identification.email && req.body.identification.password) 
			res.status(400).send('El nombre y email del profesor son requeridos');
		else if(req.body.identification.name && !req.body.identification.email && !req.body.identification.password) 
			res.status(400).send('El email y password del profesor son requeridos');
		else if(!req.body.identification.name && req.body.identification.email && !req.body.identification.password) 
			res.status(400).send('El name y password del profesor son requeridos');
	}
};


/**
 *  Updates a teacher by id
 */
exports.update = function(req, res) {
	async.waterfall([
	    Teachers.findById.bind(Teachers, req.params.id),
	    function(teacher, next) {
    		// Email is unique.
			if(req.body.identification.email){
				Teachers.findOne({'identification.email': req.body.identification.email}, function(err, teacher2) {
					if(err){
						console.log(err);
			        	res.status(err.code).send(err);
					} else if(!teacher2){
						res.status(200);
					} else {
						if(teacher._id.equals(teacher2._id)){
							res.status(200);
						} else {
							res.status(400).send('A teacher with the same email already exists');
						}
					}
	
					if(res.statusCode === 200) {
						var newteacher = functions.doUpdate(teacher,req.body);
         				teacher = _.extend(teacher, newteacher);
						teacher.save(next);						
					}
				});
			} else {
				res.status(200);
				var newteacher = functions.doUpdate(teacher,req.body);
     			teacher = _.extend(teacher, newteacher);
				teacher.save(next);	
			}
	    }
	], function(err, teacher) {
	    functions.controlErrors(err, res, teacher);
	});		
};

exports.login = function(req, res) {
	Teachers.findOne({'identification.name': req.params.name}, function(err, teacher) {
    	if(err){
    		console.log(err);
			res.status(err.code).send(err);
    	}else if(!teacher){
			res.status(400).send('Incorrect username or password');
		} else {
			if(req.params.pass === teacher.identification.password){
	    		res.json(teacher);
	    	} else {
	    		res.status(400).send('Incorrect username or password');
	    	}
    	}
    });
};


/**
 * Removes a teacher by id
 */
exports.remove = function (req, res) {
	var resp;
	async.waterfall([
	    Teachers.findById.bind(Teachers, req.params.id),
	    function(teacher, next) {
			if(!teacher){
				res.status(404).send('The teacher with id: ' + req.params.id + ' is not registrated');
			} else{
			    Teachers.remove({_id: teacher._id}, function (err, response) {
			    	resp = response;
			        teacher.save(next);
			    });
			}
	    }
	], function(err) {
		functions.controlErrors(err, res, resp);
	});
};


/**
 * Destroys all teachers
 */
exports.destroy  = function(req, res){
	Teachers.remove({}, function (err, resp) {
		functions.controlErrors(err, res, resp);
	});
};




