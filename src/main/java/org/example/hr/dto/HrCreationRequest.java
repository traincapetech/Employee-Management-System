package org.example.hr.dto;

import lombok.Data;

@Data
public class HrCreationRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String department;
    private Long joiningDate;
    private String status;
    private String referredByAdminId; // New field
    private String username;
    private String password;
}
