package <%=packageName%>.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import <%=packageName%>.domain.util.EntityWrapper;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Document
public class User extends Base implements Resource<ObjectId>, UserDetails {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private List<String> groups = new ArrayList<>();
    private Boolean expired = false;
    private Boolean locked = false;
    private Boolean credentialsExpired = false;
    private Boolean enable = true;

    public User() {
    }

    public User(String username, String firstName, String lastName, String email) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getName() {
        return this.firstName + " " + this.lastName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return groups.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !this.expired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !this.credentialsExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.enable;
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
