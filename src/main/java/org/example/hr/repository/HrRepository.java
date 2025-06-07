package org.example.hr.repository;

import org.example.hr.model.Hr;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HrRepository extends MongoRepository<Hr, String> {
    List<Hr> findByReferredByAdminId(String adminId);
}
