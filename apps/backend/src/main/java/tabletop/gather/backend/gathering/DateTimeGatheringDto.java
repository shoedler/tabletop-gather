package tabletop.gather.backend.gathering;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DateTimeGatheringDto {

  private LocalDate date;

  private LocalTime startTime;
}
