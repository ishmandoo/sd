module.exports = function(Seat) {

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
