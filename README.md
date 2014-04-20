#Jhipster Ember Generator

[Yeoman](http://yeoman.io/) generator base on [JHipster](http://jhipster.github.io/) wich self describes itself as

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

#Installation

Install Yeoman:

```> npm install -g yo```

Install JHipster Ember:

```> npm install -g generator-jhipster-ember```

#Requirements

* PostgreSQL or MongoDB
* [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

If you want to use [Stormpath](http://stormpath.com)

* A free account in [Stormpath](http://stormpath.com) place the apiKey.properties file in ~/.config/stormpath/

#Usage

```
> mkdir my_proyect
> cd my_proyect
> yo jhipster-ember
```

To run the generated application

```> ./gradlew bootRun```

On a different terminal session run the UI with livereload and all the good stuff (provided by [ember-cli](https://github.com/stefanpenner/ember-cli))

```> ./gradlew emberServer```

Yes a full gradle workflow!!

Goto http://localhost:4200/ login with marisssa@koala.test/123Queso@

#TODO

* Change the name (maybe)

#Contributors

As for this fork only, not the original project

* Yëco

#Thanks

I like to thank Julien Dubois and all the collaborators of the original JHipster generator.
