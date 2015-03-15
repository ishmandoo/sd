module.exports = function(Log) {

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
