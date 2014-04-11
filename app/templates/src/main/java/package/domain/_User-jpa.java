package <%=packageName%>.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import <%=packageName%>.domain.util.EntityWrapper;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
public class User extends Base implements Resource<UUID>, UserDetails {
    private String username;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    private String email;
    private String password;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "users_groups", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "[group]")
    private List<String> groups = new ArrayList<>();
    private Boolean expired = false;
    private Boolean locked = false;
    @Column(name = "credentials_expired")
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
