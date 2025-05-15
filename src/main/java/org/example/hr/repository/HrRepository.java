package org.example.hr.repository;

import org.example.hr.model.Hr;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HrRepository extends MongoRepository<Hr, String> {
}
