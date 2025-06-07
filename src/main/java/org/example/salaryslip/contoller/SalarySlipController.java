package org.example.salaryslip.contoller;

import org.example.salaryslip.model.SalarySlip;
import org.example.salaryslip.repository.SalarySlipRepository;
import org.example.salaryslip.service.SalarySlipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.YearMonth;
import java.util.Optional;

@RestController
@RequestMapping("/api/salaryslip")
public class SalarySlipController {

    @Autowired
    private SalarySlipService salarySlipService;

    @Autowired
    private SalarySlipRepository salarySlipRepository;

    @PostMapping("/generate/{employeeId}")
    public ResponseEntity<String> generateSalarySlip(
            @PathVariable String employeeId,
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam(required = false, defaultValue = "0") double incentive
    ) {
        try {
            salarySlipService.generateAndStoreSalarySlip(employeeId, year, month, incentive);
            return ResponseEntity.ok("Salary slip generated successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/download/{employeeId}")
    public ResponseEntity<byte[]> downloadSalarySlip(
            @PathVariable String employeeId,
            @RequestParam String month  // Format: 2025-05
    ) {
        String[] parts = month.split("-");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid month format. Expected YYYY-MM");
        }
        int year = Integer.parseInt(parts[0]);
        int monthInt = Integer.parseInt(parts[1]);

        byte[] pdf = salarySlipService.getSalarySlipPdf(employeeId, year, monthInt);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"salary-slip.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @DeleteMapping("/salary-slip/{employeeId}")
    public ResponseEntity<?> deleteSalarySlip(
            @PathVariable String employeeId,
            @RequestParam String month) {
        Optional<SalarySlip> slipOpt = salarySlipRepository.findByEmployeeIdAndMonth(employeeId, month);
        if (slipOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        salarySlipRepository.delete(slipOpt.get());
        return ResponseEntity.ok("Salary slip deleted for month: " + month);
    }

}