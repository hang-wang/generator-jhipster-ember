package <%=packageName%>.repository;

import <%=packageName%>.domain.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 *
 */
public interface UserRepository extends MongoRepository<User, ObjectId> {
  User findByUsername(String username);
}
