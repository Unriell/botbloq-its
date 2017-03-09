'use strict';

var express = require('express');
var controller = require('./students.controller.js'); 

var router = express.Router();



/////////////////////////////// GETs

// gets a new activity for the enrolled course
router.get('/:idstd/course/:idc', controller.newActivity); 

// gets a list with course information of a student
router.get('/:id/:data', controller.dataCourses);

// gets a student
router.get('/:id', controller.get); 

// gets all students
router.get('/', controller.all);



//////////////////////////// POSTs

// includes learning style in a student
router.post('/:id/init', controller.init); 

// creates a student
router.post('/', controller.create); 


////////////////////////// LOCKs

// deactivates a course in a student
router.lock('/:idstd/course/:idc', controller.unenrollment);

// deactivates a student
router.lock('/:id', controller.deactivate);

 // activates a student
router.unlock('/:id', controller.activate);



/////////////////////////// PUTs

// Updates the status of the lom for a student and a course
router.put('/:idstd/course/:idc/lom/:idl/:status', controller.updateActivity);

// enrollments a student in a course
router.put('/:idstd/course/:idc', controller.enrollment); 

//rules test
router.put('/:id/group', controller.group);

// updates a student
router.put('/:id',  controller.update);




////////////////////////// DELETEs

 //deletes a student
router.delete('/:id',  controller.remove);

// destroys all students
router.delete('/',  controller.destroy);



module.exports = router;
