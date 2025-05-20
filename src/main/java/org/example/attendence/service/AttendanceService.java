package org.example.attendence.service;

import org.example.attendence.model.Attendance;
import org.example.attendence.model.Attendance.Status;
import org.example.attendence.repository.AttendanceRepository;
import org.example.employee.model.Employee;
import org.example.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Attendance markAttendance(String employeeId, Status status) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setDate(LocalDate.now());
        attendance.setStatus(status);

        return attendanceRepository.save(attendance);
    }

    public Attendance markCheckInOrCheckOut(String employeeId, LocalTime time, boolean isCheckIn) {
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, LocalDate.now());
        if (attendance == null) throw new RuntimeException("Attendance not marked for today");

        if (isCheckIn) {
            attendance.setCheckInTime(time);
        } else {
            attendance.setCheckOutTime(time);
        }

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceReport(String employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    public List<Attendance> getAttendanceForDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByDateBetween(startDate, endDate);
    }

    public double calculateMonthlySalary(String employeeId, int month, int year) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getSalary() == null) {
            throw new IllegalArgumentException("Salary not set for employee: " + employeeId);
        }

        double dailyRate = employee.getSalary() / 30;

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, start, end);

        long absentDays = attendances.stream().filter(a -> a.getStatus() == Status.ABSENT).count();
        long halfDays = attendances.stream().filter(a -> a.getStatus() == Status.HALF_DAY).count();

        double deduction = (absentDays * dailyRate) + (halfDays * dailyRate / 2);

        return employee.getSalary() - deduction;
    }

    public double calculateLeaveDeductions(String employeeId, int month, int year) {
        double dailyRate = employeeRepository.findById(employeeId)
                .map(emp -> emp.getSalary() / 30)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, start, end);
        long leaveDays = attendances.stream().filter(a -> a.getStatus() == Attendance.Status.LEAVE).count();
        long halfDays = attendances.stream().filter(a -> a.getStatus() == Attendance.Status.HALF_DAY).count();

        return (leaveDays * dailyRate) + (halfDays * (dailyRate / 2));
    }



}
