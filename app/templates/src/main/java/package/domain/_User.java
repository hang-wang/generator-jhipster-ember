package <%=packageName%>.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import <%=packageName%>.domain.util.EntityWrapper;
import com.stormpath.sdk.account.Account;
import com.stormpath.sdk.group.Group;
import lombok.Data;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 *
 */
@Data
public class User implements Resource<String> {
    private String id;
    private String name;
    private String email;
    private String password;
    private List<String> groups = new ArrayList<>();

    public User() {
    }

    public User(String username, String name, String email) {
        this.id = username;
        this.name = name;
        this.email = email;
    }

    public User(Account account) {
        this.id = account.getUsername();
        this.name = account.getFullName();
        this.email = account.getEmail();

        for (Group group : account.getGroups()) {
            groups.add(group.getName());
        }
    }

    @Data
    public static class UserWrapper implements EntityWrapper<User> {
        @Valid
        private User user;

        public UserWrapper() {
        }

        public UserWrapper(User user) {
            this.user = user;
        }

        @JsonIgnore
        @Override
        public User getEntity() {
            return user;
        }
    }
}
