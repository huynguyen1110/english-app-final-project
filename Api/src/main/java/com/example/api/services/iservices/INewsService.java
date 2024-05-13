package com.example.api.services.iservices;

import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import com.kwabenaberko.newsapilib.models.response.SourcesResponse;
import org.springframework.stereotype.Service;

@Service
public interface INewsService {

    // Search through millions of articles from over 150,000 large and small news sources and blogs.
    ArticleResponse getAllNews(String domains, String keyWord);

    ArticleResponse getNewsByCategory(String category, String keyWord, String source);
}
