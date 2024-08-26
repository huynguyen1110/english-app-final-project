package com.example.api.services.impservices;

import com.example.api.entities.Favorites;
import com.example.api.entities.News;
import com.example.api.entities.Users;
import com.example.api.repositories.FavoriteRepository;
import com.example.api.repositories.NewsRepository;
import com.example.api.services.iservices.IFavoritesService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class FavoriteService implements IFavoritesService {

    @Autowired
    private final UserService userService;

    @Autowired
    private final NewsService newsService;

    @Autowired
    private final FavoriteRepository favoriteRepository;

    @Autowired
    private final NewsRepository newsRepository;

    @Transactional
    @Override
    public void addNewsToFavorite(String userEmail, Long newsId) throws Exception {
        Users users = userService.findUserByEmail(userEmail);
        News news = newsService.getNewsById(newsId);


        Favorites favorite = users.getFavorite();
        if (favorite == null) {
            throw new Exception("User does not have a favorite list.");
        }

        if (favorite.getNews().contains(news)) {
            throw new Exception("News already added to favorite");
        }

        news.getFavorites().add(favorite);

        newsRepository.save(news);
    }

    @Override
    public Page<News> getFavoriteNews(int page, int size, String sortField, Boolean sortDirection, String userEmail) throws Exception {

        boolean isValidField = Arrays.stream(News.class.getDeclaredFields())
                .map(Field::getName)
                .anyMatch(fieldName -> fieldName.equals(sortField));

        if (!isValidField) {
            throw new IllegalArgumentException("Invalid sortField: " + sortField);
        }

        Users user = userService.findUserByEmail(userEmail);

        Favorites favorite = user.getFavorite();
        if (favorite == null) {
            throw new Exception("User does not have a favorite list.");
        }

        // If sortDirection == true then sort in ascending order, if false then sort in descending order
        Sort.Direction direction = (sortDirection != null && sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        // Lấy danh sách news từ favorites
        List<News> newsList = favorite.getNews();

        // Tính toán vị trí bắt đầu và kết thúc của trang
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), newsList.size());

        // Kiểm tra nếu end <= start thì trả về một Page rỗng
        if (start >= end) {
            return new PageImpl<>(Collections.emptyList(), pageable, newsList.size());
        }

        // Tạo đối tượng Page từ danh sách và Pageable
        return new PageImpl<>(newsList.subList(start, end), pageable, newsList.size());
    }

}
