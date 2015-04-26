module.exports = function(Teacher) {

  Teacher.current = function(teacherId,cb) {
    Teacher.findById(teacherId, function(err, teacher) {
      cb(null,teacher);
    });
  }

  Teacher.remoteMethod('current',{
    accepts: {
      arg: 'teacherId',
      type: 'string',
      http: function(ctx) {
        return ctx.req.accessToken.userId;
      }
    },

    returns: {arg: 'teacher', type: 'object'},
    http: {path: '/current', verb: 'get'}
  });

  Teacher.addAdmin = function(teacherId){

    var Role = Teacher.app.models.Role;
    var RoleMapping = Teacher.app.models.RoleMapping;

    Role.findOne({name: 'admin'}, function(err, role) {
      if (err) throw err;

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: teacherId
      }, function(err, principal) {
        if(err) throw err;
      });

    });

    return "admin added";
  }

  Teacher.remoteMethod('addAdmin',{
    accepts: {arg: 'teacherId', type: 'string'},
    returns: {arg: 'response', type: 'string'},
    http: {path: '/addadmin', verb: 'post'}
  });

  Teacher.removeAdmin = function(teacherId){

    var Role = Teacher.app.models.Role;
    var RoleMapping = Teacher.app.models.RoleMapping;

    Role.findOne({name: 'admin'}, function(err, role) {
          if (err) throw err;
          role.principals({principalId: teacherId}, function(err, principals){
            principals.forEach(function(principal){
            principal.remove();
          })


          });
        /*
          .destroyAll({
            principalType: RoleMapping.USER,
            principalId: teacherId
          }, function(err, principal) {
            cb(err);
          });
*/
        });

        return "admin removed";

  }

  Teacher.remoteMethod('removeAdmin',{
    accepts: {arg: 'teacherId', type: 'string'},
    returns: {arg: 'response', type: 'string'},
    http: {path: '/removeadmin', verb: 'post'}
  });








};
