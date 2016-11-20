'use strict';


exports.controlErrors = function (err, res, ret){
    if (err) {
        console.log(err);
        res.status(404).send(err);
    } 
	else res.json(ret);
}

exports.studentFound = function (student, req, res){
	var bool = false,
	ret;
	
	if (req.params.idstd != null) ret = req.params.idstd;
	else ret = req.params.id;
	
	if(!student)
		res.end("The student with id: " + ret + " is not registrated");
	else {
		if(student.active == 0)
			res.end("The student with id: " + ret + " is not activated");
		else bool = true;
	}
	return bool;
}