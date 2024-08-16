package com.example.api.services.iservices;

import com.example.api.dtos.news.NewsDto;
import com.example.api.entities.News;
import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface INewsService {

    // Search through millions of articles from over 150,000 large and small news sources and blogs.
    ArticleResponse getAllNews(String domains, String keyWord);

    ArticleResponse getNewsByCategory(String category, String keyWord, String source);

    void createNews(NewsDto newsDto) throws Exception;

    Page<News> getNewsFromDatabase(int page, int size, String sortField, Boolean sortDirection, Long topicId);

    Page<News> getNewsFromDatabaseGroupBySourceName(int page, int size, String sortField, Boolean sortDirection, String sourceName);

    News getNewsById(Long newsId) throws Exception;

    void updateNews(NewsDto newsDto, long id) throws Exception;

    void deleteNews(long id) throws Exception;
}
