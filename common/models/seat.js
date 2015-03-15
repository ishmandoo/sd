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

    //  Seat.app.models.student.findById(seat.studentId, function(err, student) {
    //    console.log(student);
    //    student.seats({where: {checked_in:true}}, function(err, seats){
    //      console.log(seats);
    //    });
    //  });


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

};
