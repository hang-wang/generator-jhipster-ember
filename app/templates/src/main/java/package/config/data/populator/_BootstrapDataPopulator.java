package <%=packageName%>.config.data.populator;

import com.google.common.collect.Lists;
import <%=packageName%>.domain.User;
import <%=packageName%>.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;<% if (storage == 'postgres') { %>
import org.springframework.context.annotation.DependsOn;<% } %>
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 *
 */
@Slf4j
@Component<% if (storage == 'postgres') { %>
@DependsOn("liquibase")<% } %>
public class BootstrapDataPopulator implements InitializingBean {

    private static final String ROOT_ACCOUNT_USERNAME = "marissa@koala.test";
    private static final String SSH_ROOT_ACCOUNT_USERNAME = "sshadmin";
    private static final String ROOT_ACCOUNT_PASSWORD = "123Queso@";
    private static final String[] DEFAULT_GROUPS = {"ADMIN", "USER", "ROOT"};

    @Autowired
    private UserRepository userRepository;

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("ROOT user created [{}]", createRootUserAccount());
        log.info("SSH user created [{}]", createRootSSHUserAccount());
    }

    private User createRootSSHUserAccount() {
        return userRepository.save(Optional.ofNullable(userRepository.findByUsername(SSH_ROOT_ACCOUNT_USERNAME))
                .orElse(new User(user -> {
                    user.setFirstName("SSH");
                    user.setLastName("ADMIN");
                    user.setEmail(SSH_ROOT_ACCOUNT_USERNAME);
                    user.setUsername(SSH_ROOT_ACCOUNT_USERNAME);
                    user.setPassword(ROOT_ACCOUNT_PASSWORD);
                    user.setPasswordConfirm(ROOT_ACCOUNT_PASSWORD);
                    user.setEncodePassword(true);
                    user.setGroups(Lists.newArrayList("SSH"));
                })));
    }

    private User createRootUserAccount() {
        return userRepository.save(Optional.ofNullable(userRepository.findByUsername(ROOT_ACCOUNT_USERNAME))
                .orElse(new User(user -> {
                    user.setFirstName("Marissa");
                    user.setLastName("Koala");
                    user.setEmail(ROOT_ACCOUNT_USERNAME);
                    user.setUsername(ROOT_ACCOUNT_USERNAME);
                    user.setPassword(ROOT_ACCOUNT_PASSWORD);
                    user.setPasswordConfirm(ROOT_ACCOUNT_PASSWORD);
                    user.setEncodePassword(true);
                    user.setGroups(Lists.newArrayList(DEFAULT_GROUPS));
                })));
    }
}
