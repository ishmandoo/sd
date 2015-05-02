//USAGE
//mongo database_clear.js --eval "env = '$NODE_ENV'; mongouri='$MONOGOLAB_URI'"

var MongoClient = require('mongodb').MongoClient

if(process.env.NODE_ENV=="production"){
  url = process.env.MONGOLAB_URI
}
else{

  url ='mongodb://localhost:27017/beansprouts_db'
}

if(process.env.APP_TYPE == 'demo' ){

MongoClient.connect(url, function(err, db) {
  //assert.equal(null, err);
    console.log("Connected correctly to server");

    db.student = db.collection('student');
    db.class = db.collection('class');
    db.teacher = db.collection('teacher');
    db.seat = db.collection('seat');

    db.student.drop()
    db.class.drop()
    db.teacher.drop()
    mydate = new Date()
    students = [
      {"name" : "Ambo", "status" : "checked out" , "last_action_date":mydate},
      {"name" : "Billy", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Cranston", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Dervin", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Emery", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Flaxon", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Girvish", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Harnold", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Ifken", "status" : "checked out", "last_action_date":mydate},
      {"name" : "Zuber", "status" : "checked out", "last_action_date":mydate},
    ]

    teachers = [
      { "pin" : "4567", "username" : "phil", "password" : "$2a$10$G8W03zWNR8eSRtu6XNJWheC7w1U//06hR3Wx7gwZ8Ee6/e6dNkp2O", "email" : "phil@phil.com", "name" : "Philip Zucker" },
    { "pin" : "4567", "username" : "ben", "password" : "$2a$10$ryaL05WHqMiCgpJ9r37lWOHvm9W55XnnAKP5wFd1qDB.KFzNAPwTi", "email" : "ben@ben.com", "name" : "Ben Wiener" },
    ]

    classes = [
      {"name" : "Billy's Class", "class_type" : "pre" },
      {"name" : "Zane's Class", "class_type" : "pre" },
      { "name" : "Pickup PS103", "class_type" : "pickup" },
      {"name" : "Fred's Class", "class_type" : "after" },
      {"name" : "Jennifer's Class", "class_type" : "after" },
    { "name" : "Jill's Class", "class_type" : "after" },

    ]



    db.class.insert(classes, function(err, classresult){
      db.teacher.insert(teachers, function(err, teacherresult){
        db.student.insert(students, function(err,studentresult){
          classes = classresult.ops;
          students = studentresult.ops;

          days_of_week = { "monday" : true, "tuesday" : true, "wednesday" : true, "thursday" : true, "friday" : true, "saturday" : true, "sunday" : true }
          db.seat.drop()
          seats = []

          for(var i =0; i < students.length ; i++){
            for(var j =0; j < classes.length - 2 ; j++){
              seats.push({ "classId" : classes[j]._id, "studentId" : students[i]._id , "days_of_week" : days_of_week, "checked_in" : false })
            }
          }

          db.seat.insert(seats, function(err, seats){
            console.log('database reset by database_clear.js');
            db.close();
          });

        });
      });
    });
});

}
