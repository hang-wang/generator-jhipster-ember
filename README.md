#Jhipster Ember Generator

[Yeoman](http://yeoman.io/) generator base on [JHipster](http://jhipster.github.io/) wich self describes itself as

> "Hipster stack for Java developers. Yeoman + Maven + Spring + AngularJS in one handy generator."

This fork brings the following changes or differences:

* Gradle instead of Maven as build system
* EmberJS instead of AngularJS for the frontend
* MongoDB as an optional data storage
* Redis as the only Cache option
* PostgreSQL as the only SQL storage option
* Java 8 ready (more like Java 8 only)
* Security via OAuth2 using Spring Security
* [Stormpath](http://stormpath.com) as default authorization service
* Heroku deployment ready

#Installation

Install Yeoman:

```> npm install -g yo```

Install JHipster Ember:

```> npm install -g generator-jhipster-ember```

#Requirements

* PostgreSQL or MongoDB
* [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* An free account in [Stormpath](http://stormpath.com) place the apiKey.properties file in ~/.config/stormpath/

#Usage

```
> mkdir my_proyect
> cd my_proyect
> yo jhipster-ember
```

To run the generated application

```> ./gradlew bootRun```

On a different terminal session

```> grunt serve```

Once the app boots up, you should be able to see a new app register in your
Stormpath account, go ahead and create new root account for your app with the
following groups USER, ADMIN and ROOT (groups must be manually created)

#TODO

* Add option for a manage authentication manager instead of using Stormpath
* Bootstrap root user creation on boot on dev mode
* Add simple user registration and management UI/REST Endpoints
* Change the name (maybe)

#Contributors

As for this fork only not the original project

* Yëco

#Thanks

I like to thank Julien Dubois and all the collaborators of the original JHipster generator.
