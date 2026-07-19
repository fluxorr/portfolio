import { Suspense } from "react"

import {
    GitHubContributions,
    GitHubContributionsFallback,
} from "@/components/github-contributions"
import { getCachedContributions } from "@/lib/get-cached-contributions"


const GITHUB_USERNAME = "fluxorr"
const GITHUB_PROFILE_URL = "https://github.com/fluxorr"

export default function Contributions() {
    const contributions = getCachedContributions(GITHUB_USERNAME)

    return (
        <Suspense fallback={<GitHubContributionsFallback />}>
            <GitHubContributions
                contributions={contributions}
                githubProfileUrl={GITHUB_PROFILE_URL}
            />
        </Suspense>
    )
}
