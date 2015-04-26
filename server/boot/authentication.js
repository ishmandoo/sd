module.exports = function enableAuthentication(server) {
  // enable authentication
  console.log(process.env.PATH)
  if(process.env.APP_TYPE != 'demo'){
  server.enableAuth();
  }
  else{
    console.log("WARNING: Authorization disbabled. YOU SHOULD BE FREAKING OUT.")
  }
};
