package org.example.hr.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hrs")
public class Hr {

    @Id
    private String id;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String department;

    private Long joiningDate;
    private String status; // e.g. Active, Inactive
}
