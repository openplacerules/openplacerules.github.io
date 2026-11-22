# Phase 3 seed entries (retrieved 2026-11-21). Official sources only.
import json, os
E = []
def add(**k): E.append(k)
HERE = os.path.dirname(__file__)

# ---------------- FAA security TFRs (official FAA TFR API; scripts/faa_tfrs.py -> research/faa/tfrs.json) ----------------
TFR = json.load(open(os.path.join(HERE, "..", "research", "faa", "tfrs.json")))
STATE = {"California":"California","Florida":"Florida","North Dakota":"North Dakota","Puerto Rico":"Puerto Rico","Alaska":"Alaska","Texas":"Texas",
         "Tennessee":"Tennessee","Guam":"Guam"}
for t in TFR["tfrs"]:
    loc = t["location"].split(" near ")[0].strip()
    place = loc.split(",")[0].strip().title().replace("Afb", "AFB").replace("Aaf", "AAF")
    region = next((v for k, v in STATE.items() if k in loc), None)
    if "Disneyland" in loc.title(): place = "Disneyland Resort (Anaheim)"
    if "Disney World" in loc.title(): place = "Walt Disney World (Orlando)"
    covers = "all aircraft, including drones" if t["all_aircraft"] else "drone (UAS) operations"
    alt = f" {t['altitude'][0].lower()}{t['altitude'][1:]}" if t.get("altitude") else ""
    multi = f" The NOTAM defines {t['n_areas']} areas; only the first is drawn here." if t.get("n_areas", 1) > 1 else ""
    end = "permanent" if t["end"] == "permanent" else f"until {t['end']}"
    shape = f"{round(t['radius_m']/1852, 1):g} NM radius" if "radius_m" in t else "polygon"
    e = dict(name=f"{place} — FAA security TFR {t['notam']}", kind="airspace", scope="radius" if "radius_m" in t else "venue",
             country="US", region=region, geo=None,
             rules={"drones": "prohibited"},
             summary=f"FAA security temporary flight restriction ({shape}{alt}, {end}): no {covers} without authorization.{multi}",
             date=None if t["start"] == "immediately" else t["start"], status="in_force",
             expires=None if t["end"] == "permanent" else t["end"],
             source=f"https://tfr.faa.gov/tfrapi/getWebText?notamId={t['notam']}", publisher="Federal Aviation Administration (TFR)",
             via="https://tfr.faa.gov/tfr3/", coord_source=f"FAA NOTAM {t['notam']}")
    if "radius_m" in t: e.update(lat=t["lat"], lng=t["lng"], radius_m=t["radius_m"])
    else: e.update(polygon=t["polygon"])
    add(**e)

# ---------------- National drone rules (official aviation authorities) ----------------
add(name="United States (recreational drone rules)", kind="jurisdiction", scope="jurisdiction", country="US", region=None, geo=None, boundary="United States",
    rules={"drones":"restricted"}, summary="Recreational flyers: in controlled airspace (Class B, C, D and surface Class E around airports) only with prior FAA authorization via LAANC or DroneZone; at or below 400 ft in Class G.",
    date=None, status="in_force", source="https://www.faa.gov/uas/recreational_flyers", publisher="Federal Aviation Administration", via=None)
add(name="Canada (where to fly a drone)", kind="jurisdiction", scope="jurisdiction", country="CA", region=None, geo=None, boundary="Canada",
    rules={"drones":"restricted"}, summary="Unless following an established Transport Canada procedure, do not fly closer than 5.6 km (3 NM) to certified airports or 1.9 km (1 NM) to certified heliports; within 3 NM of a National Defence aerodrome you need its authorization.",
    date=None, status="in_force", source="https://tc.canada.ca/en/aviation/drone-safety/learn-rules-you-fly-your-drone/where-fly-your-drone", publisher="Transport Canada", via=None)
add(name="Australia (flying drones near airports)", kind="jurisdiction", scope="jurisdiction", country="AU", region=None, geo=None, boundary="Australia",
    rules={"drones":"restricted"}, summary="Drones over 250 g must not fly within 5.5 km of a controlled airport or in runway approach/departure paths (up to 7 km); 250 g or less may fly up to 45 m within 5.5 km but not over approach paths or inside the airport boundary.",
    date=None, status="in_force", source="https://www.casa.gov.au/drones/drone-rules/flying-near-airports", publisher="Civil Aviation Safety Authority", via=None)
