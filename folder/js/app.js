$(document).ready(function() {

var articleContainer = $(".article-container");



    $(document).on("click", ".scrape-new", scrapeArticles)
    // $(document).on("click", ".save", articleSave)
    // $(document).on("click", ".btn.delete", articleUnSave)
    // $(document).on("click", ".btn.notes", articleNote)
    //  $(document).on("click", ".btn.saveNote", saveNote)
    //  $(document).on("click", ".btn.clearUnSaved", clearUnSavedArticles)
   

 

    function initialize() {

        $.ajax({
            method: "GET",
            url: "/api/articles?saved=false"
        }).then(function(data) {
            articleContainer.empty();
            if (data && data.length) {
                console.log(data);
                renderNewArticles(data);
            } else {
                renderEmpty();
            }
        })}



             function scrapeArticles() {
        // deleteNonSavedArticles();
        $.ajax({
            method: "GET",
            url: "/api/fetch"
        }).then(function() {
            initialize();
        });
        }
     
    //scrapeArticles(),
    function renderNewArticles(articles) {
        console.log(articles)
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(newArticleCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function newArticleCard(article) {
        var card = $("<div class='card'>");
        card.attr("data-id", article._id);
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                .attr("href", article.url)
                .text(article.headline),
                $("<a class='btn btn-success save'>Save Article</a>")
                .attr("data-id", article._id)
            )
        );
        var cardBody = $("<div class='card-body'>").append(
            $("<p>").text(article.summary)
        );
        card.append(cardHeader, cardBody);
        return card;
    }

    // function deleteNonSavedArticles() {
    //     $.ajax({
    //         method: "DELETE",
    //         url: "/api/articles-unsaved"
    //     });
    // },

    function deleteSavedArticles() {
        $.ajax({
            method: "DELETE",
            url: "/api/articles-saved"
        });
    }


      function clearSavedArticles() {
        deleteSavedArticles();
        window.location.reload();
    }
    function clearUnSavedArticles() {
        deleteNonSavedArticles();
        window.location.reload();
    }

    
    function articleNote() {
        var currentArticle = $(this)
            .siblings(".article-link")
            .text()
            .trim();
        var currentArticleID = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/api/article/" + currentArticleID
        }).then(function(data) {
       
            noteID = data.note
            $.ajax({
                method: "GET",
                url: "/api/note/" + noteID
            }).then(function(data) {
                console.log("app notes " + data.body);
                var modalText = $("<div class='container-fluid text-center'>").append(
                    $("<h4>").text(currentArticle),
                    $("<hr>"),
                    $("<ul class='list-group note-container'>"),
                    $("<textarea placeholder='New Note' rows='4' cols='60'>")
                    .text(data.body),
                    $("<button class='btn btn-success saveNote'>Save Note</button>")
                    .attr("data-id", currentArticleID)
                );
                bootbox.dialog({
                    message: modalText,
                    closeButton: true
                });
                
            });
        });
    }


    function saveNote() {
    
        var currentArticleID = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/api/article/" + currentArticleID
        }).then(function(data) {
            
            noteID = data.note
            var newNote = $(".bootbox-body textarea")
            .val()
            .trim();
            $.ajax({
                method: "POST",
                url: "/api/note/" + noteID,
                data: {
                    body: newNote
                }
            })    
        });
        bootbox.hideAll();  
    }

            function articleSave() {
        var currentArticleID = $(this).attr("data-id");
       
        $.ajax({
            method: "POST",
            url: "/api/article-save/" + currentArticleID,
        })
      
            $(this).parent().remove();
        }



    function articleUnSave() {
        var currentArticleID = $(this).attr("data-id");
     
        $.ajax({
            method: "POST",
            url: "/api/article-unsave/" + currentArticleID
        })
        
        $(this).parent().parent().parent().remove();
   }
   
})
