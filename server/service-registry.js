'use strict';
/** VaultCheck production service registry. */

const { AccountService } = require('./modules/account');
const { PolicyService } = require('./modules/policy');
const { ScoringService } = require('./modules/scoring');
const { EntropyService } = require('./modules/entropy');
const { PatternService } = require('./modules/pattern');
const { BreachService } = require('./modules/breach');
const { AuditService } = require('./modules/audit');
const { ReportService } = require('./modules/report');
const { DashboardService } = require('./modules/dashboard');
const { SessionService } = require('./modules/session');
const { DeviceService } = require('./modules/device');
const { AlertService } = require('./modules/alert');
const { NotificationService } = require('./modules/notification');
const { RiskService } = require('./modules/risk');
const { RuleService } = require('./modules/rule');
const { MetricService } = require('./modules/metric');
const { TrendService } = require('./modules/trend');
const { BenchmarkService } = require('./modules/benchmark');
const { GeneratorService } = require('./modules/generator');
const { DictionaryService } = require('./modules/dictionary');
const { CharsetService } = require('./modules/charset');
const { ComplexityService } = require('./modules/complexity');
const { QualityService } = require('./modules/quality');
const { ComplianceService } = require('./modules/compliance');
const { GovernanceService } = require('./modules/governance');
const { RetentionService } = require('./modules/retention');
const { ExportService } = require('./modules/export');
const { ImporterService } = require('./modules/importer');
const { CacheService } = require('./modules/cache');
const { QueueService } = require('./modules/queue');
const { WorkerService } = require('./modules/worker');
const { HealthService } = require('./modules/health');
const { DiagnosticService } = require('./modules/diagnostic');
const { TelemetryService } = require('./modules/telemetry');
const { PrivacyService } = require('./modules/privacy');
const { RedactionService } = require('./modules/redaction');
const { ValidationService } = require('./modules/validation');
const { NormalizationService } = require('./modules/normalization');
const { SerializationService } = require('./modules/serialization');
const { PaginationService } = require('./modules/pagination');
const { SearchService } = require('./modules/search');
const { FilterService } = require('./modules/filter');
const { SortService } = require('./modules/sort');
const { GroupService } = require('./modules/group');
const { TimelineService } = require('./modules/timeline');
const { SnapshotService } = require('./modules/snapshot');
const { ChangeService } = require('./modules/change');
const { VersionService } = require('./modules/version');
const { FeatureService } = require('./modules/feature');
const { ConfigService } = require('./modules/config');
const { LocaleService } = require('./modules/locale');
const { TimezoneService } = require('./modules/timezone');
const { ScheduleService } = require('./modules/schedule');
const { RateService } = require('./modules/rate');
const { ThrottleService } = require('./modules/throttle');
const { QuotaService } = require('./modules/quota');
const { CapacityService } = require('./modules/capacity');
const { CatalogService } = require('./modules/catalog');
const { RegistryService } = require('./modules/registry');
const { RoutingService } = require('./modules/routing');
const { RequestService } = require('./modules/request');
const { ResponseService } = require('./modules/response');
const { ErrorService } = require('./modules/error');
const { SecurityService } = require('./modules/security');
const { IntegrityService } = require('./modules/integrity');
const { ChecksumService } = require('./modules/checksum');
const { CryptoService } = require('./modules/crypto');
const { MathService } = require('./modules/math');
const { StatisticsService } = require('./modules/statistics');
const { SamplingService } = require('./modules/sampling');
const { ThresholdService } = require('./modules/threshold');
const { DecisionService } = require('./modules/decision');
const { ExplanationService } = require('./modules/explanation');
const { RecommendationService } = require('./modules/recommendation');
const { WorkflowService } = require('./modules/workflow');
const { ApprovalService } = require('./modules/approval');
const { ReviewService } = require('./modules/review');
const { CaseService } = require('./modules/case');
const { IncidentService } = require('./modules/incident');
const { InvestigationService } = require('./modules/investigation');
const { EvidenceService } = require('./modules/evidence');
const { FindingService } = require('./modules/finding');
const { ControlService } = require('./modules/control');
const { AssetService } = require('./modules/asset');
const { InventoryService } = require('./modules/inventory');
const { ProjectService } = require('./modules/project');
const { TeamService } = require('./modules/team');
const { RoleService } = require('./modules/role');
const { PermissionService } = require('./modules/permission');
const { AccessService } = require('./modules/access');
const { CredentialService } = require('./modules/credential');
const { SecretService } = require('./modules/secret');
const { KeyService } = require('./modules/key');
const { RotationService } = require('./modules/rotation');
const { BackupService } = require('./modules/backup');
const { RecoveryService } = require('./modules/recovery');
const { MigrationService } = require('./modules/migration');
const { StorageService } = require('./modules/storage');
const { FileService } = require('./modules/file');
const { DocumentService } = require('./modules/document');
const { TemplateService } = require('./modules/template');
const { ThemeService } = require('./modules/theme');
const { UiService } = require('./modules/ui');
const { AccessibilityService } = require('./modules/accessibility');
const { PerformanceService } = require('./modules/performance');
const { LatencyService } = require('./modules/latency');
const { AvailabilityService } = require('./modules/availability');
const { ReliabilityService } = require('./modules/reliability');
const { MaintenanceService } = require('./modules/maintenance');
const { ReleaseService } = require('./modules/release');
const { DeploymentService } = require('./modules/deployment');
const { EnvironmentService } = require('./modules/environment');
const { IntegrationService } = require('./modules/integration');
const { ProviderService } = require('./modules/provider');
const { HibpService } = require('./modules/hibp');
const { OfflineService } = require('./modules/offline');
const { HashService } = require('./modules/hash');
const { PasswordService } = require('./modules/password');
const { StrengthService } = require('./modules/strength');
const { EducationService } = require('./modules/education');
const { TipService } = require('./modules/tip');
const { FaqService } = require('./modules/faq');
const { HelpService } = require('./modules/help');
const { FeedbackService } = require('./modules/feedback');
const { SurveyService } = require('./modules/survey');
const { ExperimentService } = require('./modules/experiment');
const { FeatureusageService } = require('./modules/featureusage');
const { LicenseService } = require('./modules/license');
const { AboutService } = require('./modules/about');
const { StatusService } = require('./modules/status');
const { ApiService } = require('./modules/api');
const { SchemaService } = require('./modules/schema');
const { VersioningService } = require('./modules/versioning');
const { CompatibilityService } = require('./modules/compatibility');
const { StartupService } = require('./modules/startup');
const { ShutdownService } = require('./modules/shutdown');
const { LoggerService } = require('./modules/logger');
const { RedactlogService } = require('./modules/redactlog');
const { MonitorService } = require('./modules/monitor');
const { WatchService } = require('./modules/watch');
const { PolicysetService } = require('./modules/policyset');
const { BenchmarksetService } = require('./modules/benchmarkset');
const { SecuritycenterService } = require('./modules/securitycenter');
const { OverviewService } = require('./modules/overview');

