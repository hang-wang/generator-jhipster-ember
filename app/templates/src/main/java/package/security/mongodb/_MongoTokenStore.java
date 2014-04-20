package <%=packageName%>.security.mongodb;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;
import org.springframework.security.oauth2.common.util.SerializationUtils;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.AuthenticationKeyGenerator;
import org.springframework.security.oauth2.provider.token.DefaultAuthenticationKeyGenerator;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 */
@Slf4j
@Component
public class MongoTokenStore implements TokenStore {
    @Autowired
    private OauthAccessTokenRepository oauthAccessTokenRepository;
    @Autowired
    private OauthRefreshTokenRepository oauthRefreshTokenRepository;

    private AuthenticationKeyGenerator authenticationKeyGenerator = new DefaultAuthenticationKeyGenerator();

    @Override
    public OAuth2AccessToken getAccessToken(OAuth2Authentication authentication) {
        OAuth2AccessToken accessToken = null;

        String key = authenticationKeyGenerator.extractKey(authentication);
        try {
            OauthAccessToken oauthAccessToken = oauthAccessTokenRepository.findByAuthenticationId(key);
            if (oauthAccessToken == null) {
                throw new EmptyResultDataAccessException(1);
            }
            accessToken = deserializeAccessToken(oauthAccessToken.getToken());
        } catch (EmptyResultDataAccessException e) {
            if (log.isInfoEnabled()) {
                log.debug("Failed to find access token for authentication " + authentication);
            }
        } catch (IllegalArgumentException e) {
            log.error("Could not extract access token for authentication " + authentication, e);
        }

        if (accessToken != null
                && !key.equals(authenticationKeyGenerator.extractKey(readAuthentication(accessToken.getValue())))) {
            removeAccessToken(accessToken.getValue());
            // Keep the store consistent (maybe the same user is represented by this authentication but the details have
            // changed)
            storeAccessToken(accessToken, authentication);
        }
        return accessToken;
    }

    @Override
    public void storeAccessToken(OAuth2AccessToken token, OAuth2Authentication authentication) {
        String refreshToken = null;
        if (token.getRefreshToken() != null) {
            refreshToken = token.getRefreshToken().getValue();
        }

        OauthAccessToken oauthAccessToken = new OauthAccessToken();
        oauthAccessToken.setTokenId(extractTokenKey(token.getValue()));
        oauthAccessToken.setToken(serializeAccessToken(token));
        oauthAccessToken.setAuthenticationId(authenticationKeyGenerator.extractKey(authentication));
        oauthAccessToken.setUsername(authentication.isClientOnly() ? null : authentication.getName());
        oauthAccessToken.setClientId(authentication.getOAuth2Request().getClientId());
        oauthAccessToken.setAuthentication(serializeAuthentication(authentication));
        oauthAccessToken.setRefreshToken(extractTokenKey(refreshToken));

        oauthAccessTokenRepository.save(oauthAccessToken);
    }

    @Override
    public OAuth2AccessToken readAccessToken(String tokenValue) {
        OAuth2AccessToken accessToken = null;

        try {
            OauthAccessToken oauthAccessToken = oauthAccessTokenRepository.findOne(extractTokenKey(tokenValue));
            if (oauthAccessToken == null) {
                throw new EmptyResultDataAccessException(1);
            }
            accessToken = deserializeAccessToken(oauthAccessToken.getToken());
        } catch (EmptyResultDataAccessException e) {
            if (log.isInfoEnabled()) {
                log.info("Failed to find access token for token " + tokenValue);
            }
        } catch (IllegalArgumentException e) {
            log.warn("Failed to deserialize access token for " + tokenValue, e);
            removeAccessToken(tokenValue);
        }

        return accessToken;
    }

    @Override
    public void removeAccessToken(OAuth2AccessToken token) {
        removeAccessToken(token.getValue());
    }

    public void removeAccessToken(String tokenValue) {
        oauthAccessTokenRepository.delete(extractTokenKey(tokenValue));
    }

    @Override
    public OAuth2Authentication readAuthentication(OAuth2AccessToken token) {
        return readAuthentication(token.getValue());
    }

    @Override
    public OAuth2Authentication readAuthentication(String token) {
        OAuth2Authentication authentication = null;

        try {
            OauthAccessToken oauthAccessToken = oauthAccessTokenRepository.findOne(extractTokenKey(token));
            if(oauthAccessToken == null) {
                throw new EmptyResultDataAccessException(1);
            }
            authentication = deserializeAuthentication(oauthAccessToken.getAuthentication());
        } catch (EmptyResultDataAccessException e) {
            if (log.isInfoEnabled()) {
                log.info("Failed to find access token for token " + token);
            }
        } catch (IllegalArgumentException e) {
            log.warn("Failed to deserialize authentication for " + token, e);
            removeAccessToken(token);
        }

        return authentication;
    }

    @Override
    public void storeRefreshToken(OAuth2RefreshToken refreshToken, OAuth2Authentication authentication) {
        OauthRefreshToken oauthRefreshToken = new OauthRefreshToken();
        oauthRefreshToken.setTokenId(extractTokenKey(refreshToken.getValue()));
        oauthRefreshToken.setToken(serializeRefreshToken(refreshToken));
        oauthRefreshToken.setAuthentication(serializeAuthentication(authentication));
        oauthRefreshTokenRepository.save(oauthRefreshToken);
    }

