# Set up visualizerlab.dev on GitHub Pages without hash URLs

This is the owner-facing process and approval checklist. Technical details are in
[DEPLOYMENT.md](DEPLOYMENT.md). Instructions below are a plan, not permission to
execute every step. Each approval covers only its named stage.

## What is already agreed and prepared

- Domain: visualizerlab.dev, registered through Porkbun, with Cloudflare nameservers.
- Site root: https://visualizerlab.dev/
- Workspace: https://visualizerlab.dev/frontend/
- Standalone Preview: https://visualizerlab.dev/frontend/visualized/
- GitHub Pages hosts the app; Cloudflare manages DNS; Porkbun remains the registrar.
- The public repository is eligible for GitHub Pages on GitHub Free. Domain renewal
  remains separate. No custom-domain hosting payment is required for this setup.
- Preparation is local on feature/github-pages. Lint/build, 33 tests and six
  Chromium checks passed; independent review found no blockers.
- At the step 3 approval checkpoint, these deployment changes had not yet been
  committed, pushed, merged or published. The user has now authorized step 3 only.
  GitHub Pages settings, DNS and publication remain unchanged and unapproved.

Confirming the domain/path approves the destination only. It does not approve
Git writes, a merge, GitHub settings changes, DNS changes or publication.

## Why the URLs do not need a #

BrowserRouter uses ordinary paths, with the build base set to `/` for this custom
domain. The Pages build emits these files:

```text
dist/index.html
dist/frontend/index.html
dist/frontend/visualized/index.html
dist/404.html
dist/assets/...
```

Known routes have real HTML entry files, so a direct visit or refresh does not
need a server-side rewrite. GitHub may add a trailing slash for directories.
Unknown paths receive the app-aware 404 and use the existing router redirect.
There is no HashRouter or query-encoded route workaround. Ordinary anchor
fragments are still possible; they are not how the application chooses pages.

## 1. Confirm the destination — complete

You have approved visualizerlab.dev with the paths above. No further action is
needed for this step. The previous .com name is not the deployment target.

## 2. Prepare and check the code — complete locally

Codex prepares routing, static entry files, tests and deployment workflow. The
workflow runs manually from main and refuses the wrong custom-domain target.
Normal development remains at `/frontend`. You do not need to read every code
line or repeat the full UI checklist. Review the intended URLs, behavior summary,
validation results and any reported limitations instead.

## 3. Save the preparation to GitHub — approved for execution

Approval phrase: **Approve step 3: commit the Pages setup, push feature/github-pages,
and open a draft pull request.**

Codex will commit these prepared changes, push that feature branch and open its
PR against main. Source and workflow changes become visible in the public repo.
The read-only PR validation workflow runs both browser suites and other checks.
This does not merge the changes, configure the domain or publish the site.

Codex will report the PR link, commit and hosted check results. Review any
failures or unresolved findings before proceeding. No approval is needed merely
to inspect checks or repair the already authorized implementation.

## 4. Merge the reviewed setup — separate approval after CI passes

Approval phrase: **Approve step 4: merge the Pages setup pull request into main.**

Codex checks the latest PR commit and CI result, merges the PR, synchronizes local
main and reports its status. A merge does not publish: Deploy Pages has no push
trigger. Release tags/version changes are separate and are not part of this guide.

## 5. Verify ownership — unique TXT record, not a web traffic switch

In GitHub account settings (not repository settings), open Pages → Add a domain,
enter visualizerlab.dev and obtain the verification TXT name/value. In Cloudflare,
open visualizerlab.dev → DNS → Records and add that TXT record using GitHub's exact
values. Return to GitHub and complete verification. Keep the TXT record afterward.

Never guess the value or paste an API token/password into chat. You can perform
these dashboard actions yourself. If asking Codex to perform them, authorize this
stage explicitly: **Approve step 5: start domain verification and add only the
GitHub-provided TXT record.** Codex will retrieve and show the GitHub-issued record before the authorized DNS
write; an already approved exact record does not need duplicate approval.
This stage does not replace your website's A records.

## 6. Configure GitHub Pages — separate settings approval

Approval phrase if Codex performs it: **Approve step 6: enable GitHub Pages using
GitHub Actions and set its custom domain to visualizerlab.dev.**

In repository Settings → Pages, select GitHub Actions as the deployment source.
Set Custom domain to visualizerlab.dev. Do this before pointing the domain's web
records to Pages. Ensure the github-pages environment allows deployments from main.
For this Actions workflow, repository settings control the domain; GitHub does
not require or use a committed CNAME file for the custom domain.

Codex can handle accessible GitHub operations after approval. Dashboard-only
steps may need your action. Nothing in this stage dispatches Deploy Pages.

