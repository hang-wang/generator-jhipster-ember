package <%=packageName%>.repository;

import com.google.common.collect.Iterators;
import <%=packageName%>.domain.User;
import com.stormpath.sdk.account.Account;
import com.stormpath.sdk.account.AccountCriteria;
import com.stormpath.sdk.account.AccountList;
import com.stormpath.sdk.account.Accounts;
import com.stormpath.sdk.application.Application;
import com.stormpath.sdk.client.Client;
import com.stormpath.sdk.directory.Directory;
import com.stormpath.sdk.group.Group;
import com.stormpath.sdk.group.GroupList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

/**
 *
 */
@Repository
@SuppressWarnings("unchecked")
public class UserRepository implements PagingAndSortingRepository<User, String> {
    @Autowired
    private Application application;
    @Autowired
    private Client client;

    @Override
    public Iterable<User> findAll(Sort sort) {
        return null;
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        List<User> users = new ArrayList<>();

        Long count = count();

        AccountList accounts = application.getAccounts(Accounts.criteria().offsetBy(pageable.getOffset()).limitTo(pageable.getPageSize()));

        for (Account account : accounts) {
            users.add(new User(account));
        }

        return new PageImpl<>(users, pageable, count);
    }

    @Override
    public User save(User entity) {
        Assert.notNull(entity, "Entity must not be null!");

        Account c = client.instantiate(Account.class);
        c.setEmail(entity.getEmail());
        c.setUsername(entity.getId());
        c.setGivenName(entity.getName());
        c.setPassword(entity.getPassword());

        Directory directory = client.getResource(application.getDefaultAccountStore().getHref(), Directory.class);

        GroupList groups = directory.getGroups();

        for (Group group : groups) {
            if (entity.getGroups().contains(group.getName())) {
                c.addGroup(group);
            }
        }

        directory.createAccount(c);

        return new User(c);
    }

    @Override
    public <S extends User> Iterable<S> save(Iterable<S> entities) {
        Assert.notNull(entities, "The given Iterable of entities not be null!");

        List<User> users = new ArrayList<>();

        for (User entity : entities) {
            users.add(save(entity));
        }

        return (Iterable<S>) users;
    }

    @Override
    public User findOne(String id) {
        Assert.notNull(id, "The given id must not be null!");

        Account account = findAccountByUsername(id);

        return new User(account);
    }

    @Override
    public boolean exists(String id) {
        return findOne(id) != null;
    }

    @Override
    public Iterable<User> findAll() {
        List<User> users = new ArrayList<>();
        for (Account account : application.getAccounts()) {
            users.add(new User(account));
        }
        return users;
    }

    @Override
    public Iterable<User> findAll(Iterable<String> strings) {
        return null;
    }

    @Override
    public long count() {
        return Iterators.size(application.getAccounts().iterator());
    }

    @Override
    public void delete(String id) {
        Assert.notNull(id, "The given id must not be null!");

        findAccountByUsername(id).delete();
    }

    @Override
    public void delete(User entity) {
        Assert.notNull(entity, "The given entity must not be null!");

        delete(entity.getId());
    }

    @Override
    public void delete(Iterable<? extends User> entities) {
        Assert.notNull(entities, "The given Iterable of entities not be null!");

        entities.forEach(this::delete);
    }

    @Override
    public void deleteAll() {

    }

    private Account findAccountByUsername(String username) {
        AccountCriteria criteria = Accounts.where(Accounts.username().eqIgnoreCase(username));
        AccountList accounts = application.getAccounts(criteria);
        Account account = null;
        for (Account acc : accounts) {
            account = acc;
        }
        return account;
    }
}
