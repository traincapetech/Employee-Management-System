package org.example.employee.controller;

import org.example.employee.model.Employee;
import org.example.employee.service.EmployeeService;
import org.example.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.DataInput;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private UserService userService;

    // Method to add employee with user creation (for Employee or HR)
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addEmployeeWithUser(
            @RequestPart("employee") String employeeJson,  // Raw JSON string
            @RequestPart("username") String username,
            @RequestPart("password") String password,
            @RequestPart("role") String role,
            @RequestPart(value = "referenceId", required = false) String referenceId,

            @RequestPart("photograph") MultipartFile photograph,
            @RequestPart("tenthMarksheet") MultipartFile tenthMarksheet,
            @RequestPart("twelfthMarksheet") MultipartFile twelfthMarksheet,
            @RequestPart("bachelorDegree") MultipartFile bachelorDegree,
            @RequestPart("postgraduateDegree") MultipartFile postgraduateDegree,

            @RequestPart("aadharCard") MultipartFile aadharCard,
            @RequestPart("panCard") MultipartFile panCard,
            @RequestPart("pcc") MultipartFile pcc,
            @RequestPart("resume") MultipartFile resume,
            @RequestPart("offerLetter") MultipartFile offerLetter
    ) {
        try {
            // Generate a shared ID that will be used for both employee and user
            String sharedId = UUID.randomUUID().toString();
            
            // Parse JSON string to Employee object
            ObjectMapper mapper = new ObjectMapper();
            Employee employee = mapper.readValue(employeeJson, Employee.class);
            
            // Set the generated ID for the employee
            employee.setId(sharedId);

            // Set file bytes
            employee.setPhotograph(photograph.getBytes());
            employee.setTenthMarksheet(tenthMarksheet.getBytes());
            employee.setTwelfthMarksheet(twelfthMarksheet.getBytes());
            employee.setBachelorDegree(bachelorDegree.getBytes());
            employee.setPostgraduateDegree(postgraduateDegree.getBytes());

            employee.setAadharCard(aadharCard.getBytes());
            employee.setPanCard(panCard.getBytes());
            employee.setPcc(pcc.getBytes());
            employee.setResume(resume.getBytes());
            employee.setOfferLetter(offerLetter.getBytes());

            // Save employee first
            Employee savedEmployee = employeeService.saveEmployee(employee);
            
            // Create user with the same ID as the employee
            // Use referenceId for HR relationship (this is the hrId from the employee object)
            String actualReferenceId = referenceId != null ? referenceId : employee.getHrId();
            userService.createUserWithId(sharedId, username, password, role, actualReferenceId);

            return ResponseEntity.ok(savedEmployee);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to save employee: " + e.getMessage());
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

    @GetMapping("/by-hr/{hrId}")
    public ResponseEntity<List<Employee>> getEmployeesByHrId(@PathVariable String hrId) {
        List<Employee> employees = employeeService.getEmployeesByHrId(hrId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<Employee>> getEmployeesByStatus(@PathVariable String status) {
        List<Employee> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(employees);
    }

}