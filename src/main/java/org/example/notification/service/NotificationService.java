package org.example.notification.service;

import org.example.notification.model.Notification;
import org.example.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(String recipientId, String message) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(String recipientId) {
        return notificationRepository.findByRecipientId(recipientId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
