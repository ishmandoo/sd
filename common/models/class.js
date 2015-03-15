module.exports = function(Class) {
  Class.observe('before delete', function(ctx, next) {
    console.log('deleting class');

/*
    Class.app.models.Student.find(function(err, students){
      for (var i in students) {
        students[i].classes.destroy(ctx.where.id, function(err){
          console.log(err);
          next();
        });
      }
    });
*/
    Class.app.models.Seat.find({where:{classId:Class.id}}, function(err, seats){
      for (var i in seats) {
        seats[i].destroy();
      }
      next();
    });
  });

};