const SERVICES = {
  account: AccountService,
  policy: PolicyService,
  scoring: ScoringService,
  entropy: EntropyService,
  pattern: PatternService,
  breach: BreachService,
  audit: AuditService,
  report: ReportService,
  dashboard: DashboardService,
  session: SessionService,
  device: DeviceService,
  alert: AlertService,
  notification: NotificationService,
  risk: RiskService,
  rule: RuleService,
  metric: MetricService,
  trend: TrendService,
  benchmark: BenchmarkService,
  generator: GeneratorService,
  dictionary: DictionaryService,
  charset: CharsetService,
  complexity: ComplexityService,
  quality: QualityService,
  compliance: ComplianceService,
  governance: GovernanceService,
  retention: RetentionService,
  export: ExportService,
  importer: ImporterService,
  cache: CacheService,
  queue: QueueService,
  worker: WorkerService,
  health: HealthService,
  diagnostic: DiagnosticService,
  telemetry: TelemetryService,
  privacy: PrivacyService,
  redaction: RedactionService,
  validation: ValidationService,
  normalization: NormalizationService,
  serialization: SerializationService,
  pagination: PaginationService,
  search: SearchService,
  filter: FilterService,
  sort: SortService,
  group: GroupService,
  timeline: TimelineService,
  snapshot: SnapshotService,
  change: ChangeService,
  version: VersionService,
  feature: FeatureService,
  config: ConfigService,
  locale: LocaleService,
  timezone: TimezoneService,
  schedule: ScheduleService,
  rate: RateService,
  throttle: ThrottleService,
  quota: QuotaService,
  capacity: CapacityService,
  catalog: CatalogService,
  registry: RegistryService,
  routing: RoutingService,
  request: RequestService,
  response: ResponseService,
  error: ErrorService,
  security: SecurityService,
  integrity: IntegrityService,
  checksum: ChecksumService,
  crypto: CryptoService,
  math: MathService,
  statistics: StatisticsService,
  sampling: SamplingService,
  threshold: ThresholdService,
  decision: DecisionService,
  explanation: ExplanationService,
  recommendation: RecommendationService,
  workflow: WorkflowService,
  approval: ApprovalService,
  review: ReviewService,
  case: CaseService,
  incident: IncidentService,
  investigation: InvestigationService,
  evidence: EvidenceService,
  finding: FindingService,
  control: ControlService,
  asset: AssetService,
  inventory: InventoryService,
  project: ProjectService,
  team: TeamService,
  role: RoleService,
  permission: PermissionService,
  access: AccessService,
  credential: CredentialService,
  secret: SecretService,
  key: KeyService,
  rotation: RotationService,
  backup: BackupService,
  recovery: RecoveryService,
  migration: MigrationService,
  storage: StorageService,
  file: FileService,
  document: DocumentService,
  template: TemplateService,
  theme: ThemeService,
  ui: UiService,
  accessibility: AccessibilityService,
  performance: PerformanceService,
  latency: LatencyService,
  availability: AvailabilityService,
  reliability: ReliabilityService,
  maintenance: MaintenanceService,
  release: ReleaseService,
  deployment: DeploymentService,
  environment: EnvironmentService,
  integration: IntegrationService,
  provider: ProviderService,
  hibp: HibpService,
  offline: OfflineService,
  hash: HashService,
  password: PasswordService,
  strength: StrengthService,
  education: EducationService,
  tip: TipService,
  faq: FaqService,
  help: HelpService,
  feedback: FeedbackService,
  survey: SurveyService,
  experiment: ExperimentService,
  featureusage: FeatureusageService,
  license: LicenseService,
  about: AboutService,
  status: StatusService,
  api: ApiService,
  schema: SchemaService,
  versioning: VersioningService,
  compatibility: CompatibilityService,
  startup: StartupService,
  shutdown: ShutdownService,
  logger: LoggerService,
  redactlog: RedactlogService,
  monitor: MonitorService,
  watch: WatchService,
  policyset: PolicysetService,
  benchmarkset: BenchmarksetService,
  securitycenter: SecuritycenterService,
  overview: OverviewService,
};

function createService(name, options = {}) {
  const Service = SERVICES[name];
  if (!Service) throw new Error(`Unknown service: ${name}`);
  return new Service(options);
}

function listServices() { return Object.keys(SERVICES).sort(); }

function healthSnapshot() {
  return Object.fromEntries(Object.entries(SERVICES).map(([name, Service]) => {
    const service = new Service();
    return [name, service.health()];
  }));
}

module.exports = { SERVICES, createService, listServices, healthSnapshot };
