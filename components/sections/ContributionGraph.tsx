"use client";
import { useEffect, useState } from "react";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
  ContributionGraph as CGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Scales } from "../core/scales";

const GITHUB_USERNAME = "fluxorr";
const GITHUB_PROFILE_URL = "https://github.com/fluxorr";

export default function ContriGraph() {
  const [data, setData] = useState<Activity[]>([]);

  useEffect(() => {
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
    )
      .then((r) => r.json())
      .then((d) => setData(d.contributions ?? []))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="mx-auto max-w-4xl  p-4 flex flex-col items-center relative">
      {data.length === 0 ? (
        <div className="flex flex-col gap-2 py-2">
          <div
            className="grid grid-rows-7 grid-flow-col gap-0.75"
            style={{ gridAutoColumns: "11px" }}
          >
            {Array.from({ length: 53 * 7 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cell, no meaningful identity
                key={i}
                className="size-2.75 rounded-xs bg-neutral-400/10 animate-pulse"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <div className="h-4 w-48 bg-neutral-400/10 rounded animate-pulse" />
            <div className="flex gap-0.75 items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cell, no meaningful identity
                  key={i}
                  className="size-2.75 rounded-xs bg-neutral-400/10 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <TooltipProvider>
          <CGraph data={data} blockSize={11} blockMargin={3} blockRadius={2}>
            <ContributionGraphCalendar>
              {({ activity, dayIndex, weekIndex }) => (
                <Tooltip>
                  <TooltipTrigger render={<g />}>
                    <ContributionGraphBlock
                      activity={activity}
                      className="cursor-pointer"
                      dayIndex={dayIndex}
                      weekIndex={weekIndex}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{activity.date}</p>
                    <p>{activity.count} commits</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </ContributionGraphCalendar>
            <ContributionGraphFooter>
              <ContributionGraphTotalCount>
                {({ totalCount, year }) => (
                  <div className="text-muted-foreground">
                    {totalCount.toLocaleString("en")} contributions in {year} on{" "}
                    <a
                      className="text-foreground underline decoration-current/30 decoration-1 underline-offset-3 transition-colors hover:decoration-current"
                      href={GITHUB_PROFILE_URL}
                      target="_blank"
                      rel="noopener"
                    >
                      GitHub
                    </a>
                  </div>
                )}
              </ContributionGraphTotalCount>
              <ContributionGraphLegend />
            </ContributionGraphFooter>
          </CGraph>
        </TooltipProvider>
      )}

      <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
      <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={8} className="rounded-lg" />
      </div>
    </div>
  );
}
