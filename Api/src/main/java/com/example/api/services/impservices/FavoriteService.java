package com.example.api.services.impservices;

import com.example.api.entities.Favorites;
import com.example.api.entities.News;
import com.example.api.entities.Users;
import com.example.api.repositories.FavoriteRepository;
import com.example.api.repositories.NewsRepository;
import com.example.api.repositories.UserRepository;
import com.example.api.services.iservices.IFavoritesService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

        favorite.getNews().add(news);
        favoriteRepository.save(favorite);

        favorite.getNews().add(news);
        news.getFavorites().add(favorite);

        favoriteRepository.save(favorite);
        newsRepository.save(news);
    }
}
