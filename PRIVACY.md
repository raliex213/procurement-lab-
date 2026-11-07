# Public release and data handling

## What is included

This distribution contains the simulator's application files, a local static server, automated tests and documentation. Supplier and representative identities are fictional. Tests create synthetic data in memory.

## What is excluded

- Git history and repository configuration from the original workspace.
- Original hosting configuration, account or project identifiers, deployment credentials and private environment files.
- Personal names and contact details from the project owner's workspace, local computer paths and links to the original personally named deployment.
- Saved user runs, personal evaluation notes, case-study PDFs, reports, screenshots, logs, chat records and attachments.

The package is assembled from an explicit file list rather than a copy of the entire project workspace. The included `.gitignore` helps exclude common private files from future commits, but it does not remove files that are already tracked in a repository.

## Browser behaviour

- Simulation state and notes are held in page memory. The application does not automatically write them to cookies, local storage, a database or a cloud account.
- JSON imports are read locally using the browser's file API. Exports are downloaded to the user's computer. There is no application upload endpoint.
- The source includes no analytics SDK, third-party script, remote font, API key or application background network request.
- The learning guide contains ordinary links to two public SAP Learning pages. They are not embedded assets; following them leaves the simulator and is subject to those sites' own data handling. SAP is not affiliated with this project.
- Printing uses the browser's print dialog. Any saved PDF or exported JSON/CSV may contain text a user entered, so those outputs should be reviewed before sharing.
- The optional local server binds to `127.0.0.1`, serves only the eight application assets and does not log requests or set cookies.

A separate public host or repository service may keep its own access logs, analytics or account metadata. Those services are outside this application's data-handling logic. Publishing a repository under a personal account can still associate the project with that account.

## Review scope

The release was checked for personal identifiers, local paths, hosting identifiers, credential patterns, external executable assets, application network calls, persistent browser storage and unintended files in the archive. The application's existing functionality was retained and its automated tests were run against this exported copy.

These checks describe this release. Review later additions, exports and commits separately; a source scan cannot guarantee the absence of every possible secret in future content.
