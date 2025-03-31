import mongoose from "mongoose" ;

import dotenv from 'dotenv';
dotenv.config();

// This dbConnect has the job to establish the connection between the databse and the application 
const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL) // returns a promise
    .then( () => { console.log( "DB's Connection is successful" )})
    .catch( (error) => { 
        console.log( "There is an error" )
        console.error( error.message )
        process.exit(1)
    }) ;
    // we are accessing our .env file from process 
    // to do so we need to install dotenv from npm 
    // and then write " require("dotenv").config() ; " above .
}


export default dbConnect ;
