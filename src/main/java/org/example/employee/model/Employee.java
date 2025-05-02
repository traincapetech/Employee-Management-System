package org.example.employee.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "employees")
public class Employee {

    @Id
    private String id;

    // 1. Personal Information
    private String fullName;
    private String email;                // must be unique
    private String phoneNumber;
    private String whatsappNumber;
    private String linkedInUrl;
    private String currentAddress;
    private String permanentAddress;
    private String photographPath;      // File path or base64 string

    // 2. Educational Details
    private String collegeName;
    private String tenthMarksheetPath;
    private String twelfthMarksheetPath;
    private String bachelorDegreePath;
    private String postgraduateDegreePath;

    // 3. Identity & Verification Documents
    private String aadharCardPath;
    private String panCardPath;
    private String pccPath;              // Required for employees, optional for interns
    private String resumePath;

    // 4. Employment Specific Fields
    private String role;                 // Intern, Full-time, Part-time, Freelancer
    private String department;           // Tech, Sales, etc.
    private Long joiningDate; // Epoch millis (e.g., from System.currentTimeMillis())
    private Integer internshipDuration;  // In months (if intern)
    private String offerLetterPath;
    private String status;               // Active, Completed, Resigned, Terminated
}
