package org.example.salaryslip.repository;

import org.example.salaryslip.model.SalarySlip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalarySlipRepository extends MongoRepository<SalarySlip, String> {
    Optional<SalarySlip> findByEmployeeIdAndMonth(String employeeId, String month);

    List<SalarySlip> findAllByEmployeeIdAndMonth(String employeeId, String month);

}
