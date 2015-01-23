'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var JhipsterEmberGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the super-excellent JhipsterEmber generator!'));

    var prompts = [
    {
      type: 'input',
      name: 'baseName',
      message: '(1/7) What is the base name of your application?',
      default: 'jhipster-ember'
    }, {
      type: 'input',
      name: 'packageName',
      message: '(2/7) What is your default Java package name?',
      default: 'com.mycompany.myapp'
    }, {
      type: 'list',
      name: 'storage',
      message: '(3/7) What is your application storage engine?',
      choices: [{
        value: 'postgres',
        name: 'PostgreSQL'
      }, {
        value: 'mongo',
        name: 'MongoDB'
      }],
      default: 0
    }, {
      type: 'confirm',
      name: 'ui',
      message: '(4/7) Generate EmberJS UI?',
      default: true
    }, {
      type: 'confirm',
      name: 'stormpath',
      message: '(5/7) Use Stormpath as authentication provider?',
      default: false
    }, {
      type: 'confirm',
      name: 'docker',
      message: '(6/7) Use docker?',
      default: true
    }, {
      type: 'confirm',
      name: 'heroku',
      message: '(7/7) Are you deploying to Heroku?',
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.packageName = props.packageName;
      this.baseName = props.baseName;
      this.storage = props.storage;
      this.ui = props.ui;
      this.stormpath = props.stormpath;
      this.docker = props.docker;
      this.heroku = props.heroku;
      this.packageFolder = props.packageName.replace(/\./g, '/');
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var javaRoot = 'src/main/java/' + this.packageFolder + '/';

      this.dest.mkdir(javaRoot);

      this.template('src/main/java/package/_Application.java', javaRoot + 'Application.java');

      this.template('src/main/java/package/config/_package-info.java', javaRoot + 'config/package-info.java');
      this.template('src/main/java/package/config/_AsyncConfiguration.java', javaRoot + 'config/AsyncConfiguration.java');
      this.template('src/main/java/package/config/_CacheConfiguration.java', javaRoot + 'config/CacheConfiguration.java');
      this.template('src/main/java/package/config/_Constants.java', javaRoot + 'config/Constants.java');

      if (this.storage === 'postgres') {
        this.template('src/main/java/package/config/_DatabaseConfiguration.java', javaRoot + 'config/DatabaseConfiguration.java');
      } else {
        this.template('src/main/java/package/config/_MongoConfiguration.java', javaRoot + 'config/MongoConfiguration.java');
      }

      this.template('src/main/java/package/config/_LocaleConfiguration.java', javaRoot + 'config/LocaleConfiguration.java');
      this.template('src/main/java/package/config/_MailConfiguration.java', javaRoot + 'config/MailConfiguration.java');
      this.template('src/main/java/package/config/_MetricsConfiguration.java', javaRoot + 'config/MetricsConfiguration.java');
      this.template('src/main/java/package/config/_ThymeleafConfiguration.java', javaRoot + 'config/ThymeleafConfiguration.java');
      this.template('src/main/java/package/config/_WebConfigurer.java', javaRoot + 'config/WebConfigurer.java');
      this.template('src/main/java/package/config/_SecurityConfiguration.java', javaRoot + 'config/SecurityConfiguration.java');
      this.template('src/main/java/package/config/_OAuth2ServerConfig.java', javaRoot + 'config/OAuth2ServerConfig.java');

      if (this.stormpath) {
        this.template('src/main/java/package/config/_StormpathConfiguration.java', javaRoot + 'config/StormpathConfiguration.java');
      }

      this.template('src/main/java/package/config/audit/_package-info.java', javaRoot + 'config/audit/package-info.java');
      this.template('src/main/java/package/config/audit/_AuditConfiguration.java', javaRoot + 'config/audit/AuditConfiguration.java');

      this.template('src/main/java/package/config/metrics/_package-info.java', javaRoot + 'config/metrics/package-info.java');

      if (this.storage === 'postgres') {
        this.template('src/main/java/package/config/metrics/_DatabaseHealthCheck.java', javaRoot + 'config/metrics/DatabaseHealthCheck.java');
      } else {
        this.template('src/main/java/package/config/metrics/_DatabaseHealthCheck-mongo.java', javaRoot + 'config/metrics/DatabaseHealthCheck.java');
      }

      this.template('src/main/java/package/config/metrics/_JavaMailHealthCheck.java', javaRoot + 'config/metrics/JavaMailHealthCheck.java');

      if (this.stormpath) {
        this.template('src/main/java/package/config/data/populator/_BootstrapDataPopulator-stormpath.java', javaRoot + 'config/data/populator/BootstrapDataPopulator.java');
      } else {
        this.template('src/main/java/package/config/data/populator/_BootstrapDataPopulator.java', javaRoot + 'config/data/populator/BootstrapDataPopulator.java');
      }

      this.template('src/main/java/package/domain/_package-info.java', javaRoot + 'domain/package-info.java');
      this.template('src/main/java/package/domain/util/_UserDeserializer.java', javaRoot + 'domain/util/UserDeserializer.java');
      this.template('src/main/java/package/domain/util/_package-info.java', javaRoot + 'domain/util/package-info.java');

      if (this.storage === 'postgres') {
        this.template('src/main/java/package/domain/_Base.java', javaRoot + 'domain/Base.java');
        this.template('src/main/java/package/domain/_AuditEvent.java', javaRoot + 'domain/AuditEvent.java');
      } else {
        this.template('src/main/java/package/domain/_Base-mongo.java', javaRoot + 'domain/Base.java');
        this.template('src/main/java/package/domain/_AuditEvent-mongo.java', javaRoot + 'domain/AuditEvent.java');
        this.template('src/main/java/package/domain/util/_LocalDateTimeReadConverter.java', javaRoot + 'domain/util/LocalDateTimeReadConverter.java');
        this.template('src/main/java/package/domain/util/_LocalDateTimeWriteConverter.java', javaRoot + 'domain/util/LocalDateTimeWriteConverter.java');
        this.template('src/main/java/package/domain/util/_ObjectIdSerializer.java', javaRoot + 'domain/util/ObjectIdSerializer.java');
      }

      if (!this.stormpath && this.storage === 'mongo') {
        this.template('src/main/java/package/domain/util/_UserPasswordEncoderListener.java', javaRoot + 'domain/util/UserPasswordEncoderListener.java');
      }

      if (this.stormpath) {
        this.template('src/main/java/package/domain/_User.java', javaRoot + 'domain/User.java');
      } else {
        if (this.storage === 'postgres') {
          this.template('src/main/java/package/domain/_User-jpa.java', javaRoot + 'domain/User.java');
        } else {
          this.template('src/main/java/package/domain/_User-mongo.java', javaRoot + 'domain/User.java');
        }
      }
      this.template('src/main/java/package/domain/_Resource.java', javaRoot + 'domain/Resource.java');
      this.template('src/main/java/package/domain/_Logger.java', javaRoot + 'domain/Logger.java');
      this.template('src/main/java/package/domain/util/_CustomPage.java', javaRoot + 'domain/util/CustomPage.java');
      this.template('src/main/java/package/domain/util/_CustomPageSerializer.java', javaRoot + 'domain/util/CustomPageSerializer.java');
      this.template('src/main/java/package/domain/util/_EntityWrapper.java', javaRoot + 'domain/util/EntityWrapper.java');

      if (this.storage === 'postgres') {
        this.template('src/main/java/package/hibernate/_CustomPostgreSQLDialect.java', javaRoot + 'hibernate/CustomPostgreSQLDialect.java');
      }

      this.template('src/main/java/package/repository/_package-info.java', javaRoot + 'repository/package-info.java');

      if (this.storage === 'postgres') {
        this.template('src/main/java/package/repository/_PersistenceAuditEventRepository.java', javaRoot + 'repository/PersistenceAuditEventRepository.java');
      } else {
        this.template('src/main/java/package/repository/_PersistenceAuditEventRepository-mongo.java', javaRoot + 'repository/PersistenceAuditEventRepository.java');
      }

      if (this.stormpath) {
        this.template('src/main/java/package/repository/_UserRepository.java', javaRoot + 'repository/UserRepository.java');
      } else {
        if (this.storage === 'postgres') {
          this.template('src/main/java/package/repository/_UserRepository-jpa.java', javaRoot + 'repository/UserRepository.java');
        } else {
          this.template('src/main/java/package/repository/_UserRepository-mongo.java', javaRoot + 'repository/UserRepository.java');
        }
      }
      this.template('src/main/java/package/repository/_LoggerRepository.java', javaRoot + 'repository/LoggerRepository.java');

      this.template('src/main/java/package/security/_package-info.java', javaRoot + 'security/package-info.java');
      this.template('src/main/java/package/security/_SecurityUtils.java', javaRoot + 'security/SecurityUtils.java');
      this.template('src/main/java/package/security/_CustomTokenEnhancer.java', javaRoot + 'security/CustomTokenEnhancer.java');
      this.template('src/main/java/package/security/_OAuth2ExceptionMixin.java', javaRoot + 'security/OAuth2ExceptionMixin.java');
      this.template('src/main/java/package/security/_OAuth2ExceptionSerializer.java', javaRoot + 'security/OAuth2ExceptionSerializer.java');

      if (this.storage === 'mongo') {
        this.template('src/main/java/package/security/mongodb/_MongoTokenStore.java', javaRoot + 'security/mongodb/MongoTokenStore.java');
        this.template('src/main/java/package/security/mongodb/_OauthAccessToken.java', javaRoot + 'security/mongodb/OauthAccessToken.java');
        this.template('src/main/java/package/security/mongodb/_OauthAccessTokenRepository.java', javaRoot + 'security/mongodb/OauthAccessTokenRepository.java');
        this.template('src/main/java/package/security/mongodb/_OauthClientToken.java', javaRoot + 'security/mongodb/OauthClientToken.java');
        this.template('src/main/java/package/security/mongodb/_OauthCode.java', javaRoot + 'security/mongodb/OauthCode.java');
        this.template('src/main/java/package/security/mongodb/_OauthRefreshToken.java', javaRoot + 'security/mongodb/OauthRefreshToken.java');
        this.template('src/main/java/package/security/mongodb/_OauthRefreshTokenRepository.java', javaRoot + 'security/mongodb/OauthRefreshTokenRepository.java');
        this.template('src/main/java/package/security/mongodb/_package-info.java', javaRoot + 'security/mongodb/package-info.java');
      }

      if (!this.stormpath) {
        this.template('src/main/java/package/security/_UserDetailsAuthenticationProvider.java', javaRoot + 'security/UserDetailsAuthenticationProvider.java');
      }

      this.template('src/main/java/package/service/_package-info.java', javaRoot + 'service/package-info.java');
      this.template('src/main/java/package/service/_MailService.java', javaRoot + 'service/MailService.java');
      this.template('src/main/java/package/service/_AuditEventConverter.java', javaRoot + 'service/AuditEventConverter.java');

      this.template('src/main/java/package/web/filter/_package-info.java', javaRoot + 'web/filter/package-info.java');
      this.template('src/main/java/package/web/filter/_CachingHttpHeadersFilter.java', javaRoot + 'web/filter/CachingHttpHeadersFilter.java');

      this.template('src/main/java/package/web/rest/_package-info.java', javaRoot + 'web/rest/package-info.java');

      if (this.storage === 'postgres') {
        this.template('src/main/java/package/web/rest/_AuditEventsResource.java', javaRoot + 'web/rest/AuditEventsResource.java');
      } else {
        this.template('src/main/java/package/web/rest/_AuditEventsResource-mongo.java', javaRoot + 'web/rest/AuditEventsResource.java');
      }
      this.template('src/main/java/package/web/rest/_LoggersResource.java', javaRoot + 'web/rest/LoggersResource.java');

      if (this.stormpath) {
        this.template('src/main/java/package/web/rest/_UsersResource.java', javaRoot + 'web/rest/UsersResource.java');
      } else {
        if (this.storage === 'postgres') {
          this.template('src/main/java/package/web/rest/_UsersResource-jpa.java', javaRoot + 'web/rest/UsersResource.java');
        } else {
          this.template('src/main/java/package/web/rest/_UsersResource-mongo.java', javaRoot + 'web/rest/UsersResource.java');
        }
      }

      this.template('src/main/java/package/web/rest/_AbstractRestResource.java', javaRoot + 'web/rest/AbstractRestResource.java');
      this.template('src/main/java/package/web/rest/_EntityNotFoundException.java', javaRoot + 'web/rest/EntityNotFoundException.java');
      this.template('src/main/java/package/web/rest/_RestError.java', javaRoot + 'web/rest/RestError.java');
    },

    resources: function () {
      this.dest.mkdir('src/main/resources');

      // i18n resources used by thymeleaf
      this.src.copy('src/main/resources/i18n/messages_en.properties', 'src/main/resources/i18n/messages_en.properties');
      this.src.copy('src/main/resources/i18n/messages_fr.properties', 'src/main/resources/i18n/messages_fr.properties');
      this.src.copy('src/main/resources/i18n/messages_de.properties', 'src/main/resources/i18n/messages_de.properties');

      // Thymeleaf templates
      this.src.copy('src/main/resources/templates/error.html', 'src/main/resources/templates/error.html');

      this.template('src/main/resources/_logback.xml', 'src/main/resources/logback.xml');
      this.src.copy('src/main/resources/urlrewrite.xml', 'src/main/resources/urlrewrite.xml');
      this.src.copy('src/main/resources/urlrewrite-prod.xml', 'src/main/resources/urlrewrite-prod.xml');

      this.template('src/main/resources/config/_application.yml', 'src/main/resources/config/application.yml');
      this.template('src/main/resources/config/_application-dev.yml', 'src/main/resources/config/application-dev.yml');
      this.template('src/main/resources/config/_application-prod.yml', 'src/main/resources/config/application-prod.yml');

      if (this.storage === 'postgres') {
        this.template('src/main/resources/config/liquibase/_db-changelog.xml', 'src/main/resources/config/liquibase/db-changelog.xml');
      }
    },

    projectfiles: function () {
      this.template('_README.md', 'README.md');
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('gradle.properties', 'gradle.properties');
      this.template('_build.gradle', 'build.gradle');
      this.template('_settings.gradle', 'settings.gradle');
    },

    docker: function() {
      if (this.docker) {
        this.template('_fig.yml', 'fig.yml');
        this.template('_Dockerfile', 'Dockerfile');
        this.template('_envrc', '.envrc');
      }
    },

    newrelic: function() {
      this.src.copy('newrelic.yml', 'newrelic.yml');
    },

    heroku: function() {
      if (this.heroku) {
        this.src.copy('Procfile', 'Procfile');
        this.src.copy('system.properties', 'system.properties');
      }
    },

    ui: function () {
      if (this.ui) {
        var done = this.async();

        this.dest.mkdir('ui');

        this.spawnCommand('ember', ['init', '--skip-npm', '--skip-bower'], {cwd: './ui'}).on('exit', function () {
          this.dest.delete('ui/config/environment.js');
          this.src.copy('ui/config/environment.js', 'ui/config/environment.js');

          this.dest.delete('ui/Brocfile.js');
          this.src.copy('ui/Brocfile.js', 'ui/Brocfile.js');

          this.src.copy('ui/build.gradle', 'ui/build.gradle');

          //Public folder UI files
          this.directory('ui/public/fonts', 'ui/public/fonts');
          this.src.copy('ui/public/images/logo.png', 'ui/public/images/logo.png');

          //App folder UI files
          this.dest.delete('ui/app/router.js');
          this.template('ui/app/_router.js', 'ui/app/router.js');

          this.template('ui/app/templates/_navigation.hbs', 'ui/app/templates/navigation.hbs');
          this.dest.delete('ui/app/templates/application.hbs');
          this.src.copy('ui/app/templates/application.hbs', 'ui/app/templates/application.hbs');
          this.src.copy('ui/app/templates/index.hbs', 'ui/app/templates/index.hbs');
          this.src.copy('ui/app/templates/login.hbs', 'ui/app/templates/login.hbs');
          this.directory('ui/app/templates/loggers', 'ui/app/templates/loggers');
          this.directory('ui/app/templates/audit-events', 'ui/app/templates/audit-events');
          this.directory('ui/app/templates/users', 'ui/app/templates/users');

          this.dest.delete('ui/app/styles/main.css');
          this.dest.delete('ui/app/styles/app.css');
          this.directory('ui/app/styles', 'ui/app/styles');
          this.directory('ui/app/routes', 'ui/app/routes');
          this.directory('ui/app/models', 'ui/app/models');
          this.directory('ui/app/mixins', 'ui/app/mixins');
          this.template('ui/app/initializers/_authentication.js', 'ui/app/initializers/authentication.js');
          this.template('ui/app/initializers/_simple-auth-config.js', 'ui/app/initializers/simple-auth-config.js');
          this.src.copy('ui/app/controllers/application.js', 'ui/app/controllers/application.js');
          this.src.copy('ui/app/controllers/login.js', 'ui/app/controllers/login.js');
          this.template('ui/app/controllers/users/_index.js', 'ui/app/controllers/users/index.js');
          this.template('ui/app/controllers/users/_edit.js', 'ui/app/controllers/users/edit.js');
          this.template('ui/app/controllers/users/_new.js', 'ui/app/controllers/users/new.js');
          this.template('ui/app/controllers/loggers/_index.js', 'ui/app/controllers/loggers/index.js');
          this.template('ui/app/controllers/audit-events/_index.js', 'ui/app/controllers/audit-events/index.js');
          this.src.copy('ui/app/adapters/application.js', 'ui/app/adapters/application.js');
          this.src.copy('ui/app/serializers/application.js', 'ui/app/serializers/application.js');

          done();
        }.bind(this));
      }
    },

    uiDeps: function () {
      if (this.ui) {
        var done = this.async();

        this.spawnCommand('npm', ['install', '--save-dev', 'bower', 'ember-cli-less', 'ember-cli-simple-auth', 'ember-cli-simple-auth-oauth2'], {cwd: './ui'}).on('exit', function () {
          this.spawnCommand('bower', ['install', 'bootstrap', 'ember-addons.bs_for_ember', '--save'], {cwd: './ui'});
          done();
        }.bind(this));
      }
    },

    end: function () {
      var done = this.async();

      this.spawnCommand('gradle', ['wrapper']).on('exit', function () {
        this.spawnCommand('./gradlew', ['idea', 'build']);
        done();
      }.bind(this));
    }
  }
});

module.exports = JhipsterEmberGenerator;
