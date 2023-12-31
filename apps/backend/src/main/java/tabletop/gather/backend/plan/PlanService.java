package tabletop.gather.backend.plan;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import tabletop.gather.backend.game.Game;
import tabletop.gather.backend.game.GameDto;
import tabletop.gather.backend.game.GameRepository;
import tabletop.gather.backend.gathering.*;
import tabletop.gather.backend.user.User;
import tabletop.gather.backend.user.UserDto;
import tabletop.gather.backend.user.UserRepository;
import tabletop.gather.backend.util.NotFoundException;

@Service
public class PlanService {

  private final PlanRepository planRepository;
  private final UserRepository userRepository;
  private final GameRepository gameRepository;

  public PlanService(
      final PlanRepository planRepository,
      final UserRepository userRepository,
      final GameRepository gameRepository) {
    this.planRepository = planRepository;
    this.userRepository = userRepository;
    this.gameRepository = gameRepository;
  }

  public List<OverviewPlanDto> findAllExceptUser(UUID userId) {
    final List<Plan> plans = planRepository.findAllByIsPrivateFalse();

    return plans.stream()
        .filter(
            plan ->
                plan.getGatherings().stream()
                        .anyMatch(
                            gathering ->
                                gathering.getDate().isAfter(LocalDate.now())
                                    && (plan.getPlayerLimit() == 0
                                        || gathering.getUsers().size() < plan.getPlayerLimit()))
                    && !plan.getUser().getId().equals(userId))
        .sorted(planComparator)
        .map(plan -> mapToDto(plan, new OverviewPlanDto()))
        .toList();
  }

  public List<OverviewPlanDto> findAll(UUID userId) {
    final List<Plan> plans = planRepository.findAllByUserId(userId);
    return plans.stream()
        .filter(
            plan ->
                plan.getGatherings().stream()
                    .anyMatch(gathering -> gathering.getDate().isAfter(LocalDate.now())))
        .sorted(planComparator)
        .map(plan -> mapToDto(plan, new OverviewPlanDto()))
        .toList();
  }

  public List<OverviewPlanDto> findAllAttending(UUID userId) {
    final List<Plan> plans = planRepository.findAll();
    return plans.stream()
        .filter(
            plan -> {
              HashSet<Gathering> gatherings =
                  plan.getGatherings().stream()
                      .filter(
                          gathering ->
                              gathering.getUsers().stream()
                                  .anyMatch(user -> user.getId().equals(userId)))
                      .collect(Collectors.toCollection(HashSet::new));
              if (!gatherings.isEmpty()) {
                plan.setGatherings(gatherings);
                return true;
              }
              return false;
            })
        .sorted(planComparator)
        .map(plan -> mapToDto(plan, new OverviewPlanDto()))
        .toList();
  }

  public DetailPlanDto getDetail(final UUID id) {
    return planRepository
        .findById(id)
        .map(plan -> mapToDto(plan, new DetailPlanDto()))
        .orElseThrow(() -> new NotFoundException("plan not found"));
  }

  public PlanDto get(final UUID id) {
    return planRepository
        .findById(id)
        .map(plan -> mapToDto(plan, new PlanDto()))
        .orElseThrow(() -> new NotFoundException("plan not found"));
  }

  public UUID create(final CreatePlanDto planDto, final UUID userId) {
    final Plan plan = new Plan();
    final User owner =
        userRepository.findById(userId).orElseThrow(() -> new NotFoundException("user not found"));
    mapToEntity(planDto, plan, owner);
    plan.setUser(owner);
    return planRepository.save(plan).getId();
  }

  public void update(final UUID id, final UpdatePlanDto planDto) {
    final Plan plan =
        planRepository.findById(id).orElseThrow(() -> new NotFoundException("plan not found"));
    mapToEntity(planDto, plan);
    planRepository.save(plan);
  }

  public void delete(final UUID id) {
    planRepository.deleteById(id);
  }

  private PlanDto mapToDto(final Plan plan, final PlanDto planDto) {
    planDto.setId(plan.getId());
    planDto.setName(plan.getName());
    planDto.setIsPrivate(plan.getIsPrivate());
    planDto.setDescription(plan.getDescription());
    planDto.setPlayerLimit(plan.getPlayerLimit());
    planDto.setUser(plan.getUser() == null ? null : plan.getUser().getId());
    planDto.setGame(plan.getGame() == null ? null : plan.getGame().getId());
    return planDto;
  }

