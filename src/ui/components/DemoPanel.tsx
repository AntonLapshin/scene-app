import { useProjectInfo } from "../viewModels/useProjectInfo";
import { useTheme } from "../context";
import type { ProjectStatus } from "../../core/projectInfo";

export interface DemoPanelProps {
  projectName: string;
  owner: string;
  repo: string;
  status?: ProjectStatus;
  description?: string;
}

/**
 * Initial demo panel (plan.md §26.3, themed M5-T1).
 *
 * Renders the project name, lifecycle status, and demo info. It is a dumb view:
 * it delegates all derivation to the `useProjectInfo` view model, which in turn
 * delegates to the pure `src/core` module. No business logic lives here. Colors
 * and radius come from the injected theme tokens via `useTheme()`.
 */
export function DemoPanel({
  projectName,
  owner,
  repo,
  status = "scaffolded",
  description,
}: DemoPanelProps) {
  const info = useProjectInfo(projectName, owner, repo, status, description);
  const { tokens } = useTheme();

  return (
    <section className={`mx-auto max-w-md ${tokens.radius} ${tokens.border} ${tokens.surface} p-6 shadow-sm`}>
      <h2 className={`text-xl font-semibold ${tokens.foreground}`}>{info.name}</h2>
      {info.description && (
        <p className={`mt-1 text-sm ${tokens.textMuted}`}>{info.description}</p>
      )}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className={tokens.textSubtle}>Status</dt>
          <dd>
            <span className={`inline-flex items-center ${tokens.radiusPill} ${tokens.statusPill} px-2.5 py-0.5 text-xs font-medium`}>
              {info.statusText}
            </span>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className={tokens.textSubtle}>Repo</dt>
          <dd className={tokens.monoText}>
            {info.owner}/{info.repo}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className={tokens.textSubtle}>Demo</dt>
          <dd>
            {info.demoReady ? (
              <a
                href={info.demoUrl}
                className={tokens.link}
              >
                {info.demoUrl}
              </a>
            ) : (
              <span className={tokens.textSubtle}>Not deployed yet</span>
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
