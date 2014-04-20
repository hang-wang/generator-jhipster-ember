package <%=packageName%>.security.mongodb;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 *
 */
public interface OauthAccessTokenRepository extends MongoRepository<OauthAccessToken, String> {
    OauthAccessToken findByAuthenticationId(String authenticationId);
    OauthAccessToken findByRefreshToken(String refreshToken);
    List<OauthAccessToken> findByClientIdAndUsername(String clientId, String username);
    List<OauthAccessToken> findByClientId(String clientId);
}
