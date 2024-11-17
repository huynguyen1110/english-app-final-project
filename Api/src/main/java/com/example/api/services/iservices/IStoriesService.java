package com.example.api.services.iservices;

import com.example.api.dtos.stories.StoriesDto;
import com.example.api.entities.Stories;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IStoriesService {

    Stories createStory(StoriesDto storiesDto);

    Stories updateStory(Long id ,StoriesDto storiesDto) throws Exception;

    Optional<Stories> getStoryById(Long id) throws Exception;

    void softDeleteStory(Long id) throws Exception;

    Page<Stories> getAllStories(int page, int size, String sortField, Boolean sortDirection);

    void setIsReadStory(String userEmail, Long storyId) throws Exception;

    Optional<List<Stories>> getFinishedStoriesByUserId(String userEmail) throws Exception;
}
