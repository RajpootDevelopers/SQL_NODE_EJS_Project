// const { faker } = require("@faker-js/faker");
const express = require("express")
const app = express();
const mysql = require("mysql2");
const port = 8081;
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.set("veiw engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended : true }));
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "instagram",
    password: "Rajpoot@1998"
})
// Home Pg
app.get("/", (req,res)=>{
    try{
        let q = "select count(*) from random"
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let users = result[0]["count(*)"];
            console.log(result[0]["count(*)"]);
            // connection.end()
            // res.send(result[0]["count(*)"])
            // res.send("welcome")
            res.render("home.ejs", { users })
        })
    }catch(error){
        console.log("Something is Wrong", error)
        res.send("Something wrong")
    }
})

// Show Users
app.get("/users", (req,res)=>{
    let q = "select * from random"
    try{
        connection.query(q, (err, users)=>{
            if(err) throw err;
            // console.table(users)
            res.render("users.ejs", { users })
        })
    }catch(error){
        console.log("Something is Wrong", error)
        res.send("Something wrong")
    }
})

// edit route
app.get("/users/:id/edit", (req,res)=>{
    let { id } = req.params;
    let q = `select * from random where id = "${id}"`
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user })
            // console.log(user)
        })
    }catch(error){
        console.log("Something is Wrong", error)
        res.send("Something wrong")
    }
});


// Update User Name :
// Update User Name:
app.patch("/users/:id", (req,res)=>{ // Corrected route definition
    let { id } = req.params;
    let { password: formPassword, username: newUsername } = req.body;
    let q = `SELECT * FROM random WHERE id = "${id}"`;

    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            let user = result[0];
            // console.log(user);
            if(formPassword !== user.password){ // Use strict comparison here
                res.send("Wrong Password!");
            } else {
                let q2 = `UPDATE random SET username = "${newUsername}" WHERE id = "${id}"`;
                connection.query(q2, (err, result)=>{
                    if(err) throw err;
                    res.redirect("/users");
                });
            }
        });
    } catch(error){
        console.log("Something is Wrong", error);
        res.send("Something wrong");
    }
});



// Create Post : 
app.get("/users/new", (req, res)=>{
    res.render("new.ejs")
})

app.post("/users", (req, res)=>{
    let { id, username, email, avatar, password, birthdate, regiteredAt} = req.body;
    console.log(req.body);
    let q = `insert into random ( id, username, email, avatar, password, birthdate, registeredAt) values (?,?,?,?,?,?,?)`
    let newUser = [ id, username, email, avatar, password, birthdate, regiteredAt]

    try{
        connection.query(q, newUser, (err, result, fields)=>{
            if (err) throw err;
            console.log(result)
            // res.send(result)
            res.redirect("/posts")

        })
    }catch(error){
        console.log("Something Wrong", error)
    }
})

// Deletion Form :
app.get("/users/:id/delete", (req, res)=>{
    let { id } = req.params;
    let q = `select * from random where id = "${id}" `
    try{
        connection.query(q, (err, result, fields)=>{
            let user = result[0];
            res.render("delete.ejs", { user })
        })
    }catch(error){
        console.log("Something Wron", error)
    }
})
// Post Deletion :
app.delete("/users/:id", (req, res)=>{
    let { id } = req.params;
    let { password : yourPassword} = req.body;
    let q = `select * from random where id = "${id}" `
    try{
        connection.query(q, (err, result, fields)=>{
            if(err) throw err;
            let user = result[0];
            if(yourPassword !== user.password){
                res.send("Wrong Passsword!")
            }else{
                let q2 = `delete from random where password = "${yourPassword}"`
                connection.query(q2, (err, result)=>{
                    if (err) throw err;
                    console.log(result)
                    console.log("Deleted")
                    res.redirect("/users")

                })
            }
        })
    }catch(error){
        console.log("Something Wron", error)
        res.send("Wrong Password")
    }

})
app.listen(port, ()=>{
    console.log(`server is listening on ${port}`);
})































// let randoms = [];
// let randomUser = () => {
//     return [
//         faker.string.uuid(),
//         faker.internet.userName(),
//         faker.internet.email(),
//         faker.image.avatar(),
//         faker.internet.password(),
//         faker.date.birthdate(),
//         faker.date.past()]
// }
// for (let i = 1; i <= 100; i++) {
//     randoms.push(randomUser());
// }
// let q = "insert into random (id, username, email, avatar, password, birthdate, registeredAt) values (?,?,?,?,?,?,?)"
// let user = ["123", "hello123", "hel@gmail.com", "adfasd", "sdfasdf", "21312", "34342-2024"]
// let q = "insert into random (id, username, email, avatar, password, birthdate, registeredAt) values ?"
// let user = [["1231", "hello1231", "hel@gmail.com1", "adfasd1", "sdfasdf1", "213121", "34342-20241"],["1232", "hello1223", "hel@gmail.c2om", "adf2asd", "sdfa2sdf", "213212", "343422-2024"]]

// try {
//     connection.query(q, [randoms], (err, result, fields) => {
//         if (err) throw err;
//         console.log(result)
//     connection.end();
//     })
// } catch (error) {
//     console.log("Somthing Wrong", error)
// }



// let randomUser = ()=>{
//     return{
//         userId : faker.string.uuid(),
//         username : faker.internet.userName(),
//         email : faker.internet.email(),
//         avatar : faker.image.avatar(),
//         password : faker.internet.password(),
//         birthdate : faker.date.birthdate(),
//         registeredAt : faker.date.past()
//     }
// }

