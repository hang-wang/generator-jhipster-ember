#Jhipster Ember Generator

[Yeoman](http://yeoman.io/) generator base on [JHipster](http://jhipster.github.io/) which describes itself as

> "Hipster stack for Java developers. Yeoman + Maven + Spring + AngularJS in one handy generator."

This fork brings the following changes or differences:

* Gradle instead of Maven as build system
* EmberJS instead of AngularJS
* MongoDB as an optional data storage
* Redis as the only Cache option
* PostgreSQL as the only SQL storage option
* Java 8 ready (more like Java 8 only)
* Security via OAuth2 using Spring Security
* [Stormpath](http://stormpath.com) as an optional authorization service
* Heroku deployment ready
* Docker ready

#Installation

Install Yeoman:

```> npm install -g yo```

Install Ember CLI:

```> npm install -g ember-cli```

Install Bower:

```> npm install -g bower```

Install JHipster Ember:

```> npm install -g generator-jhipster-ember```

#Requirements

* PostgreSQL or MongoDB (optional if using docker)
* [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Docker](http://docker.com/) (optional)
* [Fig](http://orchardup.github.io/fig/) (optional)
* [Direnv](http://direnv.net/) (optional but usefull if using Docker)
* [Boot2docker](https://github.com/boot2docker/boot2docker-cli) (is using Docker on OS X)

If you want to use [Stormpath](http://stormpath.com)

* A free account in [Stormpath](http://stormpath.com) place the apiKey.properties file in ~/.config/stormpath/

#Usage

```
> mkdir my_proyect
> cd my_proyect
> yo jhipster-ember
```

To run the generated application

Storage service can be started using Docker and Fig

For example:

```> fig up -d postgresql```

Then start the app:

```> ./gradlew bootRun```

On a different terminal session run the UI with livereload and all the good stuff (provided by [ember-cli](https://github.com/stefanpenner/ember-cli))

```> ./gradlew emberServer```

Yes a full gradle workflow!!

Goto http://localhost:4200/ login with marissa@koala.test/123Queso@

If you want to run the app fully dockerized just do ```> fig up```

#TODO

* Change the name (maybe)

#Contributors

As for this fork only, not the original project

* Yëco

#Thanks

I like to thank Julien Dubois and all the collaborators of the original JHipster generator.
