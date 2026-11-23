# Commonhour UI design

## Product and design goal

Commonhour gives people a booking link that works across time zones. A visitor should see the booking interface in the first screen, try a local time, and get a usable calendar file. It is a product showcase built around an actual task.

## Direction exploration

| Direction | Composition | What it emphasizes |
| --- | --- | --- |
| Product on cobalt | An asymmetric headline above a live white booking interface on a cobalt, dithered stage | The booking flow is the first piece of evidence. Texture gives the brand a visual accent at the edge of the product. |
| White editorial | A short centered headline, grayscale booking interface, and abundant white space | The clearest reading order, with the least opportunity for recognizable art direction. |
| Night and day | A split screen pairing a white scheduler with a dark, pixelated working-hours view | The time-zone idea is immediate, while the illustration and product compete for the same first-screen space. |

Use **product on cobalt**. Study how Mobbin brings real interface states into its marketing page, how curated minimal layouts establish hierarchy, and how scheduling products put the actual calendar early. Treat “Love” as landing.love for the reference pass. [Mobbin](https://mobbin.com/) · [SiteInspire](https://www.siteinspire.com/) · [landing.love SaaS collection](https://www.landing.love/categories/saas/) · [SavvyCal](https://savvycal.com/) · [Notion Calendar](https://www.notion.com/product/calendar)

## Layout and identity

- **Navigation.** Commonhour wordmark, time-zone section, showcase link, and a quiet booking action. The mark is built from two offset time blocks.
- **Hero.** “Meet in the middle.” sits left on the two-column grid. A short explanation and booking action sit beside it. At narrow widths the copy and button stack in reading order.
- **Product stage.** A real booking surface appears immediately beneath the hero copy. Use a wide cobalt frame with an ordered-dither backdrop. The edge texture suggests time blocks coming into alignment. It supports the composition and stays outside the booking surface.
- **Booking surface.** A slim header identifies the demo. The host panel establishes which meeting is being scheduled. The center shows five dates and the slots for that date. The right panel reviews the selected time and runs confirmation. On mobile the same controls flow vertically.
- **Time zones.** Two horizontal tracks show local 09:00–17:00 bands on the same UTC scale. Their intersection is highlighted. A slider lets visitors preview a different instant, with all three city readouts updating below.
- **Ending.** A short return action leads to the booker. The showcase link stays available in the footer.

| Role | Value |
| --- | --- |
| Page | Warm white `#fafaf8` |
| Product surface | White `#ffffff` |
| Soft surface | Neutral `#f5f6fa` |
| Ink | `#171921` |
| Secondary text | `#555d6b` |
| Neutral rule | `#e2e5ec` |
| Cobalt | `#3449cc` |
| Selection | Indigo wash `#e9edff` |

Use only **Instrument Sans** and **Space Grotesk**. Instrument Sans covers the wordmark, headings, body, and controls at weights 400–670. Space Grotesk carries time values and date numbers at varied weights. Maintain generous word spacing and use tabular figures. Headlines should read at phone size as well as in the portfolio cover.

## Booking behavior

- Use fixed sample availability for the week of 12 April 2027 and a 25-minute Fieldwork Studio introduction. Default to Tuesday at 14:30 UTC. The same instant reads 15:30 in London, 10:30 in New York, and 20:00 in Bengaluru.
- Store UTC instants. Convert display values and working-day bands with IANA time zones. Mark published slots that fit entirely inside both working days. Time-zone changes preserve the selected instant.
- Hover or focus can preview a slot in the comparison. Clicking commits the selection. The preview slider has the same comparison behavior and keeps the booking selection in place.
- Show a Wednesday empty state with an action to advance to Thursday. Put focus on the next available slot after that action.
- Confirm locally. The receipt summarizes both local times and offers an actual 25-minute `.ics` export. “Change time” returns focus to the selected slot. The concept does not send calendar invitations or reserve an external calendar.

## Motion and accessibility

| Interaction | Treatment |
| --- | --- |
| Initial page | One short reveal on the workspace, with the page already readable |
| Date or time-zone change | Update the time values and slide the selected-day indicator |
| Slot preview | Move the comparison marker and update the city values without committing |
| Confirmation | Swap the review for the receipt and draw the checkmark once |
| Pointer movement | Repel the pixels in a small patch under the pointer |
| Reduced motion | Render the same controls and state changes immediately |

Use native fields and buttons, visibly focused controls, labeled 44 px targets, and no interaction that requires a mouse. Check 320–1536 px, including date rollover and focus restoration. Ship an original 1200 × 630 cover composed from the same product UI and texture. Reuse the cover for social metadata and the showcase card.

## Product polish and extension

- Keep the approved two-line desktop hero and its wider gap above the cobalt stage. Give each interactive surface one clear result. The booking widget moves from date to slot to receipt. The comparison moves from two working days to one shared instant. Use StageShow’s framing guidance for the cover and the live surfaces’ resting states. Keep text and controls readable at their real sizes.
- Keep Instrument Sans for interface text and use **Space Grotesk** for time values and date numbers. Give each digit its own cell. Only changed digits enter, with a small sequential delay. The screen reader reads the complete value.
- Add a shared-hours filter, a shortcut to the working-hours overlap, and a way to reset the comparison to the chosen slot. Add a share section that copies a URL for the selected date, time, and zone. An FAQ covers sample bookings, time-zone changes, and importing the calendar file.
- The dither artwork stays anchored. Near a fine pointer, a small canvas patch repels the dither pixels underneath it. Compute only the local patch in a requested frame, clear it when the pointer leaves, and use the static art for touch and reduced motion.
- Finish with grouped product and portfolio links. The two components remain separately reusable and have direct links in the portfolio workshop. The updated cover shows the booking workspace.
