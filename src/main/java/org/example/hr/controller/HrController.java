package org.example.hr.controller;

import org.example.hr.dto.HrCreationRequest;
import org.example.hr.model.Hr;
import org.example.hr.service.HrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hrs")
public class HrController {

    @Autowired
    private HrService hrService;

    @PostMapping
    public ResponseEntity<?> createHr(@RequestBody HrCreationRequest request) {
        try {
            Hr hr = Hr.builder()
                    .id(UUID.randomUUID().toString())  // Generate UUID here for HR
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .phoneNumber(request.getPhoneNumber())
                    .department(request.getDepartment())
                    .joiningDate(request.getJoiningDate())
                    .status(request.getStatus())
                    .referredByAdminId(request.getReferredByAdminId()) // set ref
                    .build();

            Hr createdHr = hrService.createHr(hr, request.getUsername(), request.getPassword());
            return ResponseEntity.ok(createdHr);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<Hr> getAllHrs() {
        return hrService.getAllHrs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hr> getHrById(@PathVariable String id) {
        Hr hr = hrService.getHrById(id);
        return hr != null ? ResponseEntity.ok(hr) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHr(@PathVariable String id) {
        hrService.deleteHr(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHr(@PathVariable String id, @RequestBody Hr updatedHr) {
        Hr hr = hrService.getHrById(id);
        if (hr == null) {
            return ResponseEntity.notFound().build();
        }
        updatedHr.setId(id);
        Hr saved = hrService.updateHr(updatedHr);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/by-admin/{adminId}")
    public ResponseEntity<List<Hr>> getHrsByAdminId(@PathVariable String adminId) {
        List<Hr> hrs = hrService.getHrsByAdminId(adminId);
        return ResponseEntity.ok(hrs);
    }


}
