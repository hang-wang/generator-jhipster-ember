package <%=packageName%>.domain.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import <%=packageName%>.domain.User;
import <%=packageName%>.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 *
 */
@Component
public class UserDeserializer extends JsonDeserializer<User> {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        ObjectCodec codec = jp.getCodec();
        JsonNode userDataNode = codec.readTree(jp);

        User u = new User();

        if (userDataNode.get("id") != null) {
            u = userRepository.findOne(UUID.fromString(userDataNode.get("id").asText()));
        }

        u.setEmail(userDataNode.get("email").asText());
        u.setUsername(userDataNode.get("username").asText());
        u.setFirstName(userDataNode.get("firstName").asText());
        u.setLastName(userDataNode.get("lastName").asText());
        u.setCredentialsExpired(userDataNode.get("credentialsExpired").asBoolean());
        u.setEnable(userDataNode.get("enable").asBoolean());
        u.setExpired(userDataNode.get("expired").asBoolean());
        u.setLocked(userDataNode.get("locked").asBoolean());

        JsonNode groupsArrayJsonNode = userDataNode.get("groups");
        if (groupsArrayJsonNode != null) {
            if (groupsArrayJsonNode.isArray()) {
                for (final JsonNode group : groupsArrayJsonNode) {
                    if (!u.getGroups().contains(group.asText())) {
                        u.getGroups().add(group.asText());
                    }
                }
            }
        }

        if (userDataNode.get("password") != null) {
            u.setPassword(userDataNode.get("password").asText());
            u.setEncodePassword(true);
            if (userDataNode.get("passwordConfirm") != null) {
                u.setPasswordConfirm(userDataNode.get("passwordConfirm").asText());
            }
        } else {
            u.setPasswordConfirm(u.getPassword());
        }

        return u;
    }
}
