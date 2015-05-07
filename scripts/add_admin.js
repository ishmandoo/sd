var MongoClient = require('mongodb').MongoClient

var program = require('commander');

program
  .version('0.0.1')
  .option('-u, --user <user>', 'give user admin privileges')
  .option('-P, --pineapple', 'Add pineapple')
  .parse(process.argv);

if(process.env.NODE_ENV=="production"){
    url = process.env.MONGOLAB_URI
}
else{

    url ='mongodb://localhost:27017/beansprouts_db'
}

if (program.user) {



  MongoClient.connect(url, function(err, db) {
    //assert.equal(null, err);
      console.log("Connected correctly to server");

      db.roleMapping = db.collection('RoleMapping');
      db.teacher = db.collection('teacher');
      db.teacherRoleMapping = db.collection('teacherRoleMapping');
      db.teacher.findOne({username: program.user}, function(err,teacher){
        if(err) throw err;
        console.log(teacher)
        if(teacher){
          db.roleMapping.insert({principalType: "USER", principalId: teacher._id.toString(), "roleId" : 1 }, function(err,rolemappingresponse){
            if(err) throw err;
            //console.log(rolemapping)
            rolemapping = rolemappingresponse.ops[0]
            db.teacherRoleMapping.insert({"teacherId" :  teacher._id, "roleMappingId" : rolemapping._id }, function(err, whatevs){
              console.log(program.user + " given admin privileges");
              db.close()
            });
          });
        }
        else{
          console.log("No such teacher: " + program.user);
          db.close()
        }

      });
  })

}
else{
  console.log("Hey! Gimme a user with -u! You dick.")
}
