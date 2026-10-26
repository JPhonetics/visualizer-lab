# GitHub Pages deployment

For the owner-facing numbered process and approval boundaries, start with
[PAGES_SETUP_GUIDE.md](PAGES_SETUP_GUIDE.md).

## Target and acceptance

Use the owned custom domain `https://visualizerlab.dev/` on GitHub Pages with
clean BrowserRouter paths. Workspace: `https://visualizerlab.dev/frontend/`.
Standalone: `https://visualizerlab.dev/frontend/visualized/`. There is no repository
prefix or hash routing. The user reports Porkbun as registrar and Cloudflare as intended DNS manager.
A public NS lookup on 2026-10-26 confirmed ben.ns.cloudflare.com and
harleigh.ns.cloudflare.com for visualizerlab.dev. The earlier Afternic results
were for the mistakenly supplied .com domain and do not apply to this site.
Existing apex A records do not yet match the GitHub Pages targets below.
This preparation does not change domain or repository settings.

Acceptance: assets load at the domain root; direct workspace/standalone visits and
refresh succeed; standalone settings survive; unknown paths return to Frontend;
publishing requires an approved manual workflow dispatch from main. Actual-host
checks remain pending publication approval.

## Build and routing

`pages.config.js` owns `/`, the expected domain, and static entry routes. Both
normal builds and Pages builds use the root base. BrowserRouter reads BASE_URL.

```bash
npm run build:pages
npm run preview:pages
npm run test:e2e:pages
```

Local artifact preview: `http://127.0.0.1:4179/`. Build first and leave port 4179
free. This test-only server models directory redirects and genuine custom 404
responses; it has no Vite SPA fallback and is not a production server.

The Pages build copies index.html into frontend/index.html and
frontend/visualized/index.html so direct visits/refreshes return HTTP 200. Pages
may add a trailing slash for directories; queries/fragments survive. The generated
404.html boots the same app at an unknown URL with HTTP 404, allowing the router's
existing wildcard redirect. Missing assets still return 404. Normal anchor fragments
are allowed; they are not used for routing. Add future implemented page routes to
pagesEntryRoutes when they need direct HTTP 200 entry files. Existing JavaScript/
Python placeholders use the app-aware 404 and remain absent from the selector.

## Domain and repository setup (after approval)

1. Verify visualizerlab.dev in the JPhonetics account's Settings → Pages. GitHub
   supplies a unique TXT record/value; add that record with the DNS provider and
   complete verification. Keep the record afterward. Never invent its value.
2. Enable repository Pages with **GitHub Actions** as its source and set the
   repository's Custom domain to **visualizerlab.dev** before pointing web DNS
   there. Domain verification happens at account level, not repository level.
3. At the DNS provider, configure the apex web records below. Review current web
   records before replacing them and preserve unrelated mail/TXT records. The
   chosen canonical hostname is the apex; www is an optional alias for it.

| Type | Host | Target |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME (optional) | www | jphonetics.github.io |

These are GitHub's documented IPv4 targets, checked 2026-10-26. The www CNAME is
a DNS record, with no protocol or repository path. If IPv6 is configured, check
GitHub's current AAAA instructions rather than leaving an unrelated old AAAA
record in place. Provider-specific record edits require the provider and a review
of its current records. Do not add a wildcard record.

In Cloudflare, select visualizerlab.dev → DNS → Records. Use **Add record** for
GitHub's four A entries above, each with Name `@`, **DNS only** (grey cloud), and
TTL **Auto** for initial setup. If www is wanted, add its CNAME with the same proxy/
TTL choices. Create the verification TXT record using GitHub's exact supplied
name and value. Review existing apex web records before replacing them; these
steps do not require changing the Porkbun registrar or working Cloudflare nameservers.

4. Ensure the github-pages environment allows main; add a required reviewer if
   supported by the repository plan/policy. Merge reviewed setup only after approval.
5. After separate publication approval, dispatch **Deploy Pages** from main.
   Neither a push nor a merge publishes automatically. Configure-pages requires
   Actions Pages to be enabled already; it does not silently enable the site.
6. Once GitHub has issued the domain certificate, enable **Enforce HTTPS**.
   DNS propagation/certificate provisioning can take time; verify actual readiness.

GitHub Actions deployments configure the domain in repository Pages settings.
GitHub ignores a CNAME file for this publishing method, so no such file is generated.
The workflow checks configure-pages' actual base_url against visualizerlab.dev at
`/` and refuses a default github.io/repository target before building/uploading.
This prevents accidentally publishing a domain-root build at the project path.

The build has contents/pages read permission. Only the environment-scoped deploy
job gets pages/id-token write. It deploys the exact artifact produced by successful
lint/unit checks and Pages browser tests; there is no post-test rebuild. PR CI
runs both normal and Pages browser suites with read-only permissions and cannot
publish. No account secrets or DNS credentials are stored in the repository.

## Verify after publication

- Confirm Deploy Pages succeeds for the intended main commit and domain.
- Open https://visualizerlab.dev/; confirm Frontend opens with no hash-router URL.
- Open /frontend/ directly and hard-refresh; confirm title, styling and controls,
  with no failed JS/CSS requests. Test /frontend without a trailing slash as well.
- Open /frontend/visualized?device=phone&zoom=125&css=false directly, then refresh.
  Confirm settings, title and any directory redirect preserve the query.
- Open standalone from workspace; it must remain on visualizerlab.dev and carry
  selected settings, with no /visualizer-lab/ prefix.
- Open /a-missing-route; its initial HTTP 404 should boot the app and return to
  Frontend. Known static route entries should return HTTP 200.
- Confirm HTTP redirects to HTTPS after enforcement and no mixed-content errors.
  If www was configured, confirm it redirects to the canonical apex domain.
- Recheck keyboard controls and saved layout on the actual host after refresh.

Record the commit/run URL and results before declaring production verified. If
publication fails, inspect workflow/environment logs; a previous successful site
remains available. Roll back through an approved, validated revert on main and a
new deployment dispatch, not moved tags or a force push.

## Sources

- [Vite custom-domain base paths](https://vite.dev/guide/static-deploy.html#github-pages)
- [GitHub custom-domain/DNS configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verify domain ownership](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

- [Cloudflare DNS record controls](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)
