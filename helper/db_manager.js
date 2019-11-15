
var mysql = require('mysql');

function createConnection()
{
    var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "toor",
        database:"ProyectoIntegradorAPI"
    });
    return con
}

module.exports = 
{

    //To register a user
    insertUser: function (user,pass,callback) 
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "INSERT INTO user(usr, passwd) VALUES (?,?)";

            con.query(sql,[user,pass] ,function (err, result) 
            {
                var status = 404;
                callback(status);
            });
            con.end();
            
        });
        
    },
    //To delete a user
    deleteUser: function (userID,callback) 
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "DELETE from user WHERE iduser = ?";

            con.query(sql,userID ,function (err, result) 
            {
                var status = 404;
                callback(status);
            });
            con.end();
            
        });
    },

    //to access the system
    login: function(usr,pass,callback)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "SELECT iduser from user WHERE usr = ? AND passwd = ?";

            con.query(sql,[usr,pass] ,function (err, result) 
            {
                var status = 404;
                if (result[0]) callback(status,result[0].iduser,usr);
                else callback(0,null,null)
            });
            con.end();
        });
    },


    //To register locations and ratings in db
    registerLocation: function(lat,lng,iduser,callback)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "INSERT INTO location(lat,lng,user_iduser) VALUES (?,?,?)";
            con.query(sql,[lat,lng, iduser] ,function (err, result) 
            {
                var status = 404;
                callback(status);
            });
            con.end();
        });
    },
    getLastUserInsertion: function(iduser, callback)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "SELECT idlocation FROM location WHERE user_iduser = ? ORDER BY idlocation DESC LIMIT 1";

            con.query(sql,iduser ,function (err, result) 
            {
                var status = 404;
                callback(status,result[0].idlocation);
            });
            con.end();
        });
    },

    registerCrime: function(idLocation, value, user)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "INSERT INTO crimerating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                var status = 404;
            });
            con.end();
            
        });
    },
    registerEducation: function(idLocation, value, user)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "INSERT INTO educationrating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                var status = 404;
            });
            con.end();
            
        });
    },
    registerHealth: function(idLocation, value, user)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "INSERT INTO healthrating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                var status = 404;
            });
            con.end();
            
        });
    },
    registerMobility: function(idLocation, value, user)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "INSERT INTO mobilityrating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                var status = 404;
            });
            con.end();
            
        });
    },
    registerRestaurant: function(idLocation, value, user)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "INSERT INTO restaurantrating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                var status = 404;
            });
            con.end();
            
        });
    },
    //Get user values
    getUserData: function(iduser,callback)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "SELECT restaurantrating.location_idlocation as routeid,restaurantrating.value as restaurantrating, restaurantrating.unlocked as restaurantunlocked, healthrating.value as healthrating, healthrating.unlocked as healthunlocked, crimerating.value as crimerating, crimerating.unlocked as crimeunlocked, educationrating.value as educationrating, educationrating.unlocked as educationunlocked, mobilityrating.value as mobilityrating, mobilityrating.unlocked as mobilityunlocked FROM (((restaurantrating INNER JOIN healthrating ON restaurantrating.location_idlocation = healthrating.location_idlocation) INNER JOIN crimerating ON restaurantrating.location_idlocation = crimerating.location_idlocation) INNER JOIN educationrating ON restaurantrating.location_idlocation = educationrating.location_idlocation) INNER JOIN mobilityrating ON restaurantrating.location_idlocation = mobilityrating.location_idlocation WHERE restaurantrating.location_user_iduser = ?;";

            con.query(sql,iduser ,function (err, result) 
            {
                var status = 404;
                if (result[0]) callback(status,result);
                else callback(0,null);
            });
            con.end();
            
        });
    },
    //Unlock category value
    unlockCategory: function(iduser,route,category,callback)
    {
        var status = 200;
        var con = createConnection();
        con.connect(function(err) 
        {
            var status = 404;
            var sql = "UPDATE "+category+" SET unlocked=1 WHERE location_idlocation = ? AND location_user_iduser = ?;";

            con.query(sql,[route,iduser] ,function (err, result) 
            {
                var status = 404;
                callback(status);
            });
            con.end();
            
        });
    }
};