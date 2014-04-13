package <%=packageName%>.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import <%=packageName%>.domain.util.EntityWrapper;
import de.malkusch.validation.constraints.EqualProperties;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.Size;
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
@EqualProperties(value = {"password", "passwordConfirm"}, violationOnPropery = true)
public class User extends Base implements Resource<UUID>, UserDetails {
    @NotBlank
    private String username;
    @NotBlank
    @Column(name = "first_name")
    private String firstName;
    @NotBlank
    @Column(name = "last_name")
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
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "users_groups", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "[group]")
    private List<String> groups = new ArrayList<>();
    private Boolean expired = false;
    private Boolean locked = false;
    @Column(name = "credentials_expired")
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

    @PrePersist
    @PreUpdate
    public void encodePassword() {
        if (encodePassword) {
            this.password = new BCryptPasswordEncoder().encode(this.password);
            this.passwordConfirm = this.password;
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