## 7. Point Cloudflare web DNS at GitHub — traffic-changing approval

Before this stage, review/export the current Cloudflare DNS records and note
which apex web records will be replaced. Leave unrelated email and verification
records intact. Keep the working Cloudflare nameservers at Porkbun.

In Cloudflare → visualizerlab.dev → DNS → Records, configure:

| Type | Name | Value | Proxy status | TTL |
| --- | --- | --- | --- | --- |
| A | @ | 185.199.108.153 | DNS only | Auto |
| A | @ | 185.199.109.153 | DNS only | Auto |
| A | @ | 185.199.110.153 | DNS only | Auto |
| A | @ | 185.199.111.153 | DNS only | Auto |

These are the documented GitHub Pages IPv4 targets, checked 2026-10-26. DNS only
is the grey-cloud option; using it keeps the initial setup direct to GitHub.
Optional www support is a CNAME named www pointing to jphonetics.github.io, also
DNS only/Auto, with no protocol or repository path. It is not needed for the apex
URL. Review conflicting A/AAAA/CNAME web records before making the cutover.

Approval phrase if Codex performs it: **Approve step 7: apply the reviewed
Cloudflare DNS changes for visualizerlab.dev.** This authorizes only the exact
record changes reviewed, not registrar transfer, mail changes or unrelated records.
You can instead make the records yourself and ask Codex to check public DNS.
DNS changes can direct visitors away from the current destination before the new
site is ready. Coordinate this stage with the approved publication window.

## 8. Publish the tested site — separate approval

Approval phrase: **Approve step 8: deploy the reviewed main commit to
visualizerlab.dev using the Deploy Pages workflow.**

After confirming the settings and DNS plan, Codex dispatches Deploy Pages from
main (or you use GitHub Actions → Deploy Pages → Run workflow → main). The job
validates the target, runs checks, builds/tests the Pages artifact, then deploys
that artifact. Publication makes the site available publicly; it does not add
real editor execution or other roadmap features.

If deployment fails, Codex reports the failure and resolves authorized setup
issues before retrying. No force push or moved release tag is part of deployment.

## 9. Confirm HTTPS and the live paths — final human review

Wait until GitHub provisions the certificate, then enable Enforce HTTPS in
repository Settings → Pages. If Codex performs that setting change, approve it
explicitly. `.dev` requires HTTPS in browsers, so a missing certificate can prevent
the site from opening even when the files and DNS are correct. Do not declare the
site ready until valid HTTPS works. Provisioning/propagation may take time.

Codex checks the public URLs and reports evidence. You review:

1. Open https://visualizerlab.dev/ and confirm it lands on Frontend.
2. Paste https://visualizerlab.dev/frontend/ into a fresh tab and hard-refresh.
   Confirm the page is styled and controls work, with no # in the route.
3. Paste https://visualizerlab.dev/frontend/visualized?device=phone&zoom=125&css=false
   into a new tab. Confirm the settings survive refresh.
4. From workspace, open standalone Preview. Confirm the new tab stays on
   visualizerlab.dev with the selected settings and no repository-name prefix.
5. Visit https://visualizerlab.dev/a-missing-route and confirm it returns to Frontend.
6. Recheck keyboard focus, panel collapse/resize and saved layout after refresh.

The editor is still a placeholder: typing/execution is a later phase. Record the
live commit, deployment run and your pass/fail findings. Codex does not label
production verified until these checks have actually been performed.

## Approval summary

| Stage | What approval allows | What it does not allow |
| --- | --- | --- |
| Destination | Use the .dev domain and agreed paths | Git writes or external changes |
| 3: Commit/PR | Commit, push feature branch, open PR and run CI | Merge or publication |
| 4: Merge | Merge the reviewed PR into main | Publication or DNS changes |
| 5: Verify | Account verification and reviewed TXT record | Web traffic switch |
| 6: Pages settings | Enable Actions source and custom domain | DNS edits or deployment dispatch |
| 7: DNS | Apply reviewed web DNS cutover | Unrelated DNS/registrar changes |
| 8: Publish | Run deployment for reviewed main | Release tags or future features |
| 9: HTTPS | Enable the reviewed HTTPS setting | Other account/settings changes |

Approvals persist once given; Codex should not ask again for the same authorized
action. Read-only checks need no additional approval. This guide is documentation,
not a request to approve every stage at once. **Stage 3 is approved. The next decision is stage 4 after CI passes; later stages remain unapproved.**

## Official references

- [GitHub Pages availability and project hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Verify a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Custom domain, DNS and HTTPS settings](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Cloudflare record controls](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)
- [.dev HTTPS requirement](https://www.registry.google/domains/dev/)
