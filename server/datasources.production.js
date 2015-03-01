module.exports = {
  db: {
    name: "db",
    connector: "memory"
  },
  beansprouts_db: {
    url: process.ENV.MONGOLAB_URI,
    connector: "mongodb"
  }
}
