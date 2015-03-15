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

};
