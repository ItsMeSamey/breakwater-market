# Breakwater Market

Keep three harbor stalls open and save 18 coins for lantern night. In six market days, move between berths, choose cover or keep cash, respond to shared incidents, and collect sales after repairs and supplies.

A safer berth can earn less. Cheap scheduled repairs happen before the incident; emergency repairs cost more after it. Insurance covers one named incident with a deductible and cap. The public forecast shows four possible tickets, and the repair-funding preview calculates their joint consequences without revealing the next draw.

## Play

The prebuilt `build/index.html` contains its styles and classic JavaScript and runs locally. Keep the accompanying Markdown files for its sources and no-script rules links.

The tested route is local HTTP with Node installed:

```sh
node server.mjs
```

Open http://127.0.0.1:39841/ in a browser. Stop the server with Ctrl+C. It listens on localhost only. To choose another free port on a POSIX shell, use `PORT=39845 node server.mjs`.

The build is also designed to open directly as `build/index.html` from disk. Direct `file://` execution remains unverified; the actual browser checks used the same self-contained HTML over HTTP.

Select a stall, then an empty berth to move. Use Tab, Enter and Space if preferred. Open the market, choose emergency reopenings, then collect. New voyage accepts a seed; the same seed repeats the same events. There is no timer or saved game. Reloading starts a new default week.

## Build and check

Python 3 and Node provide the build and test tools through their standard libraries.

```sh
python3 build.py
node --test tests/core.test.cjs
node tests/preview-evaluation.cjs > preview-report.json
```

`tools/reproduce.py` copies only the files needed by the frozen diagnostics into a fresh temporary directory, runs the core tests, independent preview, 40-week qualification diagnostic and structural check, and reports the results. It preserves bundled historical evidence:

```sh
python3 tools/reproduce.py
```

See [VERIFICATION.md](VERIFICATION.md) for measured results and limits. The fixed-berth and independence comparisons isolate mechanisms within this game.

## Documents and captures

- [Game design PDF](docs/Breakwater-GDD.pdf) and [readable source](docs/GDD.md).
- [Prototype budget PDF](docs/Breakwater-Budget.pdf) and [readable source](docs/BUDGET.md).
- [Financial concepts and credits](SOURCE_NOTES.md).
- [Screenshot descriptions](assets/screenshots/README.md).

The game uses fictional prices and odds. Real policies differ. Human playtesting remains future work. Original code, interface shapes, documentation and tests were developed with OpenAI Codex assistance.
