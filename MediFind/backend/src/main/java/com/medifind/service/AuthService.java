package com.medifind.service;

import com.medifind.model.User;
import com.medifind.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public static String hashPassword(String plainPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(plainPassword.trim().getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public Optional<User> authenticate(String email, String plainPassword) {
        String hash = hashPassword(plainPassword);
        return userRepository.findByEmailIgnoreCase(email)
                .filter(u -> u.getPasswordHash().equals(hash));
    }

    @Transactional
    public User registerUser(String name, String email, String plainPassword, String phone) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("An account with this email address already exists.");
        }

        User user = User.builder()
                .name(name.trim())
                .email(email.trim().toLowerCase())
                .passwordHash(hashPassword(plainPassword))
                .role("USER")
                .phone(phone)
                .build();

        return userRepository.save(user);
    }
}