add(name="European Union (EASA open category)", kind="jurisdiction", scope="organization", country="EU", region=None, geo=None,
    rules={"drones":"restricted"}, summary="Low-risk 'open category' drone flights in EASA states are limited to 120 m height, with subcategory rules (A1/A2/A3) on flying over or near uninvolved people; national geographical zones add local restrictions.",
    date=None, status="in_force", source="https://www.easa.europa.eu/en/domains/drones-air-mobility/operating-drone/open-category-low-risk-civil-drones", publisher="European Union Aviation Safety Agency", via=None)

# ---------------- Exams ----------------
add(name="AP Exams (College Board)", kind="exam", scope="organization", country="US", region=None, geo=None,
    rules={"camera_glasses":"prohibited","recording":"prohibited"}, summary="Students must not bring electronic equipment, including wearable technology of any kind, smart glasses, smartwatches, recording devices or cameras; anyone seen with one during testing or breaks may be dismissed and have the score cancelled.",
    date=None, status="in_force", source="https://apstudents.collegeboard.org/exam-policies-guidelines/what-to-bring-on-exam-day", publisher="College Board", via=None)
add(name="New Zealand (drones near aerodromes)", kind="jurisdiction", scope="jurisdiction", country="NZ", region=None, geo=None, boundary="New Zealand",
    rules={"drones":"restricted"}, summary="Within 4 km of any aerodrome you need an appropriate qualification (or direct supervision) and must not fly over runway strips; you also need the aerodrome operator's consent and, in controlled airspace, Airways ATC approval via AirShare (or an observer in uncontrolled airspace). Shielded operations are an alternative.",
    date=None, status="in_force", source="https://www.aviation.govt.nz/drones/flying-your-drone-safely/check-the-airspace/", publisher="Civil Aviation Authority of New Zealand", via=None)
add(name="Taiwan (drone zones around airports)", kind="jurisdiction", scope="jurisdiction", country="TW", region=None, geo=None, boundary="Taiwan",
    rules={"drones":"restricted"}, summary="Civil Aviation Act art. 99-13: no drone activity in the zone formed by 5 km arcs (35° each side) from runway-end centres and 2.6 km either side of the centreline; in the wider 10 km x 3.4 km extension, no drone activity from 200 ft (60 m) up (varies by airport); 1 km radius around airfields. Local governments may designate further zones below 400 ft.",
    date=None, status="in_force", source="https://www.caa.gov.tw/Article.aspx?a=2429&lang=1", publisher="Civil Aeronautics Administration, MOTC (Taiwan)", via="https://drone.caa.gov.tw/en")
add(name="Hong Kong (small unmanned aircraft rules)", kind="jurisdiction", scope="jurisdiction", country="HK", region=None, geo=None, boundary="Hong Kong",
    rules={"drones":"restricted"}, summary="Small Unmanned Aircraft Order (Cap. 448G): risk-based rules (registration of drones and remote pilots except A1 operations of 250 g or less, training, insurance); no flying in Restricted Flying Zones shown on CAD's Drone Map unless wholly enclosed, nor over the Penny's Bay prohibition area; higher-risk 'Advanced Operations' need CAD permission.",
    date=None, status="in_force", source="https://www.cad.gov.hk/english/sua_tipsforvisitors.html", publisher="Civil Aviation Department, Hong Kong", via=None)
for nm, url in [("PSAT/NMSQT (College Board)", "https://satsuite.collegeboard.org/testing-rules/psat-nmsqt"),
                ("SAT School Day (College Board)", "https://satsuite.collegeboard.org/testing-rules/sat-school-day")]:
    add(name=nm, kind="exam", scope="organization", country="US", region=None, geo=None,
        rules={"camera_glasses":"prohibited","recording":"prohibited","ai_capture":"prohibited"},
        summary="Students may not bring or access during breaks: phones, smartwatches, smart glasses or any eyewear that provides access to the internet or to any AI feature or service, wearables, cameras, recording or listening devices.",
        date=None, status="in_force", source=url, publisher="College Board", via=None)
