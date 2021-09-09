const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/formDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true,
}).then(()=>{
    console.log(`Connected to DB successfully`)
}).catch(()=>{
    console.log('did not connect')
});
