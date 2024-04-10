package com.example.api.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Videos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long videoId;

    private String title;

    private String linkVideo;

    private String chanelName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime isDeletedAt;

    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "topic_id", referencedColumnName = "id")
    private Topic topic;
}
