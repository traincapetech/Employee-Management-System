package org.example.attendence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.attendence.model.Attendance;

import java.util.List;

@Data
@AllArgsConstructor
public class AttendanceStatsResponse {
    private List<Attendance> attendanceList;
    private long presentCount;
    private long absentCount;
    private long halfDayCount;
}