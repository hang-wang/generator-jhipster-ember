package <%=packageName%>.config;

import <%=packageName%>.security.CustomTokenEnhancer;<% if (storage == 'mongo') { %>
import com.mycompany.myapp.security.mongodb.MongoTokenStore;<% } %>
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;<% if (storage == 'postgres') { %>
import org.springframework.context.annotation.DependsOn;<% } %>
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.http.converter.jaxb.JaxbOAuth2ExceptionMessageConverter;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.error.DefaultOAuth2ExceptionRenderer;
import org.springframework.security.oauth2.provider.error.OAuth2AccessDeniedHandler;
import org.springframework.security.oauth2.provider.error.OAuth2AuthenticationEntryPoint;
import org.springframework.security.oauth2.provider.token.*;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.web.client.RestTemplate;
<% if (storage == 'postgres') { %>
import javax.sql.DataSource;<% } %>
import java.util.ArrayList;
import java.util.List;

import static com.google.common.collect.Lists.newArrayList;

/**
 *
 */
@Configuration
public class OAuth2ServerConfig  {
    private static final String RESOURCE_ID = "<%=baseName%>";

    @Configuration
    @EnableResourceServer
    protected static class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
        @Autowired
        private OAuth2AuthenticationEntryPoint oAuth2AuthenticationEntryPoint;

        @Override
        public void configure(ResourceServerSecurityConfigurer resources) {
            resources.resourceId(RESOURCE_ID);
        }

        @Override
        public void configure(HttpSecurity http) throws Exception {
            //@formatter:off
            http.authorizeRequests()
                    .antMatchers("/env").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN') or #oauth2.hasScope('read')")
                    .antMatchers("/trace").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN') or #oauth2.hasScope('read')")
                    .antMatchers("/dump").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN') or #oauth2.hasScope('read')")
                    .antMatchers("/beans").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN') or #oauth2.hasScope('read')")
                    .antMatchers("/metrics").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN') or #oauth2.hasScope('read')")
                    .antMatchers("/shutdown").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN') or #oauth2.hasScope('read')")
                    .antMatchers("/api/v1/loggers/**").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN,ROOT') or #oauth2.hasScope('read_write')")
                    .antMatchers("/api/v1/auditEvents/**").access("#oauth2.denyOAuthClient() and hasRole('USER,ADMIN,ROOT') or #oauth2.hasScope('read_write')")
                    .antMatchers("/api/v1/**").access("#oauth2.denyOAuthClient() and hasRole('USER') or #oauth2.hasScope('read_write')")
                .and()
                    .exceptionHandling().authenticationEntryPoint(oAuth2AuthenticationEntryPoint)
                .and()
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.NEVER);
             //@formatter:on
        }
    }

    @Configuration
    @EnableAuthorizationServer<% if (storage == 'postgres') { %>
    @DependsOn("liquibase")<% } %>
    protected static class AuthorizationServerConfiguration extends AuthorizationServerConfigurerAdapter {<% if (storage == 'postgres') { %>
        @Autowired
        private DataSource dataSource;<% } %>

        @Autowired
        @Qualifier("authenticationManagerBean")
        private AuthenticationManager authenticationManager;

        @Autowired
        private ClientDetailsService clientDetailsService;

        @Autowired
        private MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter;

        @Value("<%= _.unescape('\$\{jwt.token.signingKey}')%>")
        private String jwtTokenSigningKey;
        @Value("<%= _.unescape('\$\{jwt.token.verificationKey}')%>")
        private String jwtTokenVerificationKey;

        @Override
        public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
            clients.inMemory().withClient("web")
                    .resourceIds(RESOURCE_ID)
                    .authorizedGrantTypes("password", "authorization_code", "implicit")
                    .scopes("read_write", "read", "write");
        }

        @Bean
        public AuthorizationServerTokenServices tokenServices() {
            final DefaultTokenServices tokenServices = new DefaultTokenServices();

            TokenEnhancerChain accessTokenEnhancer = new TokenEnhancerChain();
            accessTokenEnhancer.setTokenEnhancers(newArrayList(new CustomTokenEnhancer(), jwtTokenEnhancer()));
            tokenServices.setTokenEnhancer(accessTokenEnhancer);
            tokenServices.setTokenStore(tokenStore());
            tokenServices.setClientDetailsService(clientDetailsService);
            tokenServices.setSupportRefreshToken(true);

            return tokenServices;
        }

        @Bean
        public JwtAccessTokenConverter jwtTokenEnhancer() {
            JwtAccessTokenConverter tokenEnhancer = new JwtAccessTokenConverter();

            tokenEnhancer.setSigningKey(jwtTokenSigningKey);
            tokenEnhancer.setVerifierKey(jwtTokenVerificationKey);

            return tokenEnhancer;
        }

        @Bean
        public OAuth2AccessDeniedHandler oAuth2AccessDeniedHandler() {
            OAuth2AccessDeniedHandler oAuth2AccessDeniedHandler = new OAuth2AccessDeniedHandler();
            oAuth2AccessDeniedHandler.setExceptionRenderer(defaultOAuth2ExceptionRenderer());
            return oAuth2AccessDeniedHandler;
        }

        @Bean
        public DefaultOAuth2ExceptionRenderer defaultOAuth2ExceptionRenderer() {
            List<HttpMessageConverter<?>> result = new ArrayList<>();
            result.add(mappingJackson2HttpMessageConverter);
            result.addAll(new RestTemplate().getMessageConverters());
            result.add(new JaxbOAuth2ExceptionMessageConverter());

            DefaultOAuth2ExceptionRenderer defaultOAuth2ExceptionRenderer = new DefaultOAuth2ExceptionRenderer();
            defaultOAuth2ExceptionRenderer.setMessageConverters(result);
            return defaultOAuth2ExceptionRenderer;
        }

        @Bean
        public OAuth2AuthenticationEntryPoint oAuth2AuthenticationEntryPoint() {
            OAuth2AuthenticationEntryPoint oAuth2AuthenticationEntryPoint = new OAuth2AuthenticationEntryPoint();
            oAuth2AuthenticationEntryPoint.setExceptionRenderer(defaultOAuth2ExceptionRenderer());
            return oAuth2AuthenticationEntryPoint;
        }

        @Bean
        public TokenStore tokenStore() {<% if (storage == 'postgres') { %>
            return new JdbcTokenStore(dataSource);<% } %><% if (storage == 'mongo') { %>
            return new MongoTokenStore();<% } %>
        }

        @Override
        public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
            endpoints
                    .tokenStore(tokenStore())
                    .tokenServices(tokenServices())
                    .authenticationManager(authenticationManager);
        }

        @Override
        public void configure(AuthorizationServerSecurityConfigurer oauthServer) throws Exception {
            oauthServer
                    .authenticationEntryPoint(oAuth2AuthenticationEntryPoint())
                    .realm("<%=baseName%>/client");
        }
    }
}
