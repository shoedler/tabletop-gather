package tabletop.gather.backend.plan;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanDto {

  private UUID id;

  @NotNull
  @Size(max = 255)
  private String name;

  @NotNull
  @JsonProperty("isPrivate")
  private Boolean isPrivate;

  private String description;

  private int playerLimit;

  private UUID user;

  private UUID game;
}
