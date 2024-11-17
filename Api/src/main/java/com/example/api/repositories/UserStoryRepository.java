package com.example.api.repositories;

import com.example.api.entities.Stories;
import com.example.api.entities.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, Long> {

    @Query("SELECT us FROM UserStory us WHERE us.user.userId = :userId AND us.stories.id = :storyId")
    Optional<UserStory> findByUserAndStory(@Param("userId") Long userId, @Param("storyId") Long storyId);

    @Query("SELECT us.stories FROM UserStory us WHERE us.user.userId = :userId")
    List<Stories> findFinishedStoriesByUserId(@Param("userId") Long userId);
}
