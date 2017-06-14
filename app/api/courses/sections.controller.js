'use strict';

var Courses = require('./courses.model.js'),
	Sections = require('./courses.model.js'),
    config = require('../../res/config.js'),
    CoursesFunctions = require('./courses.functions.js'),
    async = require('async'),
    mongoose = require('mongoose'),
    _ = require('lodash');
var controller = require('./courses.controller.js');

/**
 *	List of requests:
 *
 *	- all_sections: 				List all sections from a course.
 *
 * 	- get_section: 					Lists the indicated section from a course.
 *
 * 	- create_section: 				Creates a new section in a course.
 *
 * 	- update_section: 				Updates a section from a course.
 *
 * 	- delete_section: 				Deletes a section from a course.
 *
 * 	- get_sectionObjectives: 		Lists the indicated section objectives from a course.
 */


	
/**
 *	List all sections from a course
 */
exports.all_sections = function (req, res) {	
	var courseId = req.params.course_id;
	if(mongoose.Types.ObjectId.isValid(req.params.course_id)){
		Courses.findOne({_id: courseId}, function(err, course) {
	        if (err) {
				res.sendStatus(err);
			} else if(!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				res.status(200).send(course.sections);
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

/**
 *	Lists the indicated section from a course
 */
exports.get_section = function (req, res) {		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
			if (err){
				res.sendStatus(err);
			} else if (!course) {
					res.status(404).send('The course with id: ' + courseId + ' is not registrated');   
			} else {
				var sections = course.sections;
				var len = sections.length;
				var bool = false;
				for (var i = 0; i < len; i++) {
					var elem = sections[i];
					if (elem.name === sectionId){
						res.status(200).send(elem);
						bool = true;
					}
				}			
				if (!bool){
					res.status(404).send('The section with id : ' + sectionId 
					+ ' has not been found in the course with id: ' + courseId);	
				}
			} 
		});	
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

/**
 *	Creates a new section in a course.
 */
exports.create_section = function(req, res) {	
	var courseId = req.params.id,
		new_sec = req.body,
		sectionId = new_sec.name;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				res.sendStatus(err); 
			} else if (!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var sections = course.sections;
				if (CoursesFunctions.exist_section_lesson(sectionId,sections) !== -1){
					res.status(400).send('Error section already exist');
				} else {
					// if there were no sections before OR
					// the new section does not already exists
					// then we have to insert it in the array			
					// push the new section at the end of the sections array					
					sections.push(new_sec);
					res.status(200).send(sections[sections.length-1]);
					course.save();
				}
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
}

/**
 *	Updates a section from a course.
 */
exports.update_section = function(req, res) {	
	var courseId = req.params.idc,
		new_sec = req.body,
		sectionId = req.params.ids;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function (err, course){
			if (err){
				res.sendStatus(err);
			}else if(!course){
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');
			} else {
				var sections = course.sections;
				var ind = CoursesFunctions.exist_section_lesson(sectionId,sections);
				if (ind < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				 } else {
					course.sections[ind] = CoursesFunctions.doUpdate(course.sections[ind] , new_sec);
					if (res.statusCode !== 200) {
						res.status(400).send('error while updating '+err);
					} else {
						res.status(200).send(sections[sections.length-1]);
					}
					course.save();
				}
			}
		});
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};

		
/**
 *	Deletes a section from a course.
 */
exports.delete_section = function(req,res) {		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;

	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course){
	        if (err){
				res.sendStatus(err);
			} else if (!course) {
				res.status(404).send('The course with id: ' + courseId + ' is not registrated');  
			} else{
				var ind = CoursesFunctions.exist_section_lesson(sectionId,course.sections);
				if (ind < 0){
					res.status(404).send('The section with id : ' + sectionId +
					' has not been found in the course with id: ' + courseId);
				} else {
					course.sections.splice(ind,1);

					if (res.statusCode !== 200) {
						res.status(400).send('error while updating '+err)
					} else { 
						res.status(200).send({ok:1, n: 1});
					}
					course.save();
				}						
			}  
		});	
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated'); 
	}
};



/**
 *	Lists the indicated section objectives from a course.
 */
exports.get_sectionObjectives = function (req, res) {		
	var courseId = req.params.course_id;
	var sectionId = req.params.section_id;
	if(mongoose.Types.ObjectId.isValid(courseId)){
		Courses.findOne({_id: courseId}, function(err, course) {
			if (err){
				res.sendStatus(err);
			} else if (!course) {
					res.status(404).send('The course with id: ' + courseId + ' is not registrated');   
			} else {
				var sections = course.sections;
				var len = sections.length;
				var bool = false;
				for (var i = 0; i < len; i++) {
					var elem = sections[i];
					if (elem.name === sectionId){
						res.status(200).send(elem.objectives);
						bool = true;
					}
				}			
				if (!bool){
					res.status(404).send('The section with id : ' + sectionId 
					+ ' has not been found in the course with id: ' + courseId);	
				}
			} 
		});	
	} else {
		res.status(404).send('The course with id: ' + courseId + ' is not registrated');
	}
};
	
