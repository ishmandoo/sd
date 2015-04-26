module.exports = function enableAuthentication(server) {
  // enable authentication
  if(process.env.APP_TYPE != 'demo'){
    server.enableAuth();
  }
  else{
    console.log("WARNING: Authorization disabled. YOU SHOULD BE FREAKING OUT.")
  }
};
