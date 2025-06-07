package org.example.user.dto;

public class UserInfoResponse {
    private String role;
    private Object data;

    public UserInfoResponse() {}

    public UserInfoResponse(String role, Object data) {
        this.role = role;
        this.data = data;
    }

    // Getters and setters
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
