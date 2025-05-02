package org.example.employee.service;

import org.example.employee.model.Employee;
import org.example.employee.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeeService {

    private final String UPLOAD_DIR = "uploads/"; // Make sure this folder exists

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee saveEmployee(Employee employee, List<MultipartFile> files) throws IOException {
        // Ensure the upload directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs(); // Create the directory if it doesn't exist
        }

        // Save each file and map to corresponding field (basic version)
        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Path.of(UPLOAD_DIR, fileName);
            file.transferTo(filePath.toFile());

            // You can map filenames to employee fields based on input name or additional logic
            if (file.getOriginalFilename().contains("resume")) {
                employee.setResumePath(filePath.toString());
            } else if (file.getOriginalFilename().contains("photograph")) {
                employee.setPhotographPath(filePath.toString());
            } else if (file.getOriginalFilename().contains("offerLetter")) {
                employee.setOfferLetterPath(filePath.toString());
            } else if (file.getOriginalFilename().contains("aadharCard")) {
                employee.setAadharCardPath(filePath.toString());
            } // Add more conditions as needed for other fields
        }

        // Save the employee to the database (assuming EmployeeRepository extends JpaRepository)
        return employeeRepository.save(employee);
    }

    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }
}
