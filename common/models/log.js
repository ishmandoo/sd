module.exports = function(Log) {


  Log.billableStudents = function(date,cb){
    date = new Date(date)
    date.setDate(0)
    date.setHours(0,0,0)
    beginMonth = new Date(date)
    date.setMonth(date.getMonth()+1)
    endMonth = new Date(date)

    Log.find(
      {where:
        {and:[
          {date:{gt:beginMonth}},
          {date:{lt:endMonth}}
         ]},
        order: 'studentId DESC'}, function(err,logs){
          if(err) cb(err)
          else{
            if(logs){
              if(logs.length > 0){
              count = 1

              for(var i = 1; i < logs.length; i++){
                if(logs[i-1].studentId.toString() != logs[i].studentId.toString()){
                  count = count + 1
                }
              }
                cb(null,count)

              }else{
                cb(null,0)
              }
            }else{
              cb(null,0)
            }
          }
     })
  }

  Log.remoteMethod('billableStudents',{
    accepts: {arg: 'date', type: 'date'},
    returns: {arg: 'billableStudents', type: 'number'},
    http: {path: '/billablestudents', verb: 'get'}
  });





  Log.observe('before save', function(ctx, next) {

    ctx.instance.eventName = getEventName(ctx.instance.event);

    ctx.instance.student(function(err, student) {
      ctx.instance.studentName = student.name;
      ctx.instance.class(function(err, classObj) {
        ctx.instance.className = classObj.name;
        ctx.instance.teacher(function(err, teacher) {
          if (teacher) {
            ctx.instance.teacherName = teacher.name;
            next();
          } else {
            ctx.instance.teacherName = "Admin";
            next();
          }
        });
      });
    });
  });



  var getEventName = function(path) {
    if (path == '/checkin') {
      return 'Check In';
    } else if (path == "/checkout") {
      return 'Check Out';
    } else {
      return 'Unknown Event';
    }
  }
};
