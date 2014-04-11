package <%=packageName%>.security;
<% if (stormpath === 'no') { %>
import <%=packageName%>.domain.User;<% } %>
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 *
 */
public class CustomTokenEnhancer implements TokenEnhancer {
    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        DefaultOAuth2AccessToken result = new DefaultOAuth2AccessToken(accessToken);
        Map<String, Object> info = new HashMap<>();
        info.put("username", userDetails.getUsername());<% if (stormpath === 'no') { %>
        info.put("id", ((User) userDetails).getId());<% } %><% if (stormpath === 'yes') { %>
        info.put("id", userDetails.getUsername());<% } %>
        Set<String> roles = userDetails.getAuthorities().stream().filter(grantedAuthority -> !grantedAuthority.getAuthority().startsWith("http")).map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
        info.put("roles", roles);

        result.setAdditionalInformation(info);
        return result;
    }
}
