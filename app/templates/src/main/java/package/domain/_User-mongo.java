package <%=packageName%>.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import <%=packageName%>.domain.util.EntityWrapper;
import de.malkusch.validation.constraints.EqualProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.NotBlank;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.Valid;
import javax.validation.constraints.Size;
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
@EqualProperties(value = {"password", "passwordConfirm"}, violationOnPropery = true)
public class User extends Base implements Resource<ObjectId>, UserDetails {
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
    @Transient
    private String passwordConfirm;
    private List<String> groups = new ArrayList<>();
    private Boolean expired = false;
    private Boolean locked = false;
    private Boolean credentialsExpired = false;
    private Boolean enable = true;
    @Transient
    private Boolean encodePassword = false;

    public User() {
    }

    public User(String username, String firstName, String lastName, String email) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    @JsonIgnore
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
