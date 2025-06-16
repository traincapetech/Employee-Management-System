package org.example.leaveRequest.service;

import org.example.attendence.model.Attendance;
import org.example.attendence.repository.AttendanceRepository;
import org.example.employee.model.Employee;
import org.example.employee.repository.EmployeeRepository;
import org.example.leaveRequest.model.LeaveRequest;
import org.example.leaveRequest.repository.LeaveRequestRepository;
import org.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    public LeaveRequest applyForLeave(LeaveRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate today = LocalDate.now();

        long absentsThisMonth = attendanceRepository
                .findByEmployeeIdAndDateBetween(request.getEmployeeId(), startOfMonth, today)
                .stream()
                .filter(a -> a.getStatus() == Attendance.Status.ABSENT)
                .count();

        if (absentsThisMonth >= 2 && !request.isOverrideAutoReject()) {
            request.setStatus(LeaveRequest.LeaveStatus.AUTO_REJECTED);
        } else {
            request.setStatus(LeaveRequest.LeaveStatus.PENDING);
        }

        request.setRequestDate(LocalDate.now());
        return leaveRepository.save(request);
    }

    public LeaveRequest updateLeaveStatus(String leaveId, LeaveRequest.LeaveStatus status) {
        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        leave.setStatus(status);
        return leaveRepository.save(leave);
    }

    public List<LeaveRequest> getLeavesForHR(String hrId) {
        return leaveRepository.findByHrId(hrId);
    }

    public List<LeaveRequest> getLeavesForEmployee(String employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    public LeaveRequest hrApplyLeave(LeaveRequest request) {
        if (request.getHrId() == null || request.getAdminId() == null) {
            throw new IllegalArgumentException("HR ID and Admin ID are required.");
        }

        // Validate admin role
        userRepository.findById(request.getAdminId())
                .filter(admin -> "ADMIN".equals(admin.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Referenced Admin is invalid."));

        request.setRequestDate(LocalDate.now());
        request.setStatus(LeaveRequest.LeaveStatus.PENDING);

        return leaveRepository.save(request);
    }

    // Admin fetches all HR leave requests
    public List<LeaveRequest> getHrLeaveRequestsForAdmin(String adminId) {
        return leaveRepository.findByAdminIdAndHrIdNotNull(adminId);
    }
}
