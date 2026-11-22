"""Cross-check: JSON Schema (spec/place-rules.schema.json) agrees with lib/validate.js on the same documents."""
import json, glob, os, subprocess, sys
import jsonschema
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
schema = json.load(open(os.path.join(ROOT, "spec", "place-rules.schema.json")))
jsonschema.Draft202012Validator.check_schema(schema)
docs = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(ROOT, "spec", "examples", "*.json")) + glob.glob(os.path.join(ROOT, "tests", "fixtures", "*.json")))]
base = {"spec": "place-rules/0.1", "updated": "2026-11-21T00:00:00Z", "place": {"name": "x"}, "rules": {"drones": "prohibited"}}
docs += [dict(base, rules={"drones": "maybe"}), dict(base, foo=1), dict(base, spec="place-rules/9.9"),
         dict(base, verification={"method": "dns", "token": "abc"}), {k: v for k, v in base.items() if k != "place"}]
js = subprocess.run(["node", "-e", "const {validate}=require('./lib/validate');const d=JSON.parse(require('fs').readFileSync(0));console.log(JSON.stringify(d.map(x=>validate(x).valid)))"],
                    input=json.dumps(docs), capture_output=True, text=True, cwd=ROOT, check=True)
node = json.loads(js.stdout)
fail = 0
for i, d in enumerate(docs):
    py = jsonschema.Draft202012Validator(schema).is_valid(d)
    if py != node[i]:
        fail += 1; print("MISMATCH", i, py, node[i], json.dumps(d)[:120])
print(f"schema cross-check: {len(docs)} documents, {fail} mismatches")
sys.exit(1 if fail else 0)
