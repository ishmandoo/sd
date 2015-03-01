module.exports = {
  db: {
    name: "db",
    connector: "memory"
  },
  beansprouts_db: {
    url: process.env.MONGOLAB_URI,
    connector: "mongodb"
  }
}
