# Procurement Lab

A personal passion project for practising procurement decisions and supplier evaluation through an interactive apparel-retailer simulation.

The project demonstrates an understanding of the procurement process: defining requirements, comparing suppliers, managing a budget, issuing purchase orders, inspecting goods, resolving discrepancies, processing invoices and recording simulated outgoing payments. All suppliers, representatives, prices and outcomes are fictional. This is an independent learning project, not SAP software or a commercial purchasing system.

## Run locally

Use Node.js 20 or newer. There are no third-party packages to install.

```sh
node server.cjs
```

Open **http://127.0.0.1:4173** in your browser. Stop the server with **Ctrl+C**.

The server listens on your own computer only. Alternatively, open `index.html` directly in a modern browser; local-file behaviour depends on browser settings, so the local server is the recommended route.

## Upload this copy to GitHub

1. Extract the ZIP on your computer.
2. Create or open the GitHub repository you want to use.
3. Upload the **contents of the extracted `procurement-lab` folder**, including its `tests` folder and `.gitignore`. Do not upload only the ZIP if you want people to browse the code.
4. Keep the supplied privacy exclusions. Add only files you have reviewed for public release.

The application is a static website: its eight application files can also be served from a static web host. GitHub repository visibility and website hosting are separate settings. This copy has no dependency on the original hosting account, domain or deployment tools.

## What the simulator covers

- **Budget planning:** start with a simulated AUD 10,000 budget or choose another amount. Optionally allocate funds to materials and contingencies, or turn budget enforcement off.
- **Sourcing:** compare Atelier Supply Co., Northstar Equipment and Meridian Trade by product availability, specification, price, delivery date, freight and payment terms.
- **Procurement:** submit and approve requisitions, award lines, issue supplier purchase orders, inspect and post goods receipts, review invoices and record simulated payments.
- **Disruptions:** use seeded random incidents or select short delivery, defective goods, wrong specification, late delivery or invoice overcharge for new orders.
- **Recovery:** consult supplier representatives, consider alternative remedies, account for extra costs and follow the chosen option through to an observed result.
- **Changing conditions:** advance simulated days. Supplier conditions and representative briefings can change between 50-day periods; existing evidence remains in the run history.
- **Evaluation:** combine quantitative performance with your own interpretation of representative statements, offered evidence, limitations and actual outcomes.
- **Records:** print simulated documents, export a run as JSON, import a previously exported run, and download evaluation evidence as CSV.

This copy includes the prepared Atelier catalogue update: Clamshell heat presses start with one unit in stock, a base order capacity of two, and replenishment for the second unit. Swing-away heat presses remain outside Atelier's catalogue. Market conditions can affect capacity and delivery time.

## A short walkthrough

1. Open **Budget & contingencies** and choose the budget controls you want.
2. Visit **Supplier directory** and speak with each fictional representative.
3. In **Requisition & sourcing**, specify quantities, configurations and required dates, submit and approve the requisition, then award supplier lines.
4. Create purchase orders and advance the simulation until goods can be inspected.
5. If an issue occurs, consult the vendor, compare the recovery options and select one that fits the scenario's budget and deadline.
6. Continue advancing and posting the relevant records until you can evaluate what actually happened.
7. Review **Supplier evaluation**, record your reasoning and export your evidence.

Export your run before closing or refreshing the page if you want to continue it later. Progress is held in the page's memory; there is no automatic cloud save.

## Evaluation approach

The default quantitative weights are quality 25%, on-time delivery 25%, landed cost 20%, first-delivery fill 15%, invoice accuracy 10% and issue resolution 5%. Weights can be adjusted in the simulator.

The issue-resolution measure combines **40% response speed, 35% distinct recovery options and 25% successful recovery speed**. Repeated or duplicate strategies do not add variety credit. Unresolved cases receive no successful-recovery credit. This scoring model is an educational design choice, not an industry-certified standard.

Qualitative traits are not automatically awarded a numeric score. Representative statements suggest capabilities that the learner should evaluate against available evidence and eventual delivery or recovery outcomes. Distinguish supplier claims from demonstrated results.

When building a case study, useful experiments include a baseline run, budget pressure and deadline pressure. Keep product requirements and other conditions consistent where possible, and record deliberate changes. Product complexity and availability can make direct comparisons between different product categories misleading.

The qualitative evaluation framework was informed by **Willcocks, Cullen and Craig (2011), _The Outsourcing Enterprise_**. Supplier dialogue, parameters and scenarios are fictional. The book and the original personal case-study documents are not included.

## Scope and limitations

- No real purchasing, banking, supplier contact or tax calculation takes place.
- Simulation assumptions and incident probabilities are visible in the source. The project is intended for transparent learning and reproducible experimentation.
- A supplier's score is affected by product mix, evidence coverage, scenario design and sample size; it is not proof that the supplier would be best in a real market.
- Faster responses and more options are useful signals, but the learner must still consider affordability, suitability, risk and whether commitments are fulfilled.
- This repository contains the prepared local release, which may be ahead of an independently hosted copy. Uploading these files does not modify that separate site.

## Tests

```sh
node tests/run.cjs
```

Tests cover procurement integrity, budgets, market periods, consultations, supplier correspondence, resolution scoring, legacy-run imports and Atelier's heat-press configurations. Test fixtures are generated from fictional data in memory. They do not include saved user runs and do not contact external services.

The runner also checks JavaScript syntax, application network/storage boundaries and the local server's file restrictions. The server check uses localhost only. See `PRIVACY.md` for the review scope.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css` | Browser interface and styling |
| `engine.js` | Catalogue, inventory, procurement, invoices, payments and base evaluation |
| `scenarios.js` | Budgets, changing market conditions and recovery alternatives |
| `behaviour.js` | Representative conversations and qualitative evidence |
| `resolution.js` | Response, option-variety and recovery scoring |
| `app.js`, `experience.js` | Interface rendering, interaction, local imports and exports |
| `server.cjs` | Optional local static server using Node.js built-ins |
| `tests/` | Automated checks and synthetic legacy fixture generator |
| `PRIVACY.md` | Data handling and public-release exclusions |
