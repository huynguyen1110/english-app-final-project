package com.example.api.dtos.grammar;

import jakarta.persistence.Lob;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class GrammarDto {

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

    private Boolean isPublished;
}
