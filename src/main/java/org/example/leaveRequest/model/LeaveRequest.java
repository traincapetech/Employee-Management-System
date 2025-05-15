package org.example.leaveRequest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "leave_requests")
public class LeaveRequest {

    @Id
    private String id;

    private String employeeId;
    private String hrId;

    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
    
    private boolean overrideAutoReject;  // Checkbox from frontend
    private LeaveStatus status;

    public enum LeaveStatus {
        PENDING, APPROVED, REJECTED, AUTO_REJECTED
    }

    private LocalDate requestDate;
}
