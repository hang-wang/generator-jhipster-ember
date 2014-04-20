package <%=packageName%>.security.mongodb;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 *
 */
public interface OauthRefreshTokenRepository extends MongoRepository<OauthRefreshToken, String> {
}
