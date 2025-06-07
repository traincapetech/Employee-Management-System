package org.example.employee.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.employee.model.Employee;
import org.example.employee.service.EmployeeService;
import org.example.hr.repository.HrRepository;
import org.example.user.model.User;
import org.example.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private UserService userService;

    @Autowired
    private HrRepository hrRepository;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addEmployeeWithUser(
            @RequestPart("employee") String employeeJson,
            @RequestPart("username") String username,
            @RequestPart("password") String password,
            @RequestPart("referenceId") String referenceId,
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
            // ✅ Check if HR with the given referenceId exists
            if (!hrRepository.existsById(referenceId)) {
                return ResponseEntity.badRequest().body("HR with ID " + referenceId + " not found.");
            }

            ObjectMapper mapper = new ObjectMapper();
            Employee employee = mapper.readValue(employeeJson, Employee.class);

            // Generate UUID and set as ID
            String generatedId = UUID.randomUUID().toString();
            employee.setId(generatedId);

            // Set file data
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
            employee.setHrId(referenceId);

            // Save employee first
            employeeService.saveEmployee(employee);

            // Then create user with same ID
            User user = userService.createUserWithId(generatedId, username, password, "EMPLOYEE", referenceId);

            return ResponseEntity.ok("Employee and User created with ID: " + generatedId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to save employee and user.");
        }
    }


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
}
