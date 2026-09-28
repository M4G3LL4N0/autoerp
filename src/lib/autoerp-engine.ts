import {
  APPROVAL_OWNERS,
  DEPARTMENT_LINKS,
  type ApprovalStage,
  type Department,
  type DepartmentNode,
  type InventoryExposure,
  type PlannerInput,
  type PlannerResult,
  type ProcurementStage,
  type RoadmapPhase,
} from "./autoerp-data";

const MODEL_VERSION = "autoerp-enterprise-ops-2.0.0";

function sizeWeight(size: PlannerInput["companySize"]): number {
  if (size === "10-50") return 2;
  if (size === "51-200") return 5;
  if (size === "201-1000") return 9;
  return 14;
}

function bottleneckWeight(bottleneck: PlannerInput["bottleneck"]): number {
  const weights: Record<PlannerInput["bottleneck"], number> = {
    "Approval bottlenecks": 10,
    "Manual reconciliation": 9,
    "Data silos": 8,
    "Inventory drift": 7,
    "Delayed KPI visibility": 6,
  };
  return weights[bottleneck];
}

function procurementWeight(complexity: PlannerInput["procurementComplexity"]): number {
  if (complexity === "Low") return 2;
  if (complexity === "Medium") return 5;
  return 9;
}

function inventoryWeight(profile: PlannerInput["inventoryProfile"]): number {
  if (profile === "Lean") return 2;
  if (profile === "Balanced") return 4;
  if (profile === "High SKU") return 7;
  return 8;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mapDepartments(input: PlannerInput, sizeW: number, bottleneckW: number): DepartmentNode[] {
  return input.departments.map((department, index) => {
    const automationScore = clamp(
      58 + sizeW + bottleneckW - index * 2 + procurementWeight(input.procurementComplexity),
      42,
      98,
    );
    const riskLevel =
      automationScore < 62 ? "high" : automationScore < 78 ? "medium" : "low";
    const status =
      automationScore > 85
        ? "manual"
        : automationScore > 68
          ? "semi-automated"
          : "automated";

    return {
      department,
      status,
      automationScore,
      riskLevel,
      connectedTo: DEPARTMENT_LINKS[department].filter((d) =>
        input.departments.includes(d),
      ),
    };
  });
}

function buildApprovalBottlenecks(input: PlannerInput, sizeW: number): ApprovalStage[] {
  const baseHours =
    input.bottleneck === "Approval bottlenecks"
      ? 52
      : input.bottleneck === "Manual reconciliation"
        ? 38
        : 28;

  const stages = [
    { stage: "Request intake", owner: "Operations coordinator", offset: 0 },
    { stage: "Policy validation", owner: "Finance controller", offset: 8 },
    { stage: "Budget release", owner: "Department head", offset: 14 },
    { stage: "Vendor / HR clearance", owner: APPROVAL_OWNERS.Procurement, offset: 20 },
    { stage: "Executive sign-off", owner: "COO", offset: 26 },
  ];

  return stages.map((stage) => {
    const medianHours = baseHours + stage.offset + sizeW * 2;
    const severity =
      medianHours > 70 ? "high" : medianHours > 45 ? "medium" : "low";
    return {
      stage: stage.stage,
      owner: stage.owner,
      medianHours,
      severity,
    };
  });
}

function buildProcurementPipeline(
  input: PlannerInput,
  procurementW: number,
): ProcurementStage[] {
  const stages: ProcurementStage[] = [
    {
      stage: "Requisition",
      volume: 120 + procurementW * 18,
      cycleDays: 2 + procurementW,
      status: procurementW > 6 ? "watch" : "healthy",
    },
    {
      stage: "Sourcing",
      volume: 96 + procurementW * 14,
      cycleDays: 5 + procurementW * 2,
      status: procurementW > 7 ? "blocked" : "watch",
    },
    {
      stage: "Contracting",
      volume: 72 + procurementW * 10,
      cycleDays: 8 + procurementW * 2,
      status: procurementW > 6 ? "watch" : "healthy",
    },
    {
      stage: "Receiving",
      volume: 88 + procurementW * 12,
      cycleDays: 4 + procurementW,
      status: input.inventoryProfile === "Regulated" ? "watch" : "healthy",
    },
    {
      stage: "Invoice match",
      volume: 110 + procurementW * 16,
      cycleDays: 6 + procurementW,
      status: input.bottleneck === "Manual reconciliation" ? "blocked" : "watch",
    },
  ];

  return stages;
}

function buildInventoryExposure(
  input: PlannerInput,
  inventoryW: number,
  sizeW: number,
): InventoryExposure {
  return {
    profile: input.inventoryProfile,
    stockoutRisk: clamp(18 + inventoryW * 6 + sizeW, 10, 95),
    carryingCostUsd: Math.round((180000 + inventoryW * 42000 + sizeW * 28000) / 1000) * 1000,
    skuPressure: clamp(24 + inventoryW * 8, 15, 98),
    complianceLoad:
      input.inventoryProfile === "Regulated"
        ? clamp(72 + sizeW * 2, 40, 99)
        : clamp(28 + inventoryW * 4, 10, 80),
  };
}

function buildRoadmap(input: PlannerInput, sizeW: number): RoadmapPhase[] {
  const modules = input.departments.slice(0, 3);
  return [
    {
      phase: "Stabilize operating map",
      durationWeeks: 4 + Math.min(sizeW, 6),
      focus: "Map approvals, inventory, and procurement handoffs before module rollout.",
      modules: modules.length ? modules : ["Finance"],
    },
    {
      phase: "Automate approval fabric",
      durationWeeks: 6 + sizeW,
      focus: "Deploy policy-aware routing for requisitions, close tasks, and vendor intake.",
      modules: ["Workflow automation", "Approvals"],
    },
    {
      phase: "Unify finance and supply signals",
      durationWeeks: 8 + sizeW,
      focus: `Connect ${input.workflow.toLowerCase()} with procurement and inventory exposure controls.`,
      modules: ["Finance", "Procurement", "Inventory"],
    },
    {
      phase: "Scale enterprise command center",
      durationWeeks: 10 + sizeW,
      focus: "Launch executive operating map, risk monitors, and savings tracking.",
      modules: ["Reporting", "Automation score", "Executive OS"],
    },
  ];
}

function buildAutomationOpportunities(input: PlannerInput): string[] {
  return [
    `Route ${input.workflow.toLowerCase()} exceptions into a single owner queue with SLA timers.`,
    "Replace spreadsheet approvals with threshold-based policy automation.",
    "Synchronize procurement, inventory, and finance master data before ERP module expansion.",
    `Reduce ${input.bottleneck.toLowerCase()} with event-driven handoffs across selected departments.`,
    "Instrument department interactions to expose hidden queue time before go-live.",
  ];
}

export function runEnterprisePlanner(input: PlannerInput): PlannerResult {
  const sizeW = sizeWeight(input.companySize);
  const bottleneckW = bottleneckWeight(input.bottleneck);
  const procurementW = procurementWeight(input.procurementComplexity);
  const inventoryW = inventoryWeight(input.inventoryProfile);
  const deptW = input.departments.length * 3;

  const workflowComplexityScore = clamp(
    Math.round(58 + sizeW * 1.4 + deptW + bottleneckW + procurementW + inventoryW * 0.8),
    40,
    99,
  );

  const operationalRisk = clamp(
    Math.round(34 + bottleneckW * 2.2 + procurementW * 1.6 + inventoryW * 1.4 + sizeW),
    18,
    96,
  );

  const estimatedSavingsUsdYear =
    Math.round(
      (140000 + sizeW * 52000 + deptW * 21000 + bottleneckW * 11000 + procurementW * 9000 + inventoryW * 8000) /
        1000,
    ) * 1000;

  const recommendedTier =
    workflowComplexityScore > 88
      ? "Enterprise"
      : workflowComplexityScore > 74
        ? "Scale"
        : "Growth";

  const departmentMap = mapDepartments(input, sizeW, bottleneckW);
  const approvalBottlenecks = buildApprovalBottlenecks(input, sizeW);
  const procurementPipeline = buildProcurementPipeline(input, procurementW);
  const inventoryExposure = buildInventoryExposure(input, inventoryW, sizeW);
  const deploymentRoadmap = buildRoadmap(input, sizeW);

  const financialOps = {
    closeDays: clamp(9 + sizeW + bottleneckW * 0.4, 6, 24),
    reconciliationHours: clamp(18 + bottleneckW * 3 + sizeW * 2, 12, 120),
    exceptionRate: clamp(8 + bottleneckW + procurementW, 5, 48),
    forecastConfidence: clamp(92 - operationalRisk * 0.45, 42, 92),
  };

  const summary = `AutoERP mapped ${input.departments.length} departments for a ${input.companySize} company running ${input.workflow.toLowerCase()} with ${input.bottleneck.toLowerCase()}, ${input.procurementComplexity.toLowerCase()} procurement complexity, and a ${input.inventoryProfile.toLowerCase()} inventory profile. Projected savings are about $${estimatedSavingsUsdYear.toLocaleString()} per year with workflow complexity at ${workflowComplexityScore}/100 and operational risk at ${operationalRisk}/100.`;

  return {
    workflowComplexityScore,
    automationOpportunities: buildAutomationOpportunities(input),
    departmentMap,
    operationalRisk,
    approvalBottlenecks,
    procurementPipeline,
    inventoryExposure,
    financialOps,
    deploymentRoadmap,
    estimatedSavingsUsdYear,
    recommendedTier,
    summary,
    modelVersion: MODEL_VERSION,
  };
}

export function departmentLabel(department: Department): string {
  return department;
}
