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
public class Grammar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long grammarId;

    private String title;

    private String description;

    @Lob
    private String content;

    private String createBy;

    private String updateBy;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private LocalDateTime deletedDate;

    private Boolean isDeleted;
}
