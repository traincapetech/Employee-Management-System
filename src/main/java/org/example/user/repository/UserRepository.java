package org.example.user.repository;

import org.example.user.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByReferenceIdAndRole(String referenceId, String role);

    Optional<User> findByUsername(String username);
}
