package org.example.attendence.controller;

import org.example.attendence.dto.AttendanceStatsResponse;
import org.example.attendence.model.Attendance;
import org.example.attendence.model.Attendance.Status;
import org.example.attendence.repository.AttendanceRepository;
import org.example.attendence.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @PostMapping("/{employeeId}/mark")
    public ResponseEntity<Attendance> markAttendance(
            @PathVariable String employeeId,
            @RequestParam Status status
    ) {
        try {
            Attendance attendance = attendanceService.markAttendance(employeeId, status);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{employeeId}/checkin")
    public ResponseEntity<Attendance> checkIn(
            @PathVariable String employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time
    ) {
        try {
            Attendance attendance = attendanceService.markCheckInOrCheckOut(employeeId, time, true);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{employeeId}/checkout")
    public ResponseEntity<Attendance> checkOut(
            @PathVariable String employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time
    ) {
        try {
            Attendance attendance = attendanceService.markCheckInOrCheckOut(employeeId, time, false);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{employeeId}/report")
    public ResponseEntity<List<Attendance>> getReport(@PathVariable String employeeId) {
        return ResponseEntity.ok(attendanceService.getAttendanceReport(employeeId));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Attendance>> getDateRangeReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(attendanceService.getAttendanceForDateRange(startDate, endDate));
    }

    @GetMapping("/{employeeId}/salary")
    public ResponseEntity<Double> calculateSalary(
            @PathVariable String employeeId,
            @RequestParam int month,
            @RequestParam int year) {
        double salary = attendanceService.calculateMonthlySalary(employeeId, month, year);
        return ResponseEntity.ok(salary);
    }

    @PutMapping("/{attendanceId}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable String attendanceId,
            @RequestBody Attendance updated) {

        Optional<Attendance> existing = attendanceRepository.findById(attendanceId);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        updated.setId(attendanceId);
        Attendance saved = attendanceRepository.save(updated);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{employeeId}/summary")
    public ResponseEntity<AttendanceStatsResponse> getAttendanceSummary(
            @PathVariable String employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        AttendanceStatsResponse response = attendanceService.getAttendanceSummary(employeeId, startDate, endDate);
        return ResponseEntity.ok(response);
    }



}
