export const COMPANY_SIZE = ["10-50", "51-200", "201-1000", "1000+"] as const;
export const DEPARTMENTS = [
  "Finance",
  "HR",
  "Procurement",
  "Inventory",
  "Operations",
] as const;
export const WORKFLOWS = [
  "Close & reporting",
  "Payroll & onboarding",
  "Vendor intake",
  "Stock replenishment",
  "Order-to-cash",
] as const;
export const BOTTLENECKS = [
  "Approval bottlenecks",
  "Manual reconciliation",
  "Data silos",
  "Inventory drift",
  "Delayed KPI visibility",
] as const;
export const PROCUREMENT_COMPLEXITY = ["Low", "Medium", "High"] as const;
export const INVENTORY_PROFILE = [
  "Lean",
  "Balanced",
  "High SKU",
  "Regulated",
] as const;

export type CompanySize = (typeof COMPANY_SIZE)[number];
export type Department = (typeof DEPARTMENTS)[number];
export type Workflow = (typeof WORKFLOWS)[number];
export type Bottleneck = (typeof BOTTLENECKS)[number];
export type ProcurementComplexity = (typeof PROCUREMENT_COMPLEXITY)[number];
export type InventoryProfile = (typeof INVENTORY_PROFILE)[number];

export type PlannerInput = {
  companySize: CompanySize;
  departments: Department[];
  workflow: Workflow;
  bottleneck: Bottleneck;
  procurementComplexity: ProcurementComplexity;
  inventoryProfile: InventoryProfile;
};

export type DepartmentNode = {
  department: Department;
  status: "manual" | "semi-automated" | "automated";
  automationScore: number;
  riskLevel: "low" | "medium" | "high";
  connectedTo: Department[];
};

export type ApprovalStage = {
  stage: string;
  owner: string;
  medianHours: number;
  severity: "low" | "medium" | "high";
};

export type ProcurementStage = {
  stage: string;
  volume: number;
  cycleDays: number;
  status: "healthy" | "watch" | "blocked";
};

export type InventoryExposure = {
  profile: InventoryProfile;
  stockoutRisk: number;
  carryingCostUsd: number;
  skuPressure: number;
  complianceLoad: number;
};

export type RoadmapPhase = {
  phase: string;
  durationWeeks: number;
  focus: string;
  modules: string[];
};

export type PlannerResult = {
  workflowComplexityScore: number;
  automationOpportunities: string[];
  departmentMap: DepartmentNode[];
  operationalRisk: number;
  approvalBottlenecks: ApprovalStage[];
  procurementPipeline: ProcurementStage[];
  inventoryExposure: InventoryExposure;
  financialOps: {
    closeDays: number;
    reconciliationHours: number;
    exceptionRate: number;
    forecastConfidence: number;
  };
  deploymentRoadmap: RoadmapPhase[];
  estimatedSavingsUsdYear: number;
  recommendedTier: "Growth" | "Scale" | "Enterprise";
  summary: string;
  modelVersion: string;
};

export const DEPARTMENT_LINKS: Record<Department, Department[]> = {
  Finance: ["Operations", "Procurement"],
  HR: ["Operations", "Finance"],
  Procurement: ["Finance", "Inventory", "Operations"],
  Inventory: ["Procurement", "Operations"],
  Operations: ["Finance", "HR", "Inventory"],
};

export const APPROVAL_OWNERS: Record<Department, string> = {
  Finance: "Controller",
  HR: "People Ops",
  Procurement: "Sourcing lead",
  Inventory: "Warehouse manager",
  Operations: "Ops director",
};
