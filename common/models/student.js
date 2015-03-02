module.exports = function(Student) {

  Student.checkIn = function(studentId, classId, cb) {
    Student.findById(studentId, function(err, student) {
      Student.app.models.Class.findById(classId, function(err, classObj){
        student.status = "checked in " + classObj.class_type;
        student.save();
        cb(null, "success");
      });
    });
  }

  Student.remoteMethod('checkIn',{
    accepts: [{arg: 'studentId', type: 'string'},
              {arg: 'classId', type: 'string'}],
    returns: {arg: 'result', type: 'string'},
    http: {path: '/checkin', verb: 'post'}
  });

  Student.checkOut = function(studentId, cb) {
    Student.findById(studentId, function(err, student) {
      student.status = "checked out";
      student.save();
      cb(null, "success");
    });
  }

  Student.remoteMethod('checkOut',{
    accepts: {arg: 'studentId', type: 'string'},
    returns: {arg: 'result', type: 'string'},
    http: {path: '/checkout', verb: 'post'}
  });


};
