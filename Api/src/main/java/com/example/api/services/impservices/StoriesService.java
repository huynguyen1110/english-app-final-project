package com.example.api.services.impservices;

import com.example.api.dtos.stories.StoriesDto;
import com.example.api.entities.Stories;
import com.example.api.repositories.StoriesRepository;
import com.example.api.services.iservices.IStoriesService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import java.lang.reflect.Field;

@Service
@AllArgsConstructor

public class StoriesService implements IStoriesService {

    @Autowired
    private final StoriesRepository storiesRepository;

    @Override
    public Stories createStory(StoriesDto storyDto) {
        Stories story = new Stories();
        story.setVnTitle(storyDto.getVnTitle());
        story.setEngTitle(storyDto.getEngTitle());
        story.setImage(storyDto.getImage());
        story.setContent(storyDto.getContent());
        story.setNewVocab(storyDto.getNewVocab());
        story.setIsDeleted(storyDto.getIsDeleted());
        story.setCreatedAt(LocalDateTime.now()); // Đặt thời gian tạo hiện tại
        return storiesRepository.save(story);
    }

    public Stories updateStory(Long id, StoriesDto storyDto) throws Exception {
        return storiesRepository.findById(id)
                .map(story -> {
                    story.setVnTitle(storyDto.getVnTitle());
                    story.setEngTitle(storyDto.getEngTitle());
                    story.setImage(storyDto.getImage());
                    story.setContent(storyDto.getContent());
                    story.setNewVocab(storyDto.getNewVocab());
                    story.setUpdatedAt(LocalDateTime.now()); // Cập nhật thời gian hiện tại
                    return storiesRepository.save(story);
                })
                .orElseThrow(() -> new Exception("Story not found with id " + id));
    }

    @Override
    public Optional<Stories> getStoryById(Long id) throws Exception {
        return Optional.ofNullable(storiesRepository.findById(id)
                .filter(story -> !story.getIsDeleted())
                .orElseThrow(() -> new Exception("Story not found or has been deleted with id " + id)));
    }

    @Override
    public void softDeleteStory(Long id) throws Exception {
        Stories story = storiesRepository.findById(id)
                .orElseThrow(() -> new Exception("Story not found with id " + id));

        story.setIsDeleted(true);
        story.setDeletedAt(LocalDateTime.now());
        storiesRepository.save(story);
    }

    @Override
    public Page<Stories> getAllStories(int page, int size, String sortField, Boolean sortDirection) {
        // Kiểm tra xem sortField có hợp lệ không
        boolean isValidField = Arrays.stream(Stories.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(fieldName -> fieldName.equals(sortField));

        if (!isValidField) {
            throw new IllegalArgumentException("Invalid sortField: " + sortField);
        }

        // Sắp xếp tăng dần nếu sortDirection là true, giảm dần nếu là false
        Sort.Direction direction = (sortDirection != null && sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Lấy danh sách Story có isDeleted = false
        return storiesRepository.findAllByIsDeletedFalse(pageable);
    }
}
