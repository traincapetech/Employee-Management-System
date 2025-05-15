package org.example.user.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;
    private String password;
    private String role; // Single role field
    private String referenceId;  // Reference ID for linking to Employee (or other models)

    // Add the setter for role if it's not there
    public void setRole(String role) {
        this.role = role;
    }

    // Add the getter for role if it's not there
    public String getRole() {
        return role;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }
}