  private OverviewPlanDto mapToDto(Plan plan, OverviewPlanDto overviewPlanDto) {
    overviewPlanDto.setId(plan.getId());
    overviewPlanDto.setName(plan.getName());
    overviewPlanDto.setIsPrivate(plan.getIsPrivate());
    overviewPlanDto.setDescription(plan.getDescription());
    overviewPlanDto.setPlayerLimit(plan.getPlayerLimit());

    User owner = plan.getUser();
    overviewPlanDto.setOwnerName(String.format("%s %s", owner.getFirstName(), owner.getLastName()));

    GameDto gameDto = new GameDto();
    Game game = plan.getGame();
    if (game != null) {
      gameDto.setId(game.getId());
      gameDto.setName(game.getName());
      gameDto.setDescription(game.getDescription());
      gameDto.setImageUrl(game.getImageUrl());
      gameDto.setMinPlayer(game.getMinPlayer());
      gameDto.setMaxPlayer(game.getMaxPlayer());
      overviewPlanDto.setGame(gameDto);
    }

    Set<Gathering> gatherings = plan.getGatherings();
    List<OverviewGatheringDto> gatheringDtos = new ArrayList<>();
    gatherings.forEach(
        gathering -> {
          OverviewGatheringDto gatheringDto = new OverviewGatheringDto();
          gatheringDto.setId(gathering.getId());
          gatheringDto.setDate(gathering.getDate());
          gatheringDto.setStartTime(gathering.getStartTime());
          gatheringDtos.add(gatheringDto);
        });
    overviewPlanDto.setGatheringDtos(gatheringDtos);

    return overviewPlanDto;
  }

  private DetailPlanDto mapToDto(final Plan plan, final DetailPlanDto planDto) {
    planDto.setId(plan.getId());
    planDto.setName(plan.getName());
    planDto.setIsPrivate(plan.getIsPrivate());
    planDto.setDescription(plan.getDescription());
    planDto.setPlayerLimit(plan.getPlayerLimit());

    User owner = plan.getUser();
    UserDto ownerDto = new UserDto();
    ownerDto.setId(owner.getId());
    ownerDto.setUsername(owner.getNonUserDetailsUsername());
    ownerDto.setFirstName(owner.getFirstName());
    ownerDto.setLastName(owner.getLastName());
    ownerDto.setEmail(owner.getEmail());
    planDto.setOwner(ownerDto);

    Game game = plan.getGame();
    if (game != null) {
      GameDto gameDto = new GameDto();
      gameDto.setId(game.getId());
      gameDto.setName(game.getName());
      gameDto.setDescription(game.getDescription());
      gameDto.setImageUrl(game.getImageUrl());
      planDto.setGame(gameDto);
    }

    Set<Gathering> gatherings = plan.getGatherings();
    List<DetailGatheringDto> gatheringDtos = new ArrayList<>();
    gatherings.forEach(
        gathering -> {
          DetailGatheringDto gatheringDto = new DetailGatheringDto();
          gatheringDto.setId(gathering.getId());
          gatheringDto.setDate(gathering.getDate());
          gatheringDto.setStartTime(gathering.getStartTime());
          gatheringDto.setParticipantCount(gathering.getUsers().size());
          gatheringDtos.add(gatheringDto);
        });
    planDto.setGatherings(gatheringDtos);

    return planDto;
  }

  private Plan mapToEntity(final CreatePlanDto planDto, final Plan plan, final User owner) {
    plan.setName(planDto.getName());
    plan.setIsPrivate(planDto.getIsPrivate());
    plan.setDescription(planDto.getDescription());
    plan.setPlayerLimit(planDto.getPlayerLimit());
    final Game game =
        planDto.getGameId() == null
            ? null
            : gameRepository
                .findById(planDto.getGameId())
                .orElseThrow(() -> new NotFoundException("game not found"));
    plan.setGame(game);
    Set<Gathering> gatherings = new HashSet<>();
    planDto
        .getGatherings()
        .forEach(
            gatheringDto -> {
              Gathering gathering = new Gathering();
              gathering.setPlan(plan);
              gathering.setDate(gatheringDto.getDate());
              gathering.setStartTime(gatheringDto.getStartTime());
              gathering.setUsers(new HashSet<>(List.of(owner)));
              gatherings.add(gathering);
            });
    plan.setGatherings(gatherings);
    return plan;
  }

  private Plan mapToEntity(final UpdatePlanDto planDto, final Plan plan) {
    plan.setName(planDto.getName());
    plan.setIsPrivate(planDto.getIsPrivate());
    plan.setDescription(planDto.getDescription());
    plan.setPlayerLimit(planDto.getPlayerLimit());
    final Game game =
        planDto.getGame() == null
            ? null
            : gameRepository
                .findById(planDto.getGame())
                .orElseThrow(() -> new NotFoundException("game not found"));
    plan.setGame(game);
    return plan;
  }

  private Comparator<Plan> planComparator =
      new Comparator<Plan>() {
        @Override
        public int compare(Plan plan1, Plan plan2) {
          return plan1.getGatherings().stream()
              .map(Gathering::getDate)
              .min(LocalDate::compareTo)
              .orElse(LocalDate.MAX)
              .compareTo(
                  plan2.getGatherings().stream()
                      .map(Gathering::getDate)
                      .min(LocalDate::compareTo)
                      .orElse(LocalDate.MAX));
        }
      };
}
