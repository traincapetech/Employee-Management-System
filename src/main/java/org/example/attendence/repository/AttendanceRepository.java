package org.example.attendence.repository;

import org.example.attendence.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    Attendance findByEmployeeIdAndDate(String employeeId, LocalDate date);
    List<Attendance> findByEmployeeId(String employeeId);
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Attendance> findByEmployeeIdAndDateBetween(String employeeId, LocalDate startDate, LocalDate endDate); // <- Add this
}
