package org.example.employee.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.employee.model.Employee;
import org.example.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Employee> addEmployee(
            @RequestPart("employee") String employeeJson,
            @RequestPart("files") List<MultipartFile> files
    ) {
        try {
            // Create mapper
            ObjectMapper objectMapper = new ObjectMapper();

            // Deserialize employee JSON
            Employee employee = objectMapper.readValue(employeeJson, Employee.class);

            // Save employee and files
            Employee savedEmployee = employeeService.saveEmployee(employee, files);
            return ResponseEntity.ok(savedEmployee);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable String id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Employee> getAll() {
        return employeeService.getAllEmployees();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }
}
