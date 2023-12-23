const {faker} = require('@faker-js/faker'); //requiring fakerjs in it

//requiring the mysql2 package
const mysql = require('mysql2');

// let  createRandomUser = () =>  {
//     return {
//         userId: faker.datatype.uuid(),
//         username : faker.internet.userName(),
//         email : faker.internet.email(),
//         // avatar : faker.image.avatar(),
//         password : faker.internet.password(),
//         // birthdate : faker.date.birthdate(),
//         // registeredAt : faker.date.past(),
//     };
// }



// create the connection to database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta",
    password : "Rohit@3333",
  });

//below return array rather than object
  let  getRandomUser = () =>  {
    return [
        faker.datatype.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}

//Inserting new data
let q = 'INSERT INTO user (id,username,email,password) VALUES ?';
let data = [];
for(let i=1; i<=100; i++)
{
    data.push(getRandomUser());
}
//To use the above builded connection using the method .query() available in connection for changes in DBs
try{
    connection.query(q,[data],(err,result)=>{
        if(err) throw err;
        console.log(result);
    });
} catch(err) {
    console.log(err);
}

connection.end(); //sql connection will be end
//RENAME THE ABOVE DATA AND ONLY GET 4 PARAMETERS LIKE USERID,USERNAME,EMAIL,PASSWORD
//Below return object
/*
let  getRandomUser = () =>  {
        return {
            id : faker.datatype.uuid(),
            userName : faker.internet.userName(),
            email : faker.internet.email(),
            password : faker.internet.password(),
    };
}
*/

// console.log(getRandomUser());