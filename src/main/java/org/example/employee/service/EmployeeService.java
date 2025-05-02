package org.example.employee.service;
import org.example.employee.repository.EmployeeRepository;
import org.example.employee.model.Employee;
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

    private final String UPLOAD_DIR = "uploads/"; // Ensure this folder exists or create it dynamically

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee saveEmployee(Employee employee, List<MultipartFile> files) throws IOException {
        // Ensure the upload directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs(); // Create the directory if it doesn't exist
        }

        // Check if files are provided, and if not, throw an exception or handle gracefully
        if (files != null && !files.isEmpty()) {
            // Save each file and map to corresponding field
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue; // Skip empty files
                }

                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Path.of(UPLOAD_DIR, fileName);
                file.transferTo(filePath.toFile());

                // Map file paths to employee fields based on file name
                String fileNameLower = file.getOriginalFilename().toLowerCase();
                if (fileNameLower.contains("resume")) {
                    employee.setResumePath(filePath.toString());
                } else if (fileNameLower.contains("photograph")) {
                    employee.setPhotographPath(filePath.toString());
                } else if (fileNameLower.contains("offerletter")) {
                    employee.setOfferLetterPath(filePath.toString());
                } else if (fileNameLower.contains("aadharcard")) {
                    employee.setAadharCardPath(filePath.toString());
                } else if (fileNameLower.contains("pan")) {
                    employee.setPanCardPath(filePath.toString());
                } else if (fileNameLower.contains("pcc")) {
                    employee.setPccPath(filePath.toString());
                } // Add other file handling conditions as needed
            }
        } else {
            // Optionally handle the case when no files are provided
            // Throw an exception, log a message, or handle gracefully
            System.out.println("No files uploaded. Employee data saved without files.");
        }

        // Save the employee to the database
        return employeeRepository.save(employee);
    }

    // Get an employee by their ID
    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Delete an employee by their ID
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }
}
