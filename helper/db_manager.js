
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
            if(err) status = 404;
            var sql = "INSERT INTO user(usr, passwd) VALUES (?,?)";

            con.query(sql,[user,pass] ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "DELETE from user WHERE iduser = ?";

            con.query(sql,userID ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "SELECT iduser from user WHERE usr = ? AND passwd = ?";

            con.query(sql,[usr,pass] ,function (err, result) 
            {
                if(err) status = 404;
                if (result[0]) callback(status,result[0].iduser,usr);
                else callback(404,null,null)
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
            if(err) status = 404;
            var sql = "INSERT INTO location(lat,lng,user_iduser) VALUES (?,?,?)";
            con.query(sql,[lat,lng, iduser] ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "SELECT idlocation FROM location WHERE user_iduser = ? ORDER BY idlocation DESC LIMIT 1";

            con.query(sql,iduser ,function (err, result) 
            {
                if(err) status = 404;
                if(result != null && result[0]!=null) callback(status,result[0].idlocation);
                else callback(status,null);
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
            if(err) status = 404;
            var sql = "INSERT INTO crimeRating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "INSERT INTO educationRating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "INSERT INTO healthRating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "INSERT INTO mobilityRating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "INSERT INTO restaurantRating(value, unlocked, location_user_iduser, location_idlocation) VALUES (?,0,?,?)";

            con.query(sql,[value,user,idLocation] ,function (err, result) 
            {
                if(err) status = 404;
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
            if(err) status = 404;
            var sql = "SELECT restaurantRating.location_idlocation as routeid,restaurantRating.value as restaurantRating, restaurantRating.unlocked as restaurantunlocked, healthRating.value as healthRating, healthRating.unlocked as healthunlocked, crimeRating.value as crimeRating, crimeRating.unlocked as crimeunlocked, educationRating.value as educationRating, educationRating.unlocked as educationunlocked, mobilityRating.value as mobilityRating, mobilityRating.unlocked as mobilityunlocked FROM (((restaurantRating INNER JOIN healthRating ON restaurantRating.location_idlocation = healthRating.location_idlocation) INNER JOIN crimeRating ON restaurantRating.location_idlocation = crimeRating.location_idlocation) INNER JOIN educationRating ON restaurantRating.location_idlocation = educationRating.location_idlocation) INNER JOIN mobilityRating ON restaurantRating.location_idlocation = mobilityRating.location_idlocation WHERE restaurantRating.location_user_iduser = ?;";

            con.query(sql,iduser ,function (err, result) 
            {
                if(err) status = 404;
                if (result!=null && result[0]) callback(status,result);
                else callback(404,null);
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
            if(err) status = 404;
            var sql = "UPDATE "+category+" SET unlocked=1 WHERE location_idlocation = ? AND location_user_iduser = ?;";

            con.query(sql,[route,iduser] ,function (err, result) 
            {
                if(err) status = 404;
                callback(status);
            });
            con.end();
            
        });
    }
};