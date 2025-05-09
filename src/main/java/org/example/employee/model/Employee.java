package org.example.employee.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "employees")
public class Employee {

    @Id
    private String id;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String whatsappNumber;
    private String linkedInUrl;
    private String currentAddress;
    private String permanentAddress;
    private String photographPath;

    private String collegeName;
    private String tenthMarksheetPath;
    private String twelfthMarksheetPath;
    private String bachelorDegreePath;
    private String postgraduateDegreePath;

    private String aadharCardPath;
    private String panCardPath;
    private String pccPath;
    private String resumePath;

    private String role;
    private String department;
    private Long joiningDate;
    private Integer internshipDuration;
    private String offerLetterPath;
    private String status;

    private Double salary; // Monthly base salary
}
