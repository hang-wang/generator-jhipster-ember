package <%=packageName%>.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import <%=packageName%>.domain.util.EntityWrapper;
import com.stormpath.sdk.account.Account;
import com.stormpath.sdk.group.Group;
import de.malkusch.validation.constraints.EqualProperties;
import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 *
 */
@Data
@EqualProperties(value = {"password", "passwordConfirm"}, violationOnPropery = true)
public class User implements Resource<String>, UserDetails {
    private String id;
    @NotBlank
    private String username;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 8)
    @JsonIgnore
    private String password;
    @JsonIgnore
    private String passwordConfirm;
    private List<String> groups = new ArrayList<>();
    private Boolean expired = false;
    private Boolean locked = false;
    private Boolean credentialsExpired = false;
    private Boolean enable = true;

    public User() {
    }

    public User(Consumer<User> with) {
      with.accept(this);
    }

    public User(Account account) {
        this.id = account.getUsername();
        this.firstName = account.getGivenName();
        this.lastName = account.getSurname();
        this.email = account.getEmail();
        switch (account.getStatus()) {
            case DISABLED:
                this.enable = false;
                break;
            case ENABLED:
                this.enable = true;
                break;
            case UNVERIFIED:
                this.locked = true;
                break;
        }

        for (Group group : account.getGroups()) {
            groups.add(group.getName());
        }
    }

    public String getName() {
        return this.firstName + " " + this.lastName;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return groups.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return !this.expired;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return !this.locked;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return !this.credentialsExpired;
    }

    @Override
    @JsonIgnore
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
