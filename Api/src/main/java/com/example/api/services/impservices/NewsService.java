package com.example.api.services.impservices;

import com.example.api.dtos.news.NewsDto;
import com.example.api.entities.News;
import com.example.api.entities.Topic;
import com.example.api.repositories.NewsRepository;
import com.example.api.repositories.TopicRepository;
import com.example.api.services.iservices.INewsService;
import com.kwabenaberko.newsapilib.NewsApiClient;
import com.kwabenaberko.newsapilib.models.request.EverythingRequest;
import com.kwabenaberko.newsapilib.models.request.TopHeadlinesRequest;
import com.kwabenaberko.newsapilib.models.response.ArticleResponse;
import lombok.extern.slf4j.Slf4j;
import net.dankito.readability4j.Article;
import net.dankito.readability4j.Readability4J;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.HttpStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.lang.reflect.Field;
import java.util.Arrays;

@Service
@Slf4j
public class NewsService implements INewsService {

    @Value("${news.api.key}")
    private String newsApiKey;

    @Autowired
    private final NewsRepository newsRepository;

    @Autowired
    private final TopicRepository topicRepository;

    public NewsService(NewsRepository newsRepository, TopicRepository topicRepository) {
        this.newsRepository = newsRepository;
        this.topicRepository = topicRepository;
    }

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

    @Override
    public void createNews(NewsDto newsDto) throws Exception {
        if (newsDto == null || newsDto.getTitle() == null || newsDto.getContent() == null) {
            throw new IllegalArgumentException("NewsDto and its required fields must not be null");
        }

        Optional<Topic> optionalTopic = topicRepository.findTopicById(newsDto.getTopicId());

        Topic topic = optionalTopic.orElseThrow(() -> new Exception("Topic not found with id: " + newsDto.getTopicId()));

        News news = News.builder()
                .title(newsDto.getTitle())
                .content(newsDto.getContent())
                .sourceName(newsDto.getSourceName())
                .description(newsDto.getDescription())
                .author(newsDto.getAuthor())
                .imageUrl(newsDto.getImageUrl())
                .sourceUrl(newsDto.getSourceUrl())
                .publishedAt(newsDto.getPublishedAt())
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .topic(topic)
                .build();

        try {
            newsRepository.save(news);
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    @Override
    public Page<News> getNewsFromDatabase(int page, int size, String sortField, Boolean sortDirection, Long topicId) {
        boolean isValidField = Arrays.stream(News.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(fieldName -> fieldName.equals(sortField));

        if (!isValidField) {
            throw new IllegalArgumentException("Invalid sortField: " + sortField);
        }

        // If sortDirection == true then sort in ascending order, if false then sort in descending order
        Sort.Direction direction = (sortDirection != null && sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return newsRepository.findAllNews(topicId, pageable);
    }

    @Override
    public Page<News> getNewsFromDatabaseGroupBySourceName(int page, int size, String sortField, Boolean sortDirection, String sourceName) {
        boolean isValidField = Arrays.stream(News.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(fieldName -> fieldName.equals(sortField));

        if (!isValidField) {
            throw new IllegalArgumentException("Invalid sortField: " + sortField);
        }

        // If sortDirection == true then sort in ascending order, if false then sort in descending order
        Sort.Direction direction = (sortDirection != null && sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);
        return newsRepository.findBySourceNameAndIsDeletedFalse(pageable, sourceName);
    }

    @Override
    public News getNewsById(Long newsId) throws Exception {
        Optional<News> newsOptional = newsRepository.findNewsById(newsId);
        News news = newsOptional.orElseThrow(() -> new Exception("This newsId is not existed"));
        return news;
    }

    @Override
    public void updateNews(NewsDto newsDto, long id) throws Exception {

        Optional<News> optionalNews = newsRepository.findNewsById(id);

        News news = optionalNews.orElseThrow(() -> new Exception("This newsId is not existed or it already deleted"));

        Optional<Topic> optionalTopic = topicRepository.findTopicById(newsDto.getTopicId());

        Topic topic = optionalTopic.orElseThrow(() -> new Exception("Topic not found with id: " + newsDto.getTopicId()));

        news.setTitle(newsDto.getTitle());
        news.setContent(newsDto.getContent());
        news.setSourceName(newsDto.getSourceName());
        news.setDescription(newsDto.getDescription());
        news.setAuthor(newsDto.getAuthor());
        news.setImageUrl(newsDto.getImageUrl());
        news.setSourceUrl(newsDto.getSourceUrl());
        news.setPublishedAt(newsDto.getPublishedAt());
        news.setTopic(topic);
        news.setUpdatedAt(LocalDateTime.now());

        newsRepository.save(news);
    }

    @Override
    public void deleteNews(long id) throws Exception {
        Optional<News> optionalNews = newsRepository.findNewsById(id);

        News news = optionalNews.orElseThrow(() -> new Exception("This newsId is not existed or it already deleted"));

        news.setIsDeleted(true);

        newsRepository.save(news);
    }

    @Override
    public String getNewsContent(String articleUrl) throws Exception {
        try {
            // Bước 1: Gửi yêu cầu đến News API
            Document articleHtml = Jsoup.connect(articleUrl).get();
            Readability4J readability4J = new Readability4J(articleUrl, articleHtml); // url is just needed to resolve relative urls
            Article article = readability4J.parse();
            String aricleContent = article.getTextContent();
            return aricleContent;
        } catch (HttpStatusException e) {
            System.out.println("HTTP error: " + e.getStatusCode());
            throw new Exception(e);
        } catch (IOException e) {
            System.out.println("Error fetching data: " + e.getMessage());
            throw new Exception(e);
        }
    }
}
