package <%=packageName%>.domain.util;

import <%=packageName%>.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class UserPasswordEncoderListener extends AbstractMongoEventListener<User> {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void onBeforeConvert(User source) {
        super.onBeforeConvert(source);

        if(source.getEncodePassword()) {
            source.setPassword(passwordEncoder.encode(source.getPassword()));
            source.setPasswordConfirm(source.getPassword());
        }
    }
}
