package org.example.salaryslip.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import org.example.attendence.model.Attendance;
import org.example.attendence.model.Attendance.Status;
import org.example.attendence.repository.AttendanceRepository;
import org.example.attendence.service.AttendanceService;
import org.example.employee.model.Employee;
import org.example.employee.repository.EmployeeRepository;
import org.example.salaryslip.model.SalarySlip;
import org.example.salaryslip.repository.SalarySlipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.layout.Document;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
public class SalarySlipService {

    @Autowired
    private SalarySlipRepository salarySlipRepository;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public SalarySlip generateAndStoreSalarySlip(String employeeId, int year, int month, double incentiveAmount) throws Exception {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Calculate attendance and leaves
        int daysInMonth = YearMonth.of(year, month).lengthOfMonth();

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // Get attendance records using the existing method
        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);

        // Calculate leaves using the same logic as in your AttendanceService
        long absentDays = attendances.stream().filter(a -> a.getStatus() == Attendance.Status.ABSENT).count();
        long leaveDays = attendances.stream().filter(a -> a.getStatus() == Attendance.Status.LEAVE).count();
        long halfDays = attendances.stream().filter(a -> a.getStatus() == Attendance.Status.HALF_DAY).count();

        int leavesTaken = (int)(leaveDays + absentDays + (halfDays / 2.0));
        int paidDays = daysInMonth - leavesTaken;

        // Calculate salaries and deductions
        double basicSalary = employee.getSalary();
        double hraAmount = 0.00; // Assuming no HRA for now, can be set based on business rules
        double grossEarnings = basicSalary + hraAmount + incentiveAmount;

        double leaveDeduction = attendanceService.calculateLeaveDeductions(employeeId, month, year);
        double incomeTax = 0.00; // This should be calculated based on tax rules
        double providentFund = 0.00; // This should be calculated based on PF rules
        double totalDeductions = incomeTax + providentFund + leaveDeduction;

        double finalSalary = grossEarnings - totalDeductions;
        LocalDate generationDate = LocalDate.now();

        String monthStr = String.format("%04d-%02d", year, month);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document doc = new Document(pdfDoc);

