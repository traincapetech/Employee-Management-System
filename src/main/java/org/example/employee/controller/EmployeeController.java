package org.example.employee.controller;

import org.example.employee.model.Employee;
import org.example.employee.service.EmployeeService;
import org.example.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private UserService userService;

    // Method to add employee with user creation (for Employee or HR)
    @PostMapping
    public ResponseEntity<?> addEmployeeWithUser(
            @RequestPart("employee") String employeeJson,
            @RequestPart("username") String username,
            @RequestPart("password") String password,
            @RequestPart("role") String role,
            @RequestPart("referenceId") String referenceId
    ) {
        try {
            // Create user first (HR or Employee)
            userService.createUser(username, password, role, referenceId);

            // Parse the employee data from JSON
            ObjectMapper mapper = new ObjectMapper();
            Employee employee = mapper.readValue(employeeJson, Employee.class);

            // Save employee
            Employee savedEmployee = employeeService.saveEmployee(employee);
            return ResponseEntity.ok(savedEmployee);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to save employee.");
        }
    }

    // Additional endpoints for Employee management (Update, Get, Delete)
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String id, @RequestBody Employee updated) {
        Employee existing = employeeService.getEmployeeById(id);
        if (existing != null) {
            updated.setId(id);
            return ResponseEntity.ok(employeeService.updateEmployee(updated));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable String id) {
        Employee employee = employeeService.getEmployeeById(id);
        if (employee != null) {
            return ResponseEntity.ok(employee);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }
}