    @Override
    public OAuth2RefreshToken readRefreshToken(String token) {
        OAuth2RefreshToken refreshToken = null;

        try {
            OauthRefreshToken oauthRefreshToken = oauthRefreshTokenRepository.findOne(extractTokenKey(token));
            if(oauthRefreshToken == null) {
                throw new EmptyResultDataAccessException(1);
            }
            refreshToken = deserializeRefreshToken(oauthRefreshToken.getToken());
        } catch (EmptyResultDataAccessException e) {
            if (log.isInfoEnabled()) {
                log.info("Failed to find refresh token for token " + token);
            }
        } catch (IllegalArgumentException e) {
            log.warn("Failed to deserialize refresh token for token " + token, e);
            removeRefreshToken(token);
        }

        return refreshToken;
    }

    @Override
    public void removeRefreshToken(OAuth2RefreshToken token) {
        removeRefreshToken(token.getValue());
    }

    public void removeRefreshToken(String token) {
        oauthRefreshTokenRepository.delete(extractTokenKey(token));
    }

    @Override
    public OAuth2Authentication readAuthenticationForRefreshToken(OAuth2RefreshToken token) {
        return readAuthenticationForRefreshToken(token.getValue());
    }

    public OAuth2Authentication readAuthenticationForRefreshToken(String value) {
        OAuth2Authentication authentication = null;

        try {
            OauthRefreshToken oauthRefreshToken = oauthRefreshTokenRepository.findOne(extractTokenKey(value));
            if(oauthRefreshToken == null) {
                throw new EmptyResultDataAccessException(1);
            }
            authentication = deserializeAuthentication(oauthRefreshToken.getAuthentication());
        } catch (EmptyResultDataAccessException e) {
            if (log.isInfoEnabled()) {
                log.info("Failed to find access token for token " + value);
            }
        } catch (IllegalArgumentException e) {
            log.warn("Failed to deserialize access token for " + value, e);
            removeRefreshToken(value);
        }

        return authentication;
    }

    @Override
    public void removeAccessTokenUsingRefreshToken(OAuth2RefreshToken refreshToken) {
        removeAccessTokenUsingRefreshToken(refreshToken.getValue());
    }

    public void removeAccessTokenUsingRefreshToken(String refreshToken) {
        OauthAccessToken oauthAccessToken = oauthAccessTokenRepository.findByRefreshToken(extractTokenKey(refreshToken));
        oauthAccessTokenRepository.delete(oauthAccessToken);
    }

    @Override
    public Collection<OAuth2AccessToken> findTokensByClientId(String clientId) {
        try {
            return removeNulls(oauthAccessTokenRepository.findByClientId(clientId).stream()
                    .map(oauthAccessToken -> deserializeAccessToken(oauthAccessToken.getToken())).collect(Collectors.toList()));
        } catch (EmptyResultDataAccessException e) {
            if (log.isInfoEnabled()) {
                log.info("Failed to find access token for clientId " + clientId);
            }
        }

        return new ArrayList<>();
    }

    @Override
    public Collection<OAuth2AccessToken> findTokensByClientIdAndUserName(String clientId, String username) {
        try {
            return removeNulls(oauthAccessTokenRepository.findByClientIdAndUsername(clientId, username).stream()
                    .map(oauthAccessToken -> deserializeAccessToken(oauthAccessToken.getToken())).collect(Collectors.toList()));
        } catch (EmptyResultDataAccessException e) {
            if (log.isInfoEnabled()) {
                log.info("Failed to find access token for userName " + username + " and clientId " + clientId);
            }
        }

        return new ArrayList<>();
    }

    private List<OAuth2AccessToken> removeNulls(List<OAuth2AccessToken> accessTokens) {
        return accessTokens.stream().filter(token -> token != null).map(token -> token).collect(Collectors.toList());
    }

    protected String extractTokenKey(String value) {
        if (value == null) {
            return null;
        }
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("MD5 algorithm not available.  Fatal (should be in the JDK).");
        }

        try {
            byte[] bytes = digest.digest(value.getBytes("UTF-8"));
            return String.format("%032x", new BigInteger(1, bytes));
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("UTF-8 encoding not available.  Fatal (should be in the JDK).");
        }
    }

    protected byte[] serializeAccessToken(OAuth2AccessToken token) {
        return SerializationUtils.serialize(token);
    }

    protected byte[] serializeRefreshToken(OAuth2RefreshToken token) {
        return SerializationUtils.serialize(token);
    }

    protected byte[] serializeAuthentication(OAuth2Authentication authentication) {
        return SerializationUtils.serialize(authentication);
    }

    protected OAuth2AccessToken deserializeAccessToken(byte[] token) {
        return SerializationUtils.deserialize(token);
    }

    protected OAuth2RefreshToken deserializeRefreshToken(byte[] token) {
        return SerializationUtils.deserialize(token);
    }

    protected OAuth2Authentication deserializeAuthentication(byte[] authentication) {
        return SerializationUtils.deserialize(authentication);
    }
}
