package com.example.api.dtos.stories;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StoriesDto {

    private String vnTitle;

    private String engTitle;

    private String image;

    private String content;

    private String newVocab;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    private Boolean isDeleted;
}
