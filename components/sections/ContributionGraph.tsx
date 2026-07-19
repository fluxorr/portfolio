import { Suspense } from "react"

import {
    GitHubContributions,
    GitHubContributionsFallback,
} from "@/components/github-contributions"
import { getCachedContributions } from "@/lib/get-cached-contributions"
import { Scales } from "../core/scales"
import { AnimateElement } from "../ui/element-animate"

const GITHUB_USERNAME = "fluxorr"
const GITHUB_PROFILE_URL = "https://github.com/fluxorr"

export default function ContributionGraph() {
    const contributions = getCachedContributions(GITHUB_USERNAME)

    return (
        <div className="mx-auto max-w-5xl border-x border-dashed border-neutral-400/50 p-4 flex flex-col text-left relative">
            <div className="p-4 relative z-10">
                <AnimateElement by="children" animation="slideRight">
                    <Suspense fallback={<GitHubContributionsFallback />}>
                        <GitHubContributions
                            contributions={contributions}
                            githubProfileUrl={GITHUB_PROFILE_URL}
                        />
                    </Suspense>
                </AnimateElement>
                <div className="absolute inset-y-[-30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
                    <Scales size={8} className="rounded-lg" />
                </div>
                <div className="absolute inset-y-[-30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90%">
                    <Scales size={8} className="rounded-lg" />
                </div>
            </div>
        </div >
    )
}
