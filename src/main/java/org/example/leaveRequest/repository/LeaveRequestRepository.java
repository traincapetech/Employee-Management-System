package org.example.leaveRequest.repository;

import org.example.leaveRequest.model.LeaveRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {
    List<LeaveRequest> findByHrId(String hrId);
    List<LeaveRequest> findByEmployeeId(String employeeId);
}
