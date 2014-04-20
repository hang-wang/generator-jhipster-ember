package <%=packageName%>.security.mongodb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 *
 */
@Data
@Document
public class OauthCode {
    @Id
    private String code;
    private byte[] authentication;
}
