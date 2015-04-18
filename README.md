#Henriettapedia
###A wiki customized for the intra-office needs of the unnamed rapaciously tentacular mega-corporation helmed by the merciless magnate Henrietta herself.

####1. App spec.

  * Root Directory
    * User sees a list of recently active articles.
    * The user can select a category from a dropdown menu of articles to browse.
    * What's more, the user is given the option of composing an article.
    * Lastly, the user can click any article title to be taken to its showpage.
  * '/browse/:category'
    * User sees a list of articles for a given category organized by time of most recent activity.
    * User can click any article title to be taken to its showpage.
    * User can return to the root directory.
  * 'show/:id'
    * User is able to read the full text of the article.
    * User is able to see the edit history of the article.
    * User can access edit mode for the article.
    * User can return to the root.
    * User can return to /browse/:category
  * edit mode
    * User can access the article body in a text box.
    * User can save changes or cancel--either event returns the user to the article showpage.
  
