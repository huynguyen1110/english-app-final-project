package com.example.api.services.impservices;

import com.example.api.dtos.topic.TopicDto;
import com.example.api.entities.Topic;
import com.example.api.repositories.TopicRepository;
import com.example.api.services.iservices.ITopicService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TopicService implements ITopicService {

    @Autowired
    private final TopicRepository topicRepository;

    @Override
    public Topic createTopic(TopicDto topicDto) {
        Topic topic = Topic.builder()
                .topicName(topicDto.getTopicName())
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();
        topicRepository.save(topic);
        return topic;
    }

    @Override
    public Page<Topic> getAllTopics(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return topicRepository.findAllActiveTopics(pageable);
    }

    @Override
    public Topic updateTopic(long id, TopicDto topicDto) throws Exception {
        Optional<Topic> optionalTopic = topicRepository.findTopicById(id);

        Topic topic = optionalTopic.orElseThrow(() -> new Exception("Topic not found with id: " + id));

        topic.setTopicName(topicDto.getTopicName());
        topic.setUpdatedAt(LocalDateTime.now());

        topicRepository.save(topic);
        return topic;
    }

    @Override
    public void deleteTopic(long id) throws Exception {
        Optional<Topic> optionalTopic = topicRepository.findTopicById(id);

        Topic topic = optionalTopic.orElseThrow(() -> new Exception("Topic not found with id: " + id));

        if (topic.getIsDeleted()) {
            throw new Exception("Topic with id: " + id + " has already been deleted");
        }

        topic.setIsDeleted(true);
        topic.setDeletedAt(LocalDateTime.now());

        topicRepository.save(topic);
    }
}
