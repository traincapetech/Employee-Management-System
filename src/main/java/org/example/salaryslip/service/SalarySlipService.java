
package org.example.salaryslip.service;


import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import org.example.attendence.model.Attendance;
import org.example.attendence.repository.AttendanceRepository;
import org.example.attendence.service.AttendanceService;
import org.example.employee.model.Employee;
import org.example.employee.repository.EmployeeRepository;
import org.example.salaryslip.model.SalarySlip;
import org.example.salaryslip.repository.SalarySlipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.layout.Document; // ✅ CORRECT — from iText 7
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SalarySlipService {

    @Autowired
    private SalarySlipRepository salarySlipRepository;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private EmployeeRepository employeeRepository;

    public SalarySlip generateAndStoreSalarySlip(String employeeId, int year, int month) throws Exception {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        double finalSalary = attendanceService.calculateMonthlySalary(employeeId, month, year);
        LocalDate generationDate = LocalDate.now();

        String monthStr = String.format("%04d-%02d", year, month);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document doc = new Document(pdfDoc);

        // Basic styling
        doc.add(new Paragraph("Salary Slip")
                .setFontSize(18)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("Payslip For the Month: " + Month.of(month) + " " + year));
        doc.add(new Paragraph("Employee Name: " + employee.getFullName()));
        doc.add(new Paragraph("Employee ID: " + employee.getId()));
        doc.add(new Paragraph("Pay Date: " + generationDate));
        doc.add(new Paragraph("\n"));

        // EARNINGS section
        Table earnings = new Table(2);
        earnings.addHeaderCell("EARNINGS").setBold();
        earnings.addHeaderCell("AMOUNT").setBold();
        earnings.addCell("Basic");
        earnings.addCell("₹" + employee.getSalary());
        earnings.addCell("Incentive");
        earnings.addCell("₹0.00");
        earnings.addCell("Gross Earnings");
        earnings.addCell("₹" + employee.getSalary());
        doc.add(earnings);
        doc.add(new Paragraph("\n"));

        // DEDUCTIONS section
        double leaveDeduction = attendanceService.calculateLeaveDeductions(employeeId, month, year);
        Table deductions = new Table(2);
        deductions.addHeaderCell("DEDUCTIONS").setBold();
        deductions.addHeaderCell("AMOUNT").setBold();
        deductions.addCell("Leave Deductions");
        deductions.addCell("₹" + leaveDeduction);
        deductions.addCell("Total Deductions");
        deductions.addCell("₹" + leaveDeduction);
        doc.add(deductions);
        doc.add(new Paragraph("\n"));

        doc.add(new Paragraph("NET PAYABLE: ₹" + finalSalary)
                .setBold()
                .setFontSize(14));

        doc.add(new Paragraph("\n-- This is a system-generated salary slip. --")
                .setItalic()
                .setFontSize(9));

        doc.close();

        SalarySlip slip = SalarySlip.builder()
                .id(UUID.randomUUID().toString())
                .employeeId(employeeId)
                .month(monthStr)
                .generatedDate(generationDate)
                .pdfData(baos.toByteArray())
                .build();

        return salarySlipRepository.save(slip);
    }

    public byte[] getSalarySlipPdf(String employeeId, int year, int month) {
        String monthStr = String.format("%04d-%02d", year, month);
        SalarySlip slip = salarySlipRepository.findByEmployeeIdAndMonth(employeeId, monthStr)
                .orElseThrow(() -> new RuntimeException("Salary slip not found for Employee ID: " + employeeId + " and Month: " + monthStr));
        return slip.getPdfData();
    }
}
