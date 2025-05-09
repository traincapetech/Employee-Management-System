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

    private final String UPLOAD_DIR = "uploads/";

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee saveEmployee(Employee employee, List<MultipartFile> files) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        if (employee.getId() == null || employee.getId().isEmpty()) {
            employee.setId(UUID.randomUUID().toString());
        }

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Path.of(UPLOAD_DIR, fileName);
                file.transferTo(filePath.toFile());

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
                }
            }
        }

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

    public Employee saveUpdatedEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }
}
