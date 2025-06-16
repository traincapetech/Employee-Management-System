package org.example.leaveRequest.controller;


import org.example.leaveRequest.model.LeaveRequest;
import org.example.leaveRequest.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> applyLeave(@RequestBody LeaveRequest request) {
        return ResponseEntity.ok(leaveService.applyForLeave(request));
    }

    @PutMapping("/{leaveId}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(
            @PathVariable String leaveId,
            @RequestParam LeaveRequest.LeaveStatus status
    ) {
        return ResponseEntity.ok(leaveService.updateLeaveStatus(leaveId, status));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaves(@PathVariable String employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesForEmployee(employeeId));
    }

    @GetMapping("/hr/{hrId}")
    public ResponseEntity<List<LeaveRequest>> getHrLeaves(@PathVariable String hrId) {
        return ResponseEntity.ok(leaveService.getLeavesForHR(hrId));
    }

    // HR applies for leave to admin
    @PostMapping("/hr/apply")
    public ResponseEntity<LeaveRequest> applyLeaveByHr(@RequestBody LeaveRequest request) {
        return ResponseEntity.ok(leaveService.hrApplyLeave(request));
    }

    // Admin gets all HR leave requests
    @GetMapping("/admin/{adminId}/hr-requests")
    public ResponseEntity<List<LeaveRequest>> getHrLeaveRequests(@PathVariable String adminId) {
        return ResponseEntity.ok(leaveService.getHrLeaveRequestsForAdmin(adminId));
    }
}
