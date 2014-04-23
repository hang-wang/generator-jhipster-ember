package <%=packageName%>.config.data.populator;

import com.google.common.collect.Lists;
import <%=packageName%>.domain.User;
import <%=packageName%>.repository.UserRepository;
import com.stormpath.sdk.application.Application;
import com.stormpath.sdk.client.Client;
import com.stormpath.sdk.directory.Directory;
import com.stormpath.sdk.group.Group;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 *
 */
@Slf4j
@Component
public class BootstrapDataPopulator implements InitializingBean {

    private static final String ROOT_ACCOUNT_USERNAME = "marissa@koala.test";
    private static final String ROOT_ACCOUNT_PASSWORD = "123Queso@";
    private static final String[] DEFAULT_GROUPS = {"ADMIN", "USER", "ROOT"};

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private Client client;
    @Autowired
    private Application application;

    @Override
    public void afterPropertiesSet() throws Exception {
        log.info("Default user groups created [{}]", createGroups());
        log.info("ROOT user created [{}]", createRootUserAccount());
    }

    private List<String> createGroups() {
        Directory directory = client.getResource(application.getDefaultAccountStore().getHref(), Directory.class);

        List<String> groups = Lists.newArrayList(directory.getGroups().iterator())
                .stream().map(Group::getName).collect(Collectors.toList());

        for (String defaultGroup : DEFAULT_GROUPS) {
            if (!groups.contains(defaultGroup)) {
                Group g = client.instantiate(Group.class);
                g.setName(defaultGroup);
                directory.createGroup(g);
            }
        }

        return groups;
    }

    private User createRootUserAccount() {
        return Optional.of(userRepository.findOne(ROOT_ACCOUNT_USERNAME))
                .orElse(new User(user -> {
                    user.setFirstName("Marissa");
                    user.setLastName("Koala");
                    user.setEmail(ROOT_ACCOUNT_USERNAME);
                    user.setUsername(ROOT_ACCOUNT_USERNAME);
                    user.setPassword(ROOT_ACCOUNT_PASSWORD);
                    user.setGroups(Lists.newArrayList(DEFAULT_GROUPS));
                    userRepository.save(user);
                }));
    }
}
