package com.example.api.entities;

import com.example.api.entities.enums.StoryStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Stories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vnTitle;

    private String engTitle;

    private String image;

    private String content;

    private String newVocab;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    private Boolean isDeleted;

    @Enumerated(EnumType.STRING)
    private StoryStatus status;

    @OneToMany(mappedBy = "stories", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserStory> userStories;
}
