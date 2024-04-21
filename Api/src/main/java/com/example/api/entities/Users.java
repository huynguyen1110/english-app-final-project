package com.example.api.entities;

import com.example.api.entities.enums.UserRole;
import com.example.api.entities.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String username;

    private String email;

    private String password;

    private String phoneNumber;

    private String address;

    @Enumerated(EnumType.STRING)
    private UserStatus userStatus;

    @ElementCollection(targetClass = UserRole.class)
    @Enumerated(EnumType.STRING)
    private Set<UserRole> roles;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private LocalDateTime deletedAt;

    private Boolean isDeleted;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "favorite_id", referencedColumnName = "favoriteId")
    private Favorites favorite;
}

