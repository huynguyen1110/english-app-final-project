package com.example.api.services.iservices;

import com.example.api.dtos.topic.TopicDto;
import com.example.api.entities.Topic;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ITopicService {

    Topic createTopic(TopicDto topicDto);

    Page<Topic> getAllTopics(int pageNumber, int pageSize);

    Topic updateTopic(long id, TopicDto topicDto) throws Exception;

    void deleteTopic(long id) throws Exception;
}
