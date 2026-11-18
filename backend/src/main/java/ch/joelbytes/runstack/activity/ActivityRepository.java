package ch.joelbytes.runstack.activity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    Optional<Activity> findByFitFileHash(String fitFileHash);
}
