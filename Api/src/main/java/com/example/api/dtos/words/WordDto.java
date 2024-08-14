package com.example.api.dtos.words;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordDto {
    private String name;

    private String description;

    private String meaning;

    private String example;

    private String wordType;

    private String image;
}
