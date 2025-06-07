package org.example.notification.controller;

import org.example.notification.model.Notification;
import org.example.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public Notification sendNotification(
            @RequestParam String recipientId,
            @RequestParam String message) {
        return notificationService.sendNotification(recipientId, message);
    }

    @GetMapping("/{recipientId}")
    public List<Notification> getNotifications(@PathVariable String recipientId) {
        return notificationService.getNotifications(recipientId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
    }
}
