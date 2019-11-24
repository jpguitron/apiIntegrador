const express = require("express");
const https = require('https');
var path = require('path');
var cors = require('cors');

const app = express();
app.use(cors())

app.use(express.urlencoded());
var db = require('./helper/db_manager.js');

app.post('/register', function (req, res) 
{
    var usr = req.body.user;
    var pwd = req.body.password;
    if(usr==null||pwd==null) res.send({"status":"Not enough parameters"});
    else
    {
        db.insertUser(usr,pwd,function(data)
        {
            res.send({"status":data})
        });
    }


});
app.post('/deleteUser', function (req, res) 
{
    var iduser = req.body.idUser;
    if(iduser==null) res.send({"status":"Not enough parameters"});
    else
    {
        db.deleteUser(iduser,function(data)
        {
            res.send({"status":data})
        });
    }


});

app.post('/login', function (req, res) 
{
    var usr = req.body.user;
    var pwd = req.body.password;
    if(usr==null||pwd==null) res.send({"status":"Not enough parameters"});
    else
    {
        db.login(usr,pwd,function(status,idUser,user)
        {
            res.send({"status":status,"user":user,"idUser":idUser});
        });
    }


});

app.post('/userData', function (req, res) 
{
    var iduser = req.body.idUser;
    if(iduser==null) res.send({"status":"Not enough parameters"});
    else
    {
        db.getUserData(iduser,function(status,result)
        {
    
            if (!status || result == null) res.send({"status":status});
            else
            {
                var respon = [];
                for(var i =0; i<result.length; i++)
                {
                    if (result[i].restaurantunlocked == 0)
                    {
                        result[i].restaurantrating = "false";
                    }
                    if(result[i].healthunlocked == 0)
                    {
                        result[i].healthrating = "false";
                    }
                    if (result[i].crimeunlocked == 0)
                    {
                        result[i].crimerating = "false";
                    }
                    if(result[i].educationunlocked == 0)
                    {
                        result[i].educationrating = "false";
                    }
                    if(result[i].mobilityunlocked ==0)
                    {
                        result[i].mobilityrating = "false";
                    }
                    respon.push({"routeId":result[i].routeid,"restaurantRating":result[i].restaurantRating,"healthRating":result[i].healthRating,"crimeRating":result[i].crimeRating,"educationRating":result[i].educationRating,"mobilityRating":result[i].mobilityRating});
                }
    
                var response = {"status":status, "ratings":respon};
    
                res.send(response);
            }
        });
    }

});

app.post('/updateCategory', function (req, res) 
{
    var iduser = req.body.idUser;
    var category = req.body.category;
    var route = req.body.routeId;
    if(iduser==null||category==null||route==null) res.send({"status":"Not enough parameters"});
    else
    {
        var categories = ["restaurantRating","healthRating","crimeRating","educationRating","mobilityRating"];
        if (categories.length < parseInt(category) || parseInt(category) < 0) res.send({"status":0});
        else
        {     
            db.unlockCategory(iduser,route,categories[parseInt(category)],function(status)
            {
                res.send({"status":status});
            });
        }  
    }



});
app.post('/places', function (req, res) 
{
    var lat = req.body.lat;
    var lng = req.body.lng;
    var user = req.body.idUser;
    


    var data = 
    {
        "Inputs": {
                        "input1":
                        [
                            {
                                'lat': lat,   
                                'lng': lng,   
                            }
                        ],
                    },
        "GlobalParameters":{}
    }
    if(lat==null||lng==null||user==null) res.send({"status":"Not enough parameters"});
    else
    {



        var api_key = 'SjIYmOukr6+hXBHejaZ3/EoZCxakyDDguNd1xmK3SM0SgxW6HGf7yFK6e1Ww7YIdwkVVJAml9ulyhQgRZhFlCQ==';
        var options = {
            hostname: 'ussouthcentral.services.azureml.net',
            port: 443,
            path: '/workspaces/5dddfab30cfe438f88a21dadd0d17175/services/d8e0629ea61740099cdebf4cd80e6465/execute?api-version=2.0&format=swagger',
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':('Bearer '+ api_key)
               }
          };

        var req = https.request(options,             
            ress => 
            {
                var body ='';
                ress.on('data',data=>{
                    body += data;
                })
                
                ress.on('end',() =>
                {
                    var locationJson = JSON.parse(body);

                    db.registerLocation(lat,lng,user,function(data)
                    {
                        db.getLastUserInsertion(user,function(status,idlocation)
                        {
                            if (idlocation == null)
                            {
                                res.send({"status":404});
                            }
                            else
                            {
                                db.registerCrime(idlocation, locationJson.Results.output1[0].crimeRating, user);
                                db.registerEducation(idlocation, locationJson.Results.output1[0].crimeRating, user);
                                db.registerHealth(idlocation, locationJson.Results.output1[0].crimeRating, user);
                                db.registerMobility(idlocation, locationJson.Results.output1[0].crimeRating, user);
                                db.registerRestaurant(idlocation, locationJson.Results.output1[0].crimeRating, user);
                                
                                locationJson.Results.output1[0].routeId = idlocation
                                body = locationJson.Results.output1[0];
                                res.send(body)
    
                            }

                        });
                    });

                }
                );
    
            }).on('error',error => console.error(error.message));

        req.on('error', (e) => 
        {
        console.error(e);
        });
        
        req.write(JSON.stringify(data))
        req.end();
    }

});

app.listen(3000, () => 
{
    console.log("El servidor está inicializado en el puerto 3000");
});