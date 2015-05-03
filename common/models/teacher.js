module.exports = function(Teacher) {

  Teacher.current = function(teacherId,cb) {
    Teacher.findById(teacherId, {include:{relation:"roleMappings"}}, function(err, teacher) {
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

  Teacher.currentIsAdmin = function(teacherId,cb) {
    Teacher.findById(teacherId, {include:"roleMappings"}, function(err, teacher) {
      console.log(teacher.roleMappings())
      var isAdmin = ((teacher.roleMappings().length >= 1) && (teacher.roleMappings()[0].roleId == 1));
      cb(null,isAdmin);
    });
  }

  Teacher.remoteMethod('currentIsAdmin',{
    accepts: {
      arg: 'teacherId',
      type: 'string',
      http: function(ctx) {
        return ctx.req.accessToken.userId;
      }
    },

    returns: {arg: 'isAdmin', type: 'boolean'},
    http: {path: '/currentisadmin', verb: 'get'}
  });

  Teacher.addAdmin = function(teacherId, cb){

    var Role = Teacher.app.models.Role;
    var RoleMapping = Teacher.app.models.RoleMapping;

    Role.findOne({where:{name: 'admin'}}, function(err, role) {
      if (err) cb(err);

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: teacherId
      }, function(err, principal) {
        if(err) throw err;

        Teacher.findById(teacherId, function(err, teacher) {
          teacher.roleMappings.add(principal, function(err){});
          teacher.save();
          console.log(teacher);
        });

      });
    });

    return cb(null,"admin added");
  }

  Teacher.remoteMethod('addAdmin',{
    accepts: {arg: 'teacherId', type: 'string'},
    returns: {arg: 'response', type: 'string'},
    http: {path: '/addadmin', verb: 'post'}
  });

  Teacher.removeAdmin = function(teacherId, cb){

    var Role = Teacher.app.models.Role;
    var RoleMapping = Teacher.app.models.RoleMapping;

    Role.findOne({name: 'admin'}, function(err, role) {
          if (err){
            cb(err);
          }

          RoleMapping.find({where: {principalId: teacherId}}, function(err, principals){
            if (err) {
              cb(null,"There's a problem in removeAdmin hook, buddo");
            }



            Teacher.findById(teacherId, function(err, teacher) {
              principals.forEach(function(principal){
                teacher.roleMappings.remove(principal, function(err){});
                principal.remove();
              });
              teacher.save();
              console.log(teacher);
            });


          });
    });

        cb(null,"admin removed");

  }

  Teacher.remoteMethod('removeAdmin',{
    accepts: {arg: 'teacherId', type: 'string'},
    returns: {arg: 'response', type: 'string'},
    http: {path: '/removeadmin', verb: 'post'}
  });








};
