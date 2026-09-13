# Brian Chung — Data Portfolio

A static GitHub Pages portfolio focused on data engineering, analytics, and collaborative work. Includes Brian’s supplied Alaska portrait, an About page, and an embedded North Carolina Dollar General visualization. The original `trails-skeleton/` coursework remains unchanged.

## Local preview and build

Serve this directory with any static HTTP server. The trail explorer needs HTTP to load its CSV; opening the HTML directly as a file may block that request.

Run `node build.mjs` to copy the public website into `dist/`. No dependencies need to be installed. GitHub Pages can continue serving the repository root.

## Update the portfolio

- Edit biography, projects, evidence links, and timeline in `index.html`.
- Update the theme in `portfolio.css` and interactions in `portfolio.js`.
- Project filter categories live on each card’s `data-categories` attribute.
- About copy is in `about.html`, based on Brian’s stated interests and the reflective voice of his supplied writing samples. The essays themselves are not included in the website.
- The supplied portrait is in `assets/brian-alaska.jpg` and is displayed without altering the original image.
- The North Carolina explorer lives in `nc-dollar-general/`. It preserves the collaborative project’s data and interactions, with a portfolio theme, local D3 v7, and an accessible table synchronized to the same CSV/classification as the map.
- Recheck contribution status and update the review date when refreshing the timeline.

## Attribution and scope

Evidence was reviewed September 7, 2026 through the linked GitHub account: one owned repository and three collaborator repositories were accessible. Global authored/involved pull-request searches found eight authored PRs: three merged, four closed without merging, and one open. These are a reviewed snapshot, not lifetime totals. Direct commits, closed proposals, and team coauthorship are identified separately.

The NC Dollar General project README credits Patrick Grimes and Brian; visible commits are attributed to Patrick. The portfolio does not claim individual implementation ownership for that project. HoopBase project capabilities are distinguished from Brian’s documented contributions. README dataset-size estimates are not represented as measured benchmarks.

Sources:
- https://github.com/MadelineShi/NBA-dataset
- https://github.com/moabdmost/metalheads_312
- https://github.com/Patrick-Grimes/Brian-patrick-csc362-final
- https://github.com/chbri89067-dot/chbri89067-dot.github.io

The homepage and personal-page adaptation were prepared with Codex assistance. The North Carolina visualization was adapted from Patrick Grimes and Brian’s CSC 362 project at source commit `93389f40fc93822e02971b5b08826a8ef91b477d`; credit and data sources are retained within the explorer. The source project is not modified by this portfolio adaptation. Its missing urban-share fallback to Rural is retained and disclosed in the data table. The original trail coursework is preserved and labeled separately.


## Category homepage update
The homepage ends after four expandable categories: Sports Analytics, Geospatial Analytics, Educational Software, and Data Visualization. Skills are prominent near the introduction; PySpark is a user-supplied skill, not a claim about the featured projects. About and the full visualizations remain separate routes.

### Project visual sources
- assets/hoopbase-database.jpg: original `Database diagram` from MadelineShi/NBA-dataset. Historical design diagram, not a guarantee of current schema details.
- NC comparison panel: existing image from Patrick-Grimes/Brian-patrick-csc362-final.
- assets/exam-reporting.svg: source-derived workflow diagram based on metalheads_312 README and merged analytics contribution; not a screenshot.
- assets/trail-distance-duration.svg: plot generated from the original Vancouver trails CSV (distance/time).
- assets/hoopbase-homepage.png: browser capture rendered from the original HoopBase Flask templates and static files; the database was not required for this homepage view.
- assets/nc-map-visualization.svg: static D3 choropleth generated from the project’s 100-county GeoJSON and stored county-density values.
