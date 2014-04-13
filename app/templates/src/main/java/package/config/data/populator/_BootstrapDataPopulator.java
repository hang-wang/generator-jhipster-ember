package <%=packageName%>.config.data.populator;

import com.google.common.collect.Lists;
import <%=packageName%>.domain.User;
import <%=packageName%>.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;<% if (storage == 'postgres') { %>
import org.springframework.context.annotation.DependsOn;<% } %>
import org.springframework.stereotype.Component;

/**
 *
 */
@Slf4j
@Component<% if (storage == 'postgresql') { %>
@DependsOn("liquibase")<% } %>
public class BootstrapDataPopulator implements InitializingBean {

    private static final String ROOT_ACCOUNT_USERNAME = "marissa@koala.test";
    private static final String ROOT_ACCOUNT_PASSWORD = "123Queso@";
    private static final String[] DEFAULT_GROUPS = {"ADMIN", "USER", "ROOT"};

    @Autowired
    private UserRepository userRepository;

    @Override
    public void afterPropertiesSet() throws Exception {
        createRootUserAccount();
    }

    private void createRootUserAccount() {
        //Check if exists
        User u = userRepository.findByUsername(ROOT_ACCOUNT_USERNAME);

        if (u == null) {
            u = new User(ROOT_ACCOUNT_USERNAME, "Marissa", "Koala", ROOT_ACCOUNT_USERNAME);
            u.setPassword(ROOT_ACCOUNT_PASSWORD);
            u.setPasswordConfirm(ROOT_ACCOUNT_PASSWORD);
            u.setEncodePassword(true);
            u.setGroups(Lists.newArrayList(DEFAULT_GROUPS));
            userRepository.save(u);
        }
    }
}
