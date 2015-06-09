

module.exports = function(Seat) {

  Seat.attendanceFraction = function(classId, dayOfWeekFilterObject, cb){
    var cb2 = function(err, seatList, resultmsg){
      if(err) cb(err)
      else{
        if(seatList){
          incount = 0
          for(var i =0 ; i < seatList.length; i++){
            if(seatList[i].checked_in){
              incount = incount + 1
            }
          }
          cb(null, incount, seatList.length)
        }

      }

    }
    Seat.getSeatList(classId, dayOfWeekFilterObject, cb2)
  }

  Seat.remoteMethod('attendanceFraction',{
    accepts: [{arg: 'classId', type: 'string'}, {arg: 'dayOfWeekFilterObject', type: 'object'}],
    returns: [{arg: 'tally', type: 'number'}, {arg: 'classSize', type: 'number'}],
    http: {path: '/attendancefraction', verb: 'get'}
  });





  Seat.getSeatList = function(classId, dayOfWeekFilterObject, cb){


    filterSeatsforTimeblocks = function(seats){
      tempseats = []
      for(var i = 0; i < seats.length; i++){
        seat = seats[i]
        timeblocks = seat.timeblocks()
        if(timeblocks.length > 0){
          for(j =0; j < timeblocks.length ; j++){
            timeblock = timeblocks[j]

            if(timeblock.end_date > today && timeblock.start_date < today){
                tempseats.push(seat)
                break;
            }
          }
        }else{
          tempseats.push(seat)
        }
      }
      return tempseats

    }

      today = new Date();

      Seat.app.models.class.findById(classId, function(err, classObj){
          if (!classObj) {
            console.log("Invalid class request " + classId);
            cb(null);
          } else {
            Seat.find({where: {and:[{classId:classId},dayOfWeekFilterObject]}, include: [{relation:"student"},{relation:"timeblocks"}]}, function(err, seats){
              tempseats = []
              for(var i = 0; i < seats.length; i++){
                seat = seats[i]
                timeblocks = seat.timeblocks()
                if(timeblocks.length > 0){
                  for(j =0; j < timeblocks.length ; j++){
                    timeblock = timeblocks[j]

                    if(timeblock.end_date > today && timeblock.start_date < today){
                        tempseats.push(seat)
                        break;
                    }
                  }
                }else{
                  tempseats.push(seat)
                }
              }
              seats=tempseats

                if (classObj.class_type !== "pickup") {
                    cb(null, seats, "success");
                } else {
                    var idList = seats.map(function(seat){return seat.studentId});
                    Seat.find({
                        where: {
                            and: [{studentId:{inq:idList}}, dayOfWeekFilterObject]
                        },
                        include: ['student', 'class','timeblocks']
                    }, function(err, seats){


                        seats = filterSeatsforTimeblocks(seats)

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
          }

      });
  }


  Seat.remoteMethod('getSeatList',{
    accepts: [{arg: 'classId', type: 'string'}, {arg: 'dayOfWeekFilterObject', type: 'object'}],
    returns: [{arg: 'afterList', type: 'array'}, {arg: 'result', type: 'string'}],
    http: {path: '/getseatlist', verb: 'get'}
  });

  Seat.checkIn = function(seatId, cb) {
    Seat.findById(seatId, function(err, seat) {


      Seat.find({where:{studentId:seat.studentId}}, function(err, seats) {
        for (var i = 0; i < seats.length; i++) {
          seats[i].checked_in = false;
          seats[i].save();
        }
        seat.checked_in = true;
        seat.save();
      });
      Seat.app.io.sockets.emit('update', seat.classId);
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
      Seat.app.io.sockets.emit('update', seat.classId);
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
      if (ctx.req.accessToken) {
        var data = {
          date : new Date(),
          event : ctx.req.path,
          studentId: seat.studentId,
          teacherId: ctx.req.accessToken.userId, // This line kept crashing the server. I added the if statment around this code as a band-aid to stop the crashes.
          classId: seat.classId
        };

        var log = Seat.app.models.Log.create(data, function(err, logObj){
        });
      } else {
        console.log("log creation error");
      }


      next();
    });


  };


  Seat.afterRemote("checkIn", logHook);
  Seat.afterRemote("checkOut", logHook);

};
