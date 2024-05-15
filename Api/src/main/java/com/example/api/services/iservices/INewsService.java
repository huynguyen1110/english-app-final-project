package com.example.api.services.iservices;

import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import org.springframework.stereotype.Service;

@Service
public interface INewsService {

    ArticleResponse getAllNews(String domains, String keyWord);
}
