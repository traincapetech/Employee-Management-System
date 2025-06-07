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

    private byte[] photograph; // JPEG image

    private String collegeName;
    private byte[] tenthMarksheet;
    private byte[] twelfthMarksheet;
    private byte[] bachelorDegree;
    private byte[] postgraduateDegree;

    private byte[] aadharCard;
    private byte[] panCard;
    private byte[] pcc;
    private byte[] resume;

    private String role;
    private String department;
    private Long joiningDate;
    private Integer internshipDuration;
    private byte[] offerLetter;

    private String status;
    private Double salary;

    private String hrId;  // ID of the HR who created/added this employee
}
