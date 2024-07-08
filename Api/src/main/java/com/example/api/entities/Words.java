package com.example.api.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Words {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wordId;

    private String name;

    private String description;

    private String meaning;

    private String wordType;

    private String image;

    private Boolean isDeleted;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @ManyToMany
    @JoinTable(
            name = "words_packages",
            joinColumns = @JoinColumn(name = "word_id"),
            inverseJoinColumns = @JoinColumn(name = "package_id")
    )
    private List<Packages> packages;
}
