var MongoClient = require('mongodb').MongoClient

if(process.env.NODE_ENV=="production"){
  url = process.env.MONGOLAB_URI
}
else{

  url ='mongodb://localhost:27017/beansprouts_db'
}



MongoClient.connect(url, function(err, db) {
  //assert.equal(null, err);
    console.log("Connected correctly to server");

    db.student = db.collection('student');
    db.class = db.collection('class');
    db.teacher = db.collection('teacher');
    db.seat = db.collection('seat');



    teachers = [
    { "pin" : "4567", "username" : "admin", "password" : "$2a$10$kxXLCclqVlQjbmRZafhX0u0pCky/2gioReRH3dfHdgVVfkM/xLSXq", "name" : "admin" }
  ]




        db.teacher.insert(teachers, function(err, teacherresult){
          console.log("User:admin added")
          db.close()
            });


});
