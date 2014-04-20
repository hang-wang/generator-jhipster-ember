package <%=packageName%>.security.mongodb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 *
 */
@Data
@Document
public class OauthAccessToken {
    @Id
    private String tokenId;
    private byte[] token;
    private String authenticationId;
    private String username;
    private String clientId;
    private byte[] authentication;
    private String refreshToken;
}
