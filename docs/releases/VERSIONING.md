# Visualizer Lab — Versioning and Releases

Use semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Suggested milestones:
```text
0.1.0  Frontend Foundation
0.2.0  Real Frontend Editor
0.3.0  Live Preview
0.4.0  Local Projects / Saved Work
0.5.0  Export / Import / Sharing
0.6.0  JavaScript Visualizer
0.7.0  Python Visualizer
```

For a release:
1. confirm Definition of Done
2. ensure CI passes
3. update `CHANGELOG.md`
4. merge approved branch
5. tag the release
6. deploy
7. verify production
8. publish concise release notes

Example:
```bash
git tag -a v0.1.0 -m "Frontend Foundation"
git push origin v0.1.0
```
