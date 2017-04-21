var express = require('express')
var app = express();
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

// Connection URL 
var url = 'mongodb://localhost:27017/fcc_url';

 
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.get('/:url(*)', function (req, res) {


    MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              console.log("Connected correctly to server");
             
              var collection = db.collection('URL_D');
              var validate = Number(req.params.url); 
              
              if(validate){
                // Get original_url
                collection.findOne({
                  "short_url": validate
                }, function(err, result) {

                  if(err)
                     res.send("Database Error!");
                  else
                    { 
                      if(result == null)
                          res.send("The Url Shortcut doesn`t exist!");
                      else
                          res.redirect(result.original_url);
                    }
                })
              }
              else
              {
                
                // Check if there is the URL before inserting
                collection.findOne({
                    "original_url" : req.params.url
                }, function(err, result) {
                     if(err)
                          res.send("Error checking database!");
                     else
                     {
                        if(result == null)
                        {     // Generate Random Number and add Obj to the database
                               var random_number = Math.floor(Math.random() *2000) 
                               urlObj = {
                                "original_url": req.params.url,
                                "short_url": random_number
                               };
                               
                               collection.insert(urlObj ,function(err,result){
                                if(err)
                                  console.log(err);
                                else
                                  {
                                    console.log("Inserted OK");
                                    res.send("URL Added with short url:"+ urlObj.short_url+ "!")
                                    db.close()    
                                  }
                               })
                              
                        }
                        else
                        {
                             res.send("URL short url:"+ result.short_url+ "!")

                        }
                       

                     }


                })


                
              }


              
})

})
       
      

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})