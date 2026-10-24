## Release Checklist: Touchline 1.0 -- web, Android, iOS
Generated: 2026-10-24 from `.claude/docs/templates/release-checklist-template.md`

This is the standing checklist for the first store release. Items are ticked only when checked. The web build already deploys to GitHub Pages on every push; the Android and iOS builds (Capacitor) are the pending part.

### Codebase Health
- Run `grep -rnE "TODO|FIXME|HACK" js tools` before the release and list any FIXME or HACK here
- [ ] Zero FIXME left, or each one named below

### Build Verification
- [ ] Clean build succeeds: `npm run build`
- [ ] The full deploy gate passes (see `CLAUDE.md`)
- [ ] Offline cache lists every file; `CACHE` in `sw.js` bumped
- [ ] Build size within budget (now about 2.6 MB for 23 files)
- [ ] Version number set in `package.json` and `FM.VERSION`
- [ ] Build is reproducible from the tagged commit
- [ ] `npm run cap:sync` succeeds, and the Android and iOS projects open

### Quality Gates
- [ ] Zero open crash or data-loss bugs
- [ ] A save from each earlier version opens and plays on (`npm run test:saves`)
- [ ] 20-season run completes (`npm run test:long`)
- [ ] Calibration in range (`npm run calibrate`)
- [ ] Performance: a league day is near 0.7 to 1.4 s in Node; checked on a mid-range phone
- [ ] No regression from the previous build

### Content Complete
- [ ] Every placeholder replaced (crests, icons, store art)
- [ ] All player-facing text proofread; counts use `U.plural`
- [ ] Real club, league and competition names absent (the game ships fictional); the names database stays out of the repository
- [ ] Credits and third-party licences complete (`.claude/THIRD-PARTY-LICENSE-ccgs.txt` is for the studio helpers, not shipped)

### Platform Requirements (mobile)
- [ ] Runs offline after install
- [ ] Orientation, safe areas and notches handled
- [ ] Touch targets at least 44 px; text size setting works
- [ ] Back button (Android) and swipe gestures behave
- [ ] Saves live in native file storage and survive an app update
- [ ] Battery and memory acceptable over a long session
- [ ] Minimum OS versions stated in the store listing

Certification: not used. Touchline ships as a web app and through the Android and iOS stores; follow each store's own review rules.

### Store / Distribution
- [ ] Short description, long description and feature list
- [ ] Screenshots per device size, current with the interface
- [ ] Trailer (optional)
- [ ] Age rating obtained (ESRB, PEGI, others as needed)
- [ ] Privacy policy and legal notices (no analytics; errors stay on the device unless the player sends a report)
- [ ] Pricing for all regions ($9.99 to $14.99 with regional pricing)
- [ ] In-app purchases (cosmetics, extra save slots, DLC) configured and tested through store billing, if included at launch
- [ ] Store review notes explain that JavaScript updates go through review

### Launch Readiness
- [ ] Crash reporting path verified ("Report a problem" carries the device log)
- [ ] A fix process for a broken release (store review means fixes are not instant)
- [ ] Community announcement drafted
- [ ] `docs/CHANGELOG.md` regenerated (`node tools/changelog.mjs`) and `docs/ROADMAP.md` current

### Go / No-Go: PENDING
**Rationale**: Not assessed. Device builds and the store listing are still open on the roadmap (mobile readiness steps 1 and 2 are done).
**Sign-offs**: project owner (pending).
