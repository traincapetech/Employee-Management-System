package org.example.employee.repository;

import org.example.employee.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
    boolean existsByEmail(String email);

    List<Employee> findByHrId(String hrId);

}