        // Header - Company name
        doc.add(new Paragraph("Traincape Technology Pvt. Ltd.")
                .setFontSize(16)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("Rz-118/C , Khandoliya Plaza 3rd Floor , Dabri Palam Road Vaishali Clolony ,")
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("New Delhi - 110045 India")
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER));

        // Title
        doc.add(new Paragraph("Payslip For the Month")
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph(Month.of(month) + " " + year)
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        // Employee details table
        Table employeeDetails = new Table(4);
        employeeDetails.setWidth(pdfDoc.getDefaultPageSize().getWidth() - 40);

        employeeDetails.addCell("Employee Name");
        employeeDetails.addCell(":");
        employeeDetails.addCell("Employee ID");
        employeeDetails.addCell(":");

        employeeDetails.addCell(employee.getFullName());
        employeeDetails.addCell("");
        employeeDetails.addCell(employeeId);
        employeeDetails.addCell("");

        employeeDetails.addCell("Pay Period");
        employeeDetails.addCell(":");
        employeeDetails.addCell("Pay Date");
        employeeDetails.addCell(":");

        employeeDetails.addCell(Month.of(month) + " " + year);
        employeeDetails.addCell("");
        employeeDetails.addCell(generationDate.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        employeeDetails.addCell("");

        employeeDetails.addCell("Paid Days");
        employeeDetails.addCell(":");
        employeeDetails.addCell("LOP Days");
        employeeDetails.addCell(":");

        employeeDetails.addCell(String.valueOf(paidDays));
        employeeDetails.addCell("");
        employeeDetails.addCell(String.valueOf(leavesTaken));
        employeeDetails.addCell("");

        doc.add(employeeDetails);
        doc.add(new Paragraph("\n"));

        // EARNINGS section
        Table earnings = new Table(2);
        earnings.setWidth(pdfDoc.getDefaultPageSize().getWidth() / 2 - 30);
        earnings.addHeaderCell("EARNINGS").setBold();
        earnings.addHeaderCell("AMOUNT").setBold();
        earnings.addCell("Basic");
        earnings.addCell("₹" + String.format("%.0f", basicSalary));
        earnings.addCell("House Rent Allowance");
        earnings.addCell("₹" + String.format("%.0f", hraAmount));
        earnings.addCell("Incentive");
        earnings.addCell("₹" + String.format("%.0f", incentiveAmount));
        earnings.addCell("Gross Earnings");
        earnings.addCell("₹" + String.format("%.0f", grossEarnings));

        // DEDUCTIONS section
        Table deductions = new Table(2);
        deductions.setWidth(pdfDoc.getDefaultPageSize().getWidth() / 2 - 30);
        deductions.addHeaderCell("DEDUCTIONS").setBold();
        deductions.addHeaderCell("AMOUNT").setBold();
        deductions.addCell("Income Tax");
        deductions.addCell("₹" + String.format("%.0f", incomeTax));
        deductions.addCell("Provident Fund");
        deductions.addCell("₹" + String.format("%.0f", providentFund));
        deductions.addCell("Leave (" + leavesTaken + " days )");
        deductions.addCell("₹" + String.format("%.0f", leaveDeduction));
        deductions.addCell("Total Deductions");
        deductions.addCell("₹" + String.format("%.0f", totalDeductions));

        // Layout earnings and deductions side by side
        Table salaryTable = new Table(2);
        salaryTable.setWidth(pdfDoc.getDefaultPageSize().getWidth() - 40);
        salaryTable.addCell(earnings);
        salaryTable.addCell(deductions);
        doc.add(salaryTable);

        // EMPLOYEE SUMMARY section
        doc.add(new Paragraph("\n"));
        doc.add(new Paragraph("EMPLOYEE SUMMARY")
                .setBold()
                .setFontSize(12));

        doc.add(new Paragraph("TOTAL NET PAYABLE")
                .setBold()
                .setFontSize(12));

        doc.add(new Paragraph("Gross Earnings - Total Deductions")
                .setFontSize(10));

        doc.add(new Paragraph("₹" + String.format("%.0f", finalSalary))
                .setBold()
                .setFontSize(16)
                .setTextAlignment(TextAlignment.RIGHT));

        // Convert to words
        String amountInWords = convertToIndianCurrency(finalSalary);
        doc.add(new Paragraph("Amount to be Paid in Cash : Indian Rupee " + amountInWords)
                .setFontSize(10));

        doc.add(new Paragraph("₹" + String.format("%.0f", basicSalary))
                .setBold()
                .setTextAlignment(TextAlignment.RIGHT));

        doc.add(new Paragraph("Employee Net Pay")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT));

        doc.add(new Paragraph("\n-- This is a system-generated document. --")
                .setItalic()
                .setFontSize(8)
                .setTextAlignment(TextAlignment.CENTER));

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

    /**
     * Helper method to convert amount to Indian currency words
     */
    private String convertToIndianCurrency(double amount) {
        long rupees = (long) amount;
        int paise = (int) Math.round((amount - rupees) * 100);

        if (paise == 0) {
            return NumberToWord.convert(rupees) + " Only";
        } else {
            return NumberToWord.convert(rupees) + " and " + NumberToWord.convert(paise) + " Paise Only";
        }
    }

    public byte[] getSalarySlipPdf(String employeeId, int year, int month) {
        String monthStr = String.format("%04d-%02d", year, month);

        // Get the most recent salary slip if multiple exist
        List<SalarySlip> slips = salarySlipRepository.findAllByEmployeeIdAndMonth(employeeId, monthStr);

        if (slips == null || slips.isEmpty()) {
            throw new RuntimeException("Salary slip not found for Employee ID: " + employeeId + " and Month: " + monthStr);
        }

        // Sort by generation date (newest first) if multiple slips exist
        SalarySlip slip = slips.stream()
                .sorted((s1, s2) -> s2.getGeneratedDate().compareTo(s1.getGeneratedDate()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Salary slip not found for Employee ID: " + employeeId + " and Month: " + monthStr));

        return slip.getPdfData();
    }

    /**
     * Helper class to convert numbers to words
     */
    private static class NumberToWord {
        private static final String[] units = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};
        private static final String[] tens = {"", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};

        public static String convert(long number) {
            if (number == 0) {
                return "Zero";
            }

            if (number < 0) {
                return "Minus " + convert(-number);
            }

            String words = "";

            if ((number / 10000000) > 0) {
                words += convert(number / 10000000) + " Crore ";
                number %= 10000000;
            }

            if ((number / 100000) > 0) {
                words += convert(number / 100000) + " Lakh ";
                number %= 100000;
            }

            if ((number / 1000) > 0) {
                words += convert(number / 1000) + " Thousand ";
                number %= 1000;
            }

            if ((number / 100) > 0) {
                words += convert(number / 100) + " Hundred ";
                number %= 100;
            }

            if (number > 0) {
                if (!words.isEmpty()) {
                    words += "and ";
                }

                if (number < 20) {
                    words += units[(int) number];
                } else {
                    words += tens[(int) (number / 10)];
                    if ((number % 10) > 0) {
                        words += " " + units[(int) (number % 10)];
                    }
                }
            }

            return words.trim();
        }
    }
}