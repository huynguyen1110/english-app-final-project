package com.example.api.services.impservices;

import com.example.api.services.iservices.INewsService;
import com.kwabenaberko.newsapilib.NewsApiClient;
import com.kwabenaberko.newsapilib.models.request.EverythingRequest;
import com.kwabenaberko.newsapilib.models.request.TopHeadlinesRequest;
import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import com.kwabenaberko.newsapilib.models.response.SourcesResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
public class NewsService implements INewsService {

    @Value("${news.api.key}")
    private String newsApiKey;

    @Override
    public ArticleResponse getAllNews(String domains, String keyWord) {
        NewsApiClient newsApiClient = new NewsApiClient(newsApiKey);

        CompletableFuture<ArticleResponse> future = new CompletableFuture<>();
        newsApiClient.getEverything(
                new EverythingRequest.Builder()
                        .domains(domains)
                        .language("en")
                        .q(keyWord)
                        .build(),
                new NewsApiClient.ArticlesResponseCallback() {
                    @Override
                    public void onSuccess(ArticleResponse response) {
                        log.info("Received news response: {}", response);
                        future.complete(response);
                    }

                    @Override
                    public void onFailure(Throwable throwable) {
                        log.error(throwable.getMessage());
                    }
                }
        );

        try {
            return future.get(); // Waits for the future to complete
        } catch (InterruptedException | ExecutionException e) {
            log.error("Exception while fetching news: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public ArticleResponse getNewsByCategory(String category, String keyWord, String sources) {
        NewsApiClient newsApiClient = new NewsApiClient(newsApiKey);

        CompletableFuture<ArticleResponse> future = new CompletableFuture<>();
        newsApiClient.getTopHeadlines(
                new TopHeadlinesRequest.Builder()
                        .q(keyWord)
                        .language("en")
                        .sources(sources)
                        .category(category)
                        .build(),
                new NewsApiClient.ArticlesResponseCallback() {
                    @Override
                    public void onSuccess(ArticleResponse response) {
                        log.info("Received news response: {}", response);
                        future.complete(response);
                    }

                    @Override
                    public void onFailure(Throwable throwable) {
                        log.error(throwable.getMessage());
                    }
                }
        );
        try {
            return future.get(); // Waits for the future to complete
        } catch (Exception e) {
            log.error("Exception while fetching news: {}", e.getMessage());
            return null;
        }
    }
}
