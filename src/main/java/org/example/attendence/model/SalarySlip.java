package org.example.attendence.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "salary_slips")
public class SalarySlip {

    @Id
    private String id;

    private String employeeId;
    private String month; // Format: "2025-05"
    private byte[] pdfData;

    private LocalDate generatedDate;

    // Getters and setters
}
