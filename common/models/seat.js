module.exports = function(Seat) {
/*
  Seat.getSeatList = function(classId, dayOfWeekFilterObject, cb){
    Seat.app.models.class.findById(classId, function(err, classObj){
      if (classObj.class_type === "pickup") { // if we have a pickup location, find the list of students, get seats that have any of them and have the right day of the week, then create a new list from the ones that are after school locations
        Seat.find({where:{classId:classObj.id}}, function(err, seats){
          var idList = seats.map(function(seat){return seat.studentId})
          console.log(idList);
          Seat.find({
            where: {
              and: [{studentId:{inq:idList}}, dayOfWeekFilterObject]
            },
            include: ['student', 'class']
          }, function(err, seats){

            var afterList = [];
            for (var i = 0; i < seats.length; i++) {
              if (seats[i].class().class_type == 'after'){
                afterList.push(seats[i]);
              }
            }
            cb(null, afterList, "success");
          });
        });
      } else {
        Seat.find({where: {and:[{classId:classId},dayOfWeekFilterObject]}, include: {relation:"student"}}, function(err, seats){
          cb(null, seats, "success");
        });
      }
    });
  }
  */


  Seat.getSeatList = function(classId, dayOfWeekFilterObject, cb){
      Seat.app.models.class.findById(classId, function(err, classObj){

          Seat.find({where: {and:[{classId:classId},dayOfWeekFilterObject]}, include: {relation:"student"}}, function(err, seats){
              if (classObj.class_type !== "pickup") {
                  cb(null, seats, "success");
              } else {
                  var idList = seats.map(function(seat){return seat.studentId});
                  Seat.find({
                      where: {
                          and: [{studentId:{inq:idList}}, dayOfWeekFilterObject]
                      },
                      include: ['student', 'class']
                  }, function(err, seats){

                      var afterList = [];
                      for (var i = 0; i < seats.length; i++) {
                          if (seats[i].class().class_type == 'after'){
                              afterList.push(seats[i]);
                          }
                      }
                      cb(null, afterList, "success");
                  });
              }
          });

      });
  }


  Seat.remoteMethod('getSeatList',{
    accepts: [{arg: 'classId', type: 'string'}, {arg: 'dayOfWeekFilterObject', type: 'object'}],
    returns: [{arg: 'afterList', type: 'array'}, {arg: 'result', type: 'string'}],
    http: {path: '/getseatlist', verb: 'get'}
  });

  Seat.checkIn = function(seatId, cb) {
    Seat.findById(seatId, function(err, seat) {

      console.log(seat.studentId)

      Seat.find({where:{studentId:seat.studentId}}, function(err, seats) {
        for (var i = 0; i < seats.length; i++) {
          seats[i].checked_in = false;
          seats[i].save();
        }
        seat.checked_in = true;
        seat.save();
      });


      console.log("checked in");
      cb(null, "success");
    });
  }

  Seat.remoteMethod('checkIn',{
    accepts: {arg: 'seatId', type: 'string'},
    returns: {arg: 'result', type: 'string'},
    http: {path: '/checkin', verb: 'post'}
  });

  Seat.checkOut = function(seatId, cb) {
    Seat.findById(seatId, function(err, seat) {
      seat.checked_in = false;
      seat.save();
      console.log("checked out");
      cb(null, "success");
    });
  }

  Seat.remoteMethod('checkOut',{
    accepts: {arg: 'seatId', type: 'string'},
    returns: {arg: 'result', type: 'string'},
    http: {path: '/checkout', verb: 'post'}
  });

  var logHook = function( ctx, modelInstance, next) {

    Seat.findById(ctx.req.body.seatId, function(err, seat){
      var data = {
        date : new Date(),
        event : ctx.req.path,
        studentId: seat.studentId,
        teacherId: ctx.req.accessToken.userId,
        classId: seat.classId
      };

      var log = Seat.app.models.Log.create(data, function(err, logObj){
      });


      next();
    });


  };


  Seat.afterRemote("checkIn", logHook);
  Seat.afterRemote("checkOut", logHook);

};
