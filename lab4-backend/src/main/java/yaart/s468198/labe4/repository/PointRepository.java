package yaart.s468198.labe4.repository;

import yaart.s468198.labe4.model.Point;
import yaart.s468198.labe4.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
    List<Point> findByUserOrderByCreatedAtDesc(User user);
    void deleteAllByUser(User user);
}