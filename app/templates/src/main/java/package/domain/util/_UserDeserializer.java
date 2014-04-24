package <%=packageName%>.domain.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import <%=packageName%>.domain.User;
import <%=packageName%>.repository.UserRepository;
import org.apache.commons.lang.StringUtils;<% if (storage == 'mongo' && stormpath == 'no') { %>
import org.bson.types.ObjectId;<% } %>
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;<% if (storage == 'postgres' && stormpath == 'no') { %>
import java.util.UUID;<% } %>
import java.util.function.Function;

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

        if (userDataNode.get("id") != null && StringUtils.isNotBlank(nullCheck(userDataNode.get("id"), JsonNode::asText))) {<% if (storage == 'postgres' && stormpath == 'no') { %>
            u = userRepository.findOne(UUID.fromString(userDataNode.get("id").asText()));<% } %><%if (storage == 'mongo' && stormpath == 'no') { %>
            u = userRepository.findOne(new ObjectId(userDataNode.get("id").asText()));<% } %><% if (stormpath == 'yes') { %>
            u = userRepository.findOne(userDataNode.get("id").asText());<% } %>
        }

        u.setEmail(nullCheck(userDataNode.get("email"), JsonNode::asText));
        if (userDataNode.get("username") == null) {
            u.setUsername(u.getEmail());
        } else {
            u.setUsername(nullCheck(userDataNode.get("username"), JsonNode::asText));
        }
        u.setFirstName(nullCheck(userDataNode.get("firstName"), JsonNode::asText));
        u.setLastName(nullCheck(userDataNode.get("lastName"), JsonNode::asText));
        u.setCredentialsExpired(nullCheck(userDataNode.get("credentialsExpired"), JsonNode::asBoolean));
        u.setEnable(nullCheck(userDataNode.get("enable"), JsonNode::asBoolean));
        u.setExpired(nullCheck(userDataNode.get("expired"), JsonNode::asBoolean));
        u.setLocked(nullCheck(userDataNode.get("locked"), JsonNode::asBoolean));

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

        String password = nullCheck(userDataNode.get("password"), JsonNode::asText);
        if (password != null) {
            u.setPassword(password);<% if (stormpath == 'no') { %>
            u.setEncodePassword(true);<% } %>
            if (userDataNode.get("passwordConfirm") != null) {
                u.setPasswordConfirm(nullCheck(userDataNode.get("passwordConfirm"), JsonNode::asText));
            }
        } else {
            u.setPasswordConfirm(u.getPassword());
        }

        return u;
    }

    private <R> R nullCheck(JsonNode jsonNode, Function<JsonNode, R> function) {
        return jsonNode.isNull() ? null : function.apply(jsonNode);
    }
}
