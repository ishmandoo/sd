module.exports = function(Student) {

  Student.checkIn = function(studentId, classId, cb) {
    Student.findById(studentId, function(err, student) {
      Student.app.models.Class.findById(classId, function(err, classObj){
        if (classObj.class_type == "pickup"){
          student.status = "checked in after";
        } else {
          student.status = "checked in " + classObj.class_type;
        }
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

  Student.checkOut = function(studentId, classId, cb) {
    Student.findById(studentId, function(err, student) {
      student.status = "checked out";
      student.save();
      cb(null, "success");
    });
  }

  Student.remoteMethod('checkOut',{
    accepts: [{arg: 'studentId', type: 'string'},
              {arg: 'classId', type: 'string'}],
    returns: {arg: 'result', type: 'string'},
    http: {path: '/checkout', verb: 'post'}
  });


  Student.setPin = function(studentId, pin, cb) {
    Student.findById(studentId, function(err, student) {
      if (err) cb(err);
      student.pin = pin;
      student.save();
      cb(null, "success");
    });
  }

  Student.remoteMethod('setPin',{
    accepts: [{arg: 'studentId', type: 'string'},{arg: 'pin', type: 'string'}],
    returns: {arg: 'result', type: 'string'},
    http: {path: '/setpin', verb: 'post'}
  });


  var logHook = function( ctx, modelInstance, next) {
    console.log("test");

    var data = {
      date : new Date(),
      event : ctx.req.path,
      studentId: ctx.req.body.studentId,
      teacherId: ctx.req.accessToken.userId,
      classId: ctx.req.body.classId
    };

    var log = Student.app.models.Log.create(data, function(err, logObj){
    });


    next();
  };

  Student.observe('before delete', function(ctx, next) {
    console.log('deleting student');

/*
    Student.app.models.Class.find(function(err, classes){
      for (var i in classes) {
        classes[i].students.destroy(ctx.where.id, function(err){
          console.log(err);
          next();
        });
      }
    });
    */

    Student.app.models.Seat.find({where:{studentId:ctx.where.id}}, function(err, seats){
      for (var i in seats) {
        seats[i].destroy();
      }
      next();
    });
  });


  Student.afterRemote("checkIn", logHook);
  Student.afterRemote("checkOut", logHook);

};
