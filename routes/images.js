const url = config.mongoURI;
const connect = mongoose.createConenction(url, {
    useNewUrlParser : true, 
    useUnifiedTopology : true
    });

let gfs;

connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket (connect.db, {
        bucketName : "uploads"
    });
});