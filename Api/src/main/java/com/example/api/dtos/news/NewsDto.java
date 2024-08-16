package com.example.api.dtos.news;

import com.example.api.entities.Topic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsDto {

    private String title;

    private String content;

    private String sourceName;

    private String description;

    private String author;

    private String imageUrl;

    private String sourceUrl;

    private LocalDateTime publishedAt;

    private long topicId;
}
