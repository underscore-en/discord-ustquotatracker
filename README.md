# Discord Server

* NodeJS runtime holding a connection to Discord and a http srv

* The code is trivial and self-explinatory (LOL)

* I don't really care about CRUD anymore, ok if u ask me question, but I reply depend on mood.

* EXISTING ISSUES

  * devs should change the semester value for each semester manually
  
  * in ustcontroller, when theres a quota change event, a db update call is used but it doesn't match the semester, so the first ever <semester, course> will be updated which may not be the current one -> everytime ran will report an update. To fix it just add the semester filter to the db call.
