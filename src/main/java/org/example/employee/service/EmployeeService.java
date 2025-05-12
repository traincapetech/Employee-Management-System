package org.example.employee.service;

import org.example.employee.model.Employee;
import org.example.employee.repository.EmployeeRepository;
import org.example.user.model.User;
import org.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    // Method to save employee
    public Employee saveEmployee(Employee employee) {
        // Save the employee and return the saved object
        return employeeRepository.save(employee);
    }

    // Additional methods to update, get, or delete employee by ID
    public Employee updateEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }

    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
