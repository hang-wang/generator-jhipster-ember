  'use strict';
  var util = require('util'),
      path = require('path'),
      yeoman = require('yeoman-generator'),
      chalk = require('chalk'),
      _s = require('underscore.string'),
      shelljs = require('shelljs');

  var JhipsterGenerator = module.exports = function JhipsterGenerator(args, options, config) {
      yeoman.generators.Base.apply(this, arguments);

      this.on('end', function () {
        this.spawnCommand('gradle', ['wrapper', 'idea', 'clean', 'build']);
      });
      this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
  };

  util.inherits(JhipsterGenerator, yeoman.generators.Base);

  JhipsterGenerator.prototype.askFor = function askFor() {
      var cb = this.async();

      console.log(chalk.red('\n' +
          ' _     _   ___   __  _____  ____  ___       __  _____   __    __    _    \n' +
          '| |_| | | | |_) ( (`  | |  | |_  | |_)     ( (`  | |   / /\\  / /`  | |_/ \n' +
          '|_| | |_| |_|   _)_)  |_|  |_|__ |_| \\     _)_)  |_|  /_/--\\ \\_\\_, |_| \\ \n' +
          '                             ____  ___   ___                             \n' +
          '                            | |_  / / \\ | |_)                            \n' +
          '                            |_|   \\_\\_/ |_| \\                            \n' +
          '              _    __    _       __        ___   ____  _      __        \n' +
          '             | |  / /\\  \\ \\  /  / /\\      | | \\ | |_  \\ \\  / ( (`       \n' +
          '           \\_|_| /_/--\\  \\_\\/  /_/--\\     |_|_/ |_|__  \\_\\/  _)_)       \n' +
          '\n'));

      console.log('\nWelcome to the Jhipster Ember Generator\n\n');

      var prompts = [
          {
              type: 'input',
              name: 'baseName',
              message: '(1/5) What is the base name of your application?',
              default: 'jhipster-ember'
          },
          {
              type: 'input',
              name: 'packageName',
              message: '(2/5) What is your default Java package name?',
              default: 'com.mycompany.myapp'
          },
          {
              type: 'list',
              name: 'storage',
              message: '(3/5) What is your application storage engine?',
              choices: [
                  {
                      value: 'postgres',
                      name: 'PostgreSQL'
                  },
                  {
                      value: 'mongo',
                      name: 'MongoDB'
                  }
              ],
              default: 0
          },
          {
              type: 'list',
              name: 'apiOnly',
              message: '(4/5) Create API only application (no UI)?',
              choices: [
                  {
                      value: 'yes',
                      name: 'Yes'
                  },
                  {
                      value: 'no',
                      name: 'no'
                  }
              ],
              default: 1
          },
          {
              type: 'list',
              name: 'stormpath',
              message: '(5/5) Use Stormpath as authentication provider?',
              choices: [
                  {
                      value: 'yes',
                      name: 'Yes'
                  },
                  {
                      value: 'no',
                      name: 'no'
                  }
              ],
              default: 1
          }
      ];

      this.prompt(prompts, function (props) {
          this.packageName = props.packageName;
          this.baseName = props.baseName;
          this.storage = props.storage;
          this.apiOnly = props.apiOnly;
          this.stormpath = props.stormpath;
          cb();
      }.bind(this));
  };

  JhipsterGenerator.prototype.app = function app() {
      this.template('_README.md', 'README.md');
      this.copy('gitignore', '.gitignore');
      removefolder('spring_loaded');
      this.copy('system.properties', 'system.properties');
      this.copy('Procfile', 'Procfile');
      this.copy('newrelic.yml', 'newrelic.yml');
      this.copy('gradle.properties', 'gradle.properties');

      var packageFolder = this.packageName.replace(/\./g, '/');
      this.template('_build.gradle', 'build.gradle');
      this.template('_settings.gradle', 'settings.gradle');

      // Create Java resource files
      var resourceDir = 'src/main/resources/';
      this.mkdir(resourceDir);

      // i18n resources used by thymeleaf
      this.copy(resourceDir + '/i18n/messages_en.properties', resourceDir + 'i18n/messages_en.properties');
      this.copy(resourceDir + '/i18n/messages_fr.properties', resourceDir + 'i18n/messages_fr.properties');
      this.copy(resourceDir + '/i18n/messages_de.properties', resourceDir + 'i18n/messages_de.properties');

      // Thymeleaf templates
      this.copy(resourceDir + '/templates/error.html', resourceDir + 'templates/error.html');

      this.template(resourceDir + '_logback.xml', resourceDir + 'logback.xml');
      this.copy(resourceDir + 'urlrewrite.xml', resourceDir + 'urlrewrite.xml');
      this.copy(resourceDir + 'urlrewrite-prod.xml', resourceDir + 'urlrewrite-prod.xml');

      this.template(resourceDir + '/config/_application.yml', resourceDir + 'config/application.yml');
      this.template(resourceDir + '/config/_application-dev.yml', resourceDir + 'config/application-dev.yml');
      this.template(resourceDir + '/config/_application-prod.yml', resourceDir + 'config/application-prod.yml');

      if(this.storage == 'postgres') {
        this.template(resourceDir + '/config/liquibase/_db-changelog.xml', resourceDir + 'config/liquibase/db-changelog.xml');
      } else {
        removefolder(resourceDir + 'config/liquibase')
      }

      // Create Java files
      var javaDir = 'src/main/java/' + packageFolder + '/';

      this.template('src/main/java/package/_Application.java', javaDir + '/Application.java');

      this.template('src/main/java/package/config/_package-info.java', javaDir + 'config/package-info.java');
      this.template('src/main/java/package/config/_AsyncConfiguration.java', javaDir + 'config/AsyncConfiguration.java');
      this.template('src/main/java/package/config/_CacheConfiguration.java', javaDir + 'config/CacheConfiguration.java');
      this.template('src/main/java/package/config/_Constants.java', javaDir + 'config/Constants.java');
      if (this.storage == 'postgres') {
        this.template('src/main/java/package/config/_DatabaseConfiguration.java', javaDir + 'config/DatabaseConfiguration.java');
        removefile(javaDir + 'config/MongoConfiguration.java')
      } else {
        this.template('src/main/java/package/config/_MongoConfiguration.java', javaDir + 'config/MongoConfiguration.java');
        removefile(javaDir + 'config/DatabaseConfiguration.java')
      }
      this.template('src/main/java/package/config/_LocaleConfiguration.java', javaDir + 'config/LocaleConfiguration.java');
      this.template('src/main/java/package/config/_MailConfiguration.java', javaDir + 'config/MailConfiguration.java');
      this.template('src/main/java/package/config/_MetricsConfiguration.java', javaDir + 'config/MetricsConfiguration.java');
      this.template('src/main/java/package/config/_ThymeleafConfiguration.java', javaDir + 'config/ThymeleafConfiguration.java');
      this.template('src/main/java/package/config/_WebConfigurer.java', javaDir + 'config/WebConfigurer.java');
      this.template('src/main/java/package/config/_SecurityConfiguration.java', javaDir + 'config/SecurityConfiguration.java');
      this.template('src/main/java/package/config/_OAuth2ServerConfig.java', javaDir + 'config/OAuth2ServerConfig.java');
      if(this.stormpath == 'yes') {
        this.template('src/main/java/package/config/_StormpathConfiguration.java', javaDir + 'config/StormpathConfiguration.java');
      } else {
        removefile(javaDir + 'config/StormpathConfiguration.java');
      }

      this.template('src/main/java/package/config/audit/_package-info.java', javaDir + 'config/audit/package-info.java');
      this.template('src/main/java/package/config/audit/_AuditConfiguration.java', javaDir + 'config/audit/AuditConfiguration.java');

      this.template('src/main/java/package/config/metrics/_package-info.java', javaDir + 'config/metrics/package-info.java');
      if(this.storage == 'postgres') {
        this.template('src/main/java/package/config/metrics/_DatabaseHealthCheck.java', javaDir + 'config/metrics/DatabaseHealthCheck.java');
      } else {
        this.template('src/main/java/package/config/metrics/_DatabaseHealthCheck-mongo.java', javaDir + 'config/metrics/DatabaseHealthCheck.java');
      }
      this.template('src/main/java/package/config/metrics/_JavaMailHealthCheck.java', javaDir + 'config/metrics/JavaMailHealthCheck.java');

      if(this.stormpath == 'yes') {
        this.template('src/main/java/package/config/data/populator/_BootstrapDataPopulator-stormpath.java', javaDir + 'config/data/populator/BootstrapDataPopulator.java');
      } else {
        this.template('src/main/java/package/config/data/populator/_BootstrapDataPopulator.java', javaDir + 'config/data/populator/BootstrapDataPopulator.java');
      }

      removefolder(javaDir + 'config/reload')

      this.template('src/main/java/package/domain/_package-info.java', javaDir + 'domain/package-info.java');
      this.template('src/main/java/package/domain/util/_UserDeserializer.java', javaDir + 'domain/util/UserDeserializer.java');
      this.template('src/main/java/package/domain/util/_package-info.java', javaDir + 'domain/util/package-info.java');
      if(this.storage == 'postgres') {
        this.template('src/main/java/package/domain/_Base.java', javaDir + 'domain/Base.java');
        this.template('src/main/java/package/domain/_AuditEvent.java', javaDir + 'domain/AuditEvent.java');
        removefile(javaDir + 'domain/util/LocalDateTimeReadConverter.java')
        removefile(javaDir + 'domain/util/LocalDateTimeWriteConverter.java')
        removefile(javaDir + 'domain/util/ObjectIdSerializer.java')
      } else {
        this.template('src/main/java/package/domain/_Base-mongo.java', javaDir + 'domain/Base.java');
        this.template('src/main/java/package/domain/_AuditEvent-mongo.java', javaDir + 'domain/AuditEvent.java');
        this.template('src/main/java/package/domain/util/_LocalDateTimeReadConverter.java', javaDir + 'domain/util/LocalDateTimeReadConverter.java');
        this.template('src/main/java/package/domain/util/_LocalDateTimeWriteConverter.java', javaDir + 'domain/util/LocalDateTimeWriteConverter.java');
        this.template('src/main/java/package/domain/util/_ObjectIdSerializer.java', javaDir + 'domain/util/ObjectIdSerializer.java');

        if(this.stormpath == 'no') {
          this.template('src/main/java/package/domain/util/_UserPasswordEncoderListener.java', javaDir + 'domain/util/UserPasswordEncoderListener.java');
        }
      }

      if(this.stormpath == 'yes') {
        this.template('src/main/java/package/domain/_User.java', javaDir + 'domain/User.java');
      } else {
        if(this.storage == 'postgres') {
          this.template('src/main/java/package/domain/_User-jpa.java', javaDir + 'domain/User.java');
        } else {
          this.template('src/main/java/package/domain/_User-mongo.java', javaDir + 'domain/User.java');
        }
      }
      this.template('src/main/java/package/domain/_Resource.java', javaDir + 'domain/Resource.java');
      this.template('src/main/java/package/domain/_Logger.java', javaDir + 'domain/Logger.java');
      this.template('src/main/java/package/domain/util/_CustomPage.java', javaDir + 'domain/util/CustomPage.java');
      this.template('src/main/java/package/domain/util/_CustomPageSerializer.java', javaDir + 'domain/util/CustomPageSerializer.java');
      this.template('src/main/java/package/domain/util/_EntityWrapper.java', javaDir + 'domain/util/EntityWrapper.java');

      if(this.storage == 'postgres') {
        this.template('src/main/java/package/hibernate/_CustomPostgreSQLDialect.java', javaDir + 'hibernate/CustomPostgreSQLDialect.java');
      } else {
        removefolder(javaDir + 'hibernate')
      }

      this.template('src/main/java/package/repository/_package-info.java', javaDir + 'repository/package-info.java');
      if(this.storage == 'postgres') {
        this.template('src/main/java/package/repository/_PersistenceAuditEventRepository.java', javaDir + 'repository/PersistenceAuditEventRepository.java');
      } else {
        this.template('src/main/java/package/repository/_PersistenceAuditEventRepository-mongo.java', javaDir + 'repository/PersistenceAuditEventRepository.java');
      }

      if(this.stormpath == 'yes') {
        this.template('src/main/java/package/repository/_UserRepository.java', javaDir + 'repository/UserRepository.java');
      } else {
        if(this.storage == 'postgres') {
          this.template('src/main/java/package/repository/_UserRepository-jpa.java', javaDir + 'repository/UserRepository.java');
        } else {
          this.template('src/main/java/package/repository/_UserRepository-mongo.java', javaDir + 'repository/UserRepository.java');
        }
      }
      this.template('src/main/java/package/repository/_LoggerRepository.java', javaDir + 'repository/LoggerRepository.java');

      this.template('src/main/java/package/security/_package-info.java', javaDir + 'security/package-info.java');
      this.template('src/main/java/package/security/_SecurityUtils.java', javaDir + 'security/SecurityUtils.java');
      this.template('src/main/java/package/security/_CustomTokenEnhancer.java', javaDir + 'security/CustomTokenEnhancer.java');
      this.template('src/main/java/package/security/_UserApprovalHandler.java', javaDir + 'security/UserApprovalHandler.java');
      this.template('src/main/java/package/security/_OAuth2ExceptionMixin.java', javaDir + 'security/OAuth2ExceptionMixin.java');
      this.template('src/main/java/package/security/_OAuth2ExceptionSerializer.java', javaDir + 'security/OAuth2ExceptionSerializer.java');
      if(this.stormpath === 'no') {
        this.template('src/main/java/package/security/_UserDetailsAuthenticationProvider.java', javaDir + 'security/UserDetailsAuthenticationProvider.java');
      }

      this.template('src/main/java/package/service/_package-info.java', javaDir + 'service/package-info.java');
      this.template('src/main/java/package/service/_MailService.java', javaDir + 'service/MailService.java');
      this.template('src/main/java/package/service/_AuditEventConverter.java', javaDir + 'service/AuditEventConverter.java');

      this.template('src/main/java/package/web/filter/_package-info.java', javaDir + 'web/filter/package-info.java');
      this.template('src/main/java/package/web/filter/_CachingHttpHeadersFilter.java', javaDir + 'web/filter/CachingHttpHeadersFilter.java');

      this.template('src/main/java/package/web/rest/_package-info.java', javaDir + 'web/rest/package-info.java');
      if(this.storage == 'postgres') {
        this.template('src/main/java/package/web/rest/_AuditEventsResource.java', javaDir + 'web/rest/AuditEventsResource.java');
      } else {
        this.template('src/main/java/package/web/rest/_AuditEventsResource-mongo.java', javaDir + 'web/rest/AuditEventsResource.java');
      }
      this.template('src/main/java/package/web/rest/_LoggersResource.java', javaDir + 'web/rest/LoggersResource.java');

      if(this.stormpath == 'yes') {
        this.template('src/main/java/package/web/rest/_UsersResource.java', javaDir + 'web/rest/UsersResource.java');
      } else {
        if(this.storage == 'postgres') {
          this.template('src/main/java/package/web/rest/_UsersResource-jpa.java', javaDir + 'web/rest/UsersResource.java');
        } else {
          this.template('src/main/java/package/web/rest/_UsersResource-mongo.java', javaDir + 'web/rest/UsersResource.java');
        }
      }

      this.template('src/main/java/package/web/rest/_AbstractRestResource.java', javaDir + 'web/rest/AbstractRestResource.java');
      this.template('src/main/java/package/web/rest/_EntityNotFoundException.java', javaDir + 'web/rest/EntityNotFoundException.java');
      this.template('src/main/java/package/web/rest/_RestError.java', javaDir + 'web/rest/RestError.java');

      this.template('src/main/java/package/web/servlet/_package-info.java', javaDir + 'web/servlet/package-info.java');
      this.template('src/main/java/package/web/servlet/_HealthCheckServlet.java', javaDir + 'web/servlet/HealthCheckServlet.java');

      var uiDir = 'ui/';
      if(this.apiOnly === 'no') {
        // Create UI files
        this.mkdir(uiDir);
        //Root UI Files
        this.copy(uiDir + 'build.gradle', uiDir + 'build.gradle');
        this.copy(uiDir + 'bowerrc', uiDir + '.bowerrc');
        this.copy(uiDir + 'gitignore', uiDir + '.gitignore');
        this.copy(uiDir + 'jshintrc', uiDir + '.jshintrc');

        this.template(uiDir + '_Brocfile.js', uiDir + 'Brocfile.js');
        this.template(uiDir + '_bower.json', uiDir + 'bower.json');
        this.template(uiDir + '_package.json', uiDir + 'package.json');
        //Vendor folder UI files
        this.copy(uiDir + 'vendor/_loader.js', uiDir + 'vendor/_loader.js');
        this.copy(uiDir + 'vendor/ember-shim.js', uiDir + 'vendor/ember-shim.js');
        this.copy(uiDir + 'vendor/qunit-shim.js', uiDir + 'vendor/qunit-shim.js');
        //Tests folder UI files
        this.copy(uiDir + 'tests/jshintrc', uiDir + 'tests/jshintrc');
        this.copy(uiDir + 'tests/test-helper.js', uiDir + 'tests/test-helper.js');
        this.copy(uiDir + 'tests/test-loader.js', uiDir + 'tests/test-loader.js');
        this.template(uiDir + 'tests/_index.html', uiDir + 'tests/index.html');
        this.copy(uiDir + 'tests/unit/.gitkeep', uiDir + 'tests/unit/.gitkeep');
        this.template(uiDir + 'tests/helpers/_resolver.js', uiDir + 'tests/helpers/resolver.js');
        this.template(uiDir + 'tests/helpers/_start-app.js', uiDir + 'tests/helpers/start-app.js');
        //Public folder UI files
        this.directory(uiDir + 'public/fonts', uiDir + 'public/fonts');
        this.copy(uiDir + 'public/images/logo.png', uiDir + 'public/images/logo.png');
        //Config folder UI files
        this.copy(uiDir + 'config/environment.js', uiDir + 'config/environment.js');
        //App folder UI fils
        this.copy(uiDir + 'app/main.js', uiDir + 'app/main.js');
        this.copy(uiDir + 'app/router.js', uiDir + 'app/router.js');
        this.template(uiDir + 'app/_index.html', uiDir + 'app/index.html');
        this.template(uiDir + 'app/_app.js', uiDir + 'app/app.js');
        this.copy(uiDir + 'app/views/.gitkeep', uiDir + 'app/views/.gitkeep');
        this.copy(uiDir + 'app/utils/.gitkeep', uiDir + 'app/utils/.gitkeep');
        this.template(uiDir + 'app/templates/_navigation.hbs', uiDir + 'app/templates/navigation.hbs');
        this.copy(uiDir + 'app/templates/application.hbs', uiDir + 'app/templates/application.hbs');
        this.copy(uiDir + 'app/templates/index.hbs', uiDir + 'app/templates/index.hbs');
        this.copy(uiDir + 'app/templates/login.hbs', uiDir + 'app/templates/login.hbs');
        this.directory(uiDir + 'app/templates/loggers', uiDir + 'app/templates/loggers');
        this.directory(uiDir + 'app/templates/audit-events', uiDir + 'app/templates/audit-events');
        this.directory(uiDir + 'app/templates/users', uiDir + 'app/templates/users');
        this.directory(uiDir + 'app/styles', uiDir + 'app/styles');
        this.directory(uiDir + 'app/routes', uiDir + 'app/routes');
        this.directory(uiDir + 'app/models', uiDir + 'app/models');
        this.directory(uiDir + 'app/mixins', uiDir + 'app/mixins');
        this.directory(uiDir + 'app/initializers', uiDir + 'app/initializers');
        this.directory(uiDir + 'app/helpers', uiDir + 'app/helpers');
        this.copy(uiDir + 'app/controllers/application.js', uiDir + 'app/controllers/application.js');
        this.copy(uiDir + 'app/controllers/login.js', uiDir + 'app/controllers/login.js');
        this.template(uiDir + 'app/controllers/users/_index.js', uiDir + 'app/controllers/users/index.js');
        this.template(uiDir + 'app/controllers/users/_edit.js', uiDir + 'app/controllers/users/edit.js');
        this.template(uiDir + 'app/controllers/users/_new.js', uiDir + 'app/controllers/users/new.js');
        this.template(uiDir + 'app/controllers/loggers/_index.js', uiDir + 'app/controllers/loggers/index.js');
        this.template(uiDir + 'app/controllers/audit-events/_index.js', uiDir + 'app/controllers/audit-events/index.js');
        this.directory(uiDir + 'app/components', uiDir + 'app/components');
        this.directory(uiDir + 'app/adapters', uiDir + 'app/adapters');
        this.copy(uiDir + 'app/serializers/application.js', uiDir + 'app/serializers/application.js');
        //api-stub filder UI files
        this.directory(uiDir + 'api-stub', uiDir + 'api-stub');
      } else {
        removefolder(uiDir);
      }

      this.config.set('baseName', this.baseName);
      this.config.set('packageName', this.packageName);
      this.config.set('storage', this.storage);
      this.config.set('packageFolder', packageFolder);
      this.config.set('apiOnly', this.apiOnly);
      this.config.set('stormpath', this.stormpath);
  };

  function removefile(file) {
      if (shelljs.test('-f', file)) {
          shelljs.rm(file);
      }
  }

  function removefolder(folder) {
      if (shelljs.test('-d', folder)) {
          shelljs.rm("-rf", folder);
      }
  }
