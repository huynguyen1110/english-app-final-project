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
public class Audios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long audioId;

    private String title;

    private String content;

    private String imageUrl;

    private LocalDateTime creationDate;

    private LocalDateTime updateDate;

    private LocalDateTime deletednDate;

    private Boolean isDeleted;

    @ManyToMany
    @JoinTable(
            name = "audio_favorites",
            joinColumns = @JoinColumn(name = "audio_id"),
            inverseJoinColumns = @JoinColumn(name = "favorite_id")
    )
    private List<Favorites> favorites;
}

