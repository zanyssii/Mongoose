
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../model");

module.exports = function(app) {


    app.get("/api/fetch", function(req, res) {
   
    //     axios.get("https://nypost.com/").then(function(response) {
       
    //         var $ = cheerio.load(response.data);
    //        console.log("We made it here")
    //         $(".home blog nypost  customizer-styles-applied nypost-geo-us highlander-enabled highlander-light > div:nth-child(1) >").each(function(i,element) {
                
    //            //console.log(elements);
    //             var result = {};
    //             result.headline = $(this)
    //                 .children("a")
    //                 .text()
    //                 .trim();
    //             result.url = $(this)
    //                 .children("a")
    //                 .attr("href");
    //             result.summary = $(this)
    //                 .siblings(".blurb");
    //                 if (result.summary == "") {
    //                     result.summary = "No summary";
    //                 } else {
    //                     result.summary = $(this)
    //                     .text()
    //                     .trim();
    
    //             db.Article.create(result)
    //             .catch(function(err) {
                  
    //                 console.log(err);
    //             });
    //         };
    //         //res.end() 
    //         res.send("Scrape Complete");
    //     });
    // })
    var result = {}
    axios.get("https://www.latimes.com/").then(function (response) {
       // Then, we load that into cheerio and save it to $ for a shorthand selector
       var $ = cheerio.load(response.data);
       // Now, we grab every h2 within an article tag, and do the following:
       $(".ListG-items-item ps-promo > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) a").each(function (i, element) {
           // Add the text and href of every link, and save them as properties of the result object
           result.headline = $(element).text();
           result.url= $(element).attr("href").trim();
           db.Article.create(result)
               .then(function (dbArticle) {
                   // View the added result in the console
                   console.log(dbArticle);
                   res.send(dbArticle);
               })
               .catch(function (err) {
                   // If an error occurred, log it
                   console.log(err);
               });
       });
       // res.send(dbArticle);
   });
    })
    
    app.get("/api/articles", function(req, res) {
        var articles = req.query;        
            db.Article.find(articles)
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    })


    app.get("/api/note/:id", function(req, res) {      
            db.Note.findOne({ _id: req.params.id })
            .then(function(dbNote) {
                res.json(dbNote);
            })
            .catch(function(err) {
                res.json(err);
            });
    })

    app.get("/api/article/:id", function(req, res) {
            db.Article.findOne({ _id: req.params.id })
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    })


    app.delete("/api/articles-unsaved", function(req, res) {
        db.Article.deleteMany({
            saved: false
        })
        .catch(function(err) {
            res.json(err);
        });
    })

    app.delete("/api/articles-saved", function(req, res) {
        db.Article.deleteMany({
            saved: true
        })
        .catch(function(err) {
            res.json(err);
        });
    })

    app.post("/api/note/:id", function(req, res){
        db.Note.findOneAndUpdate({
            _id: req.params.id
        }, {
            body: req.body.body
        }).then(function(dbEmployee) {
            res.json(dbEmployee);
        });
    })


    app.post("/api/article-save/:id", function(req, res) {
        db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: true,
                note: dbNote._id
            },
            {
                new: true
            }
            );
        })
        .catch(function(err) {
            res.json(err);
        });
    })


  
    app.post("/api/article-unsave/:id", function(req, res) {
        db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: false
            }
        )
        .catch(function(err) {
            res.json(err);
        });
    })

}
