# Phase 2 seed entries (retrieved 2026-11-21). Same rules as seed_source.py: every entry cites a real public source.
# Optional fields: boundary (OSM query for a jurisdiction polygon), radius_m, lat/lng, effective_from, expires, temporary.
E = []
def add(**k): E.append(k)

# ---------------- Robots: US state personal-delivery-device laws (Delivery Tech Watch state table, updated 2026-11-14) ----------------
DTW_TABLE = "https://deliverytechwatch.com/states"
def _src(st):
    """Official statute/agency page cited by the DTW state page, fetched 2026-11-21 and confirmed to mention personal delivery devices
    (scripts/dtw_official_links.py -> research/dtw/official_links.json). Falls back to DTW when none could be fetched."""
    o = _OFF.get(st, {}); url = (o.get("official") or "").replace("&amp;", "&")
    if url and not any(x in url for x in _NON_OFFICIAL):
        return dict(source=url, publisher=f"{st} (official statute/agency text)", via=o.get("dtw"))
    return dict(source=DTW_TABLE, publisher="Delivery Tech Watch (state law table)", via=next((c.replace("&amp;", "&") for c in o.get("candidates", []) if ".gov" in c or "legis" in c), None))
STATES = [  # state, year, weight limit, sidewalk speed, state authorization, city powers
 ("Arizona",2018,"no limit","12 mph","not required","limited city-level powers"),
 ("Arkansas",2021,"500 lb","10 mph","not required","limited city-level powers"),
 ("District of Columbia",2016,"275 lb","10 mph","mandatory",None),
 ("Florida",2017,None,"10 mph","not required","power to ban or regulate"),
 ("Georgia",2022,"500 lb","7 mph","not required","limited city-level powers"),
 ("Idaho",2017,"550 lb","10 mph","not required","power to ban or regulate"),
 ("Indiana",2021,"500 lb","10 mph","not required","limited city-level powers"),
 ("Iowa",2021,"550 lb","6 mph","not required","limited city-level powers"),
 ("Louisiana",2021,"500 lb","12 mph","not required","limited city-level powers"),
 ("Maryland",2021,"550 lb","7 mph","not required","power to ban or regulate"),
 ("Mississippi",2022,"no limit","10 mph","not required","power to ban or regulate"),
 ("Missouri",2021,"no limit","10 mph","not required","limited city-level powers"),
 ("Nevada",2024,"150 lb","10 mph","not required","power to ban or regulate"),
 ("New Hampshire",2022,"no limit","10 mph",None,"limited city-level powers"),
 ("North Carolina",2020,"500 lb","10 mph","not required","power to ban or regulate"),
 ("Ohio",2017,"550 lb","10 mph","not required","power to ban or regulate"),
 ("Oklahoma",2021,"550 lb","10 mph","not required","power to ban or regulate"),
 ("Pennsylvania",2021,"550 lb","12 mph","mandatory","limited city-level powers"),
 ("Tennessee",2020,"no limit","10 mph","not required","power to ban or regulate"),
 ("Texas",2019,"no limit","10 mph","not required","limited city-level powers"),
 ("Utah",2018,"no limit","10 mph","not required","limited city-level powers"),
 ("Virginia",2017,"500 lb","10 mph","not required","limited city-level powers"),
 ("Washington",2019,"120 lb","6 mph","mandatory","power to ban or regulate"),
 ("West Virginia",2022,"no limit","12 mph","not required","preempted (no city-level powers)"),
 ("Wisconsin",2017,"80 lb","10 mph","not required","power to ban or regulate"),
]
import json as _json, os as _os
_OFF = _json.load(open(_os.path.join(_os.path.dirname(__file__), "..", "research", "dtw", "official_links.json")))
_NON_OFFICIAL = ("indianachamber.com",)
for st, yr, w, sp, auth, city in STATES:
    bits = [f"sidewalk speed limit {sp}"]
    if w: bits.append(f"weight limit {w}")
    if auth: bits.append(f"state authorization {auth}")
    if city: bits.append(f"cities: {city}")
    add(name=f"{st} sidewalks (state delivery-robot law)", kind="jurisdiction", scope="jurisdiction", country="US", region=st,
        geo=None, boundary=(f"state={st}|country=United States" if st == "Washington" else f"{st}, United States"), rules={"robots": "restricted"},
        summary=f"State personal delivery device law in force since {yr}: robots allowed on sidewalks under conditions ({'; '.join(bits)}). Conditions as tabulated by Delivery Tech Watch (updated 2026-11-14).",
        date=str(yr), status="in_force", **_src(st))

DTW_CA = "https://deliverytechwatch.com/states/california"
add(name="Los Angeles delivery-robot permit pilot", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo=None, boundary="Los Angeles, California, United States",
    rules={"robots":"restricted"}, summary="Ordinance No. 187715 (2023) authorized LADOT to run a pilot permit program for delivery robots, with rules on insurance, speed, sidewalk access, hours, fleet size and data sharing.",
    date="2023", status="in_force", source=DTW_CA, publisher="Delivery Tech Watch (citing LA Ordinance 187715)", via=None)
add(name="Fremont (CA) DoorDash robot encroachment permit", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo=None, boundary="Fremont, California, United States",
    rules={"robots":"restricted"}, summary="Phased Public Works encroachment permit lets DoorDash run delivery robots until about March 2027: 5 mph on sidewalks, 16 mph in bike lanes, 20 mph on neighborhood streets.",
    date="2026-02-17", status="in_force", expires="2027-03", source=DTW_CA, publisher="Delivery Tech Watch (citing Fremont staff report 5643)", via=None)
add(name="Culver City sidewalk delivery-robot pilot", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo=None, boundary="Culver City, California, United States",
    rules={"robots":"restricted"}, summary="Council approved a one-year pilot for sidewalk delivery robots under an operator user agreement and administrative regulations.",
    date="2026-08-10", status="in_force", temporary=True, expires="2027-08", source=DTW_CA, publisher="Delivery Tech Watch (citing Culver City Council action)", via=None)
add(name="Concord (CA) delivery-robot encroachment permits", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo=None, boundary="Concord, California, United States",
    rules={"robots":"restricted"}, summary="Resolution 19-44 lets the City Manager enter delivery-robot encroachment permit agreements (operators assume liability, insurance, monitoring).",
    date="2019-08-13", status="in_force", source=DTW_CA, publisher="Delivery Tech Watch (citing Concord Resolution 19-44)", via=None)

# ---------------- Thailand ----------------
GP = "https://cdn.royalgrandpalace.th/images/visit/ระเบียบหน่วยราชการฯเข้าชมวัดวัง2567.pdf"  # scanned Thai PDF, clauses 11-12 read from page images 2026-11-21
GP_PAGE = "https://www.royalgrandpalace.th/en/visit/practical-information"
add(name="The Grand Palace and Wat Phra Kaew (Temple of the Emerald Buddha)", kind="monument", scope="zones", country="TH", region="Bangkok", geo="Grand Palace, Bangkok",
    rules={"recording":"restricted","drones":"prohibited"},
    zones=[{"zone":"Interior of Wat Phra Kaew ordination hall (ubosot, Emerald Buddha)","recording":"prohibited"},{"zone":"grounds and building exteriors","recording":"allowed (ordinary cameras for tourism; no lighting rigs, cranes, dollies, wireless mics; no commercial/political use)"}],
    summary="Bureau of the Royal Household regulation B.E. 2567 (2024), cl. 11-12: tourists may photograph and film (incl. live streaming) with ordinary cameras for tourism, not for advertising, commerce or politics; no lighting, cranes, dollies, wireless camera microphones or camera drones; pre-wedding shoots not allowed; filming areas exclude the interior of Wat Phra Kaew's ordination hall. The palace site marks the area a No Drone Zone.",
    date="2024-12", status="in_force", source=GP, publisher="Bureau of the Royal Household (regulation B.E. 2567, via royalgrandpalace.th)", via=GP_PAGE)
for nm, q in [("Bang Pa-In Royal Palace","Bang Pa-in Palace"),("Bhubing Palace (Chiang Mai)","Bhubing Palace"),
              ("Phu Phan Rajaniwet Palace (Sakon Nakhon)","Phu Phan Ratchaniwet, Sakon Nakhon"),("Thaksin Rajaniwet Palace (Narathiwat)","Thaksin Ratchaniwet Palace, Narathiwat")]:
    add(name=nm, kind="monument", scope="venue", country="TH", region=None, geo=q, rules={"recording":"restricted","drones":"prohibited"},
        summary="Royal residences (เขตพระราชฐาน) are covered by the Bureau of the Royal Household's 2024 visiting/filming/photography regulation: ordinary tourist cameras only; no lighting rigs, cranes, dollies, wireless mics or camera drones; filming only outside the residence buildings in areas the Bureau designates.",
        date="2024-12", status="in_force", source=GP, publisher="Bureau of the Royal Household (regulation B.E. 2567)", via="https://xtour.travel/guides/visiting-thai-temples-official-rules")
CAAT = "https://www.thailand.go.th/issue-focus-detail/updated-guide-for-tourists-regarding-flying-a-drone-in-thailand"
add(name="Thailand (national drone rules)", kind="jurisdiction", scope="jurisdiction", country="TH", region=None, geo=None, boundary="Thailand",
    rules={"drones":"restricted"},
    summary="Drones must be registered with NBTC and (if camera-equipped or >2 kg) CAAT; daylight and visual line of sight only; no flights over urban areas, gatherings, government buildings, hospitals or military zones without authorisation; not within 9 km of an airport without approval; max 90 m.",
    date="2025-06-27", status="in_force", source=CAAT, publisher="Royal Thai Government (thailand.go.th), citing CAAT", via="https://www.caat.or.th/wp-content/uploads/2025/09/Flying-a-drone-in-Thailand-ENG.pdf")
_ARP = _json.load(open(_os.path.join(_os.path.dirname(__file__), "..", "research", "aip", "arp.json")))
for nm, icao in [("Suvarnabhumi Airport","VTBS"),("Don Mueang International Airport","VTBD"),("Phuket International Airport","VTSP"),
                 ("Chiang Mai International Airport","VTCC"),("Krabi International Airport","VTSG"),("Samui Airport","VTSM"),
                 ("Hat Yai International Airport","VTSS"),("U-Tapao International Airport","VTBU"),
                 ("Mae Fah Luang–Chiang Rai International Airport","VTCT"),("Khon Kaen Airport","VTUK"),("Buri Ram Airport","VTUO"),
                 ("Lampang Airport","VTCL"),("Loei Airport","VTUL"),("Chumphon Airport","VTSE"),("Lop Buri (Khok Kathiam) aerodrome","VTBL")]:
    a = _ARP[icao]
    add(name=f"{nm} 9 km drone zone", kind="airport", scope="radius", country="TH", region=None, geo=None, lat=a["lat"], lng=a["lng"], radius_m=9000,
        coord_source=f"Aerodrome reference point, AIP Thailand AD 2.2 {icao} (AIRAC 2026-10-29): {a['url']}",
        rules={"drones":"prohibited"}, summary=f"No drone flights within 9 km of an aerodrome without prior CAAT approval. Circle centred on the official aerodrome reference point of {icao} (AIP Thailand).",
        date="2025-06-27", status="in_force", source=CAAT, publisher="Royal Thai Government (thailand.go.th), citing CAAT", via=None)
add(name="Thai national parks (DNP)", kind="park", scope="organization", country="TH", region=None, geo=None,
    rules={"drones":"restricted"}, summary="Drone use in a national park requires permission from that park's chief, in designated areas only, plus valid CAAT registration (National Parks Act B.E. 2562, ss. 20, 22, 29).",
    date="2019-11-26", status="in_force", source="https://portal.dnp.go.th/Content/nationalpark?contentId=14786", publisher="Department of National Parks, Wildlife and Plant Conservation", via=None)
add(name="Hat Noppharat Thara–Mu Ko Phi Phi National Park", kind="park", scope="venue", country="TH", region="Krabi", geo="Ko Phi Phi Don, Krabi",
    rules={"drones":"restricted"}, summary="Personal drone photography needs a written request to the park chief with CAAT pilot registration and NBTC radio registration, filed 5 working days ahead.",
    date="2024-04-07", status="in_force", source="https://www.krabitouristpolice.go.th/select_news.php?news_id=57", publisher="Krabi Tourist Police", via=None)
DNPF = "https://npes.dnp.go.th/e-booking/filming-permit-info"
for nm, q in [("Khao Yai National Park","Khao Yai National Park"),("Nam Tok Chet Sao Noi National Park","Namtok Chet Sao Noi National Park"),
              ("Khao Laem Ya–Mu Ko Samet National Park","Ko Samet, Rayong"),("Erawan National Park","Erawan National Park")]:
    add(name=nm, kind="park", scope="venue", country="TH", region=None, geo=q, rules={"recording":"restricted","drones":"restricted"},
        zones=[{"zone":"Saturdays and Sundays","recording":"permitted filming shoots not allowed"}],
        summary="Filming permits (incl. drone use, which needs CAAT flight approval 3 working days ahead and park-chief opinion) are required; this park asks that permitted filming not take place on Saturdays or Sundays.",
        date=None, status="in_force", source=DNPF, publisher="Department of National Parks (filming permit info)", via=None)
add(name="IDP IELTS test centres, Thailand", kind="exam", scope="organization", country="TH", region=None, geo=None,
    rules={"recording":"prohibited","camera_glasses":"prohibited"},
    summary="No electronic devices of any kind in the test room, including phones, all watches, fitness trackers, cameras and recording devices.",
    date=None, status="in_force", source="https://ielts.idp.com/thailand/about/test-day/what-to-bring", publisher="IDP IELTS Thailand", via=None)

# ---------------- Japan ----------------
NPA = "https://laws.e-gov.go.jp/law/428AC1000000009/"  # current text (amended by Act No. 47 of 2026, in force 2026-07-14)
NPA_JA = "https://www.npa.go.jp/bureau/security/kogatamujinki/"
for nm, q in [("National Diet Building","National Diet Building, Tokyo"),("Prime Minister's Office (Kantei)","首相官邸"),
              ("Supreme Court of Japan","最高裁判所"),("Imperial Palace (Tokyo)","Tokyo Imperial Palace"),
              ("Akasaka Estate","Akasaka Palace, Tokyo"),("National Diet Library","National Diet Library, Tokyo")]:
    add(name=f"{nm} — Drone Act zone", kind="government", scope="radius", country="JP", region="Tokyo", geo=q, radius_m=1000,
        rules={"drones":"prohibited"},
        summary="Designated facility under Japan's Small Unmanned Aircraft Prohibition Act: flights prohibited over the premises (Red Zone) and the area about 1,000 m around it (Yellow Zone; Art. 3(2) as amended by Act No. 47 of 2026, in force 2026-07-14; previously about 300 m) without the administrator's consent plus prior police notice. The 1,000 m is measured from the premises boundary, so this circle around a centre point is a minimum.",
        date="2026-07-14", status="in_force", source=NPA, publisher="e-Gov Law Search (Act No. 9 of 2016, current text)", via=NPA_JA)
MLIT = "https://www.mlit.go.jp/en/koku/uas.html"
add(name="Japan (national drone flight rules)", kind="jurisdiction", scope="jurisdiction", country="JP", region=None, geo=None, boundary="Japan",
    rules={"drones":"restricted"}, summary="MLIT permission is needed to fly over Densely Inhabited Districts, at 150 m or more above ground, or around airports.",
    date=None, status="in_force", source=MLIT, publisher="MLIT Civil Aviation Bureau", via=None)
for nm, q in [("Haneda Airport","Haneda Airport, Tokyo"),("Narita International Airport","Narita International Airport"),("Kansai International Airport","Kansai International Airport"),
              ("New Chitose Airport","New Chitose Airport"),("Chubu Centrair International Airport","Chubu Centrair International Airport"),
              ("Osaka International Airport (Itami)","Osaka International Airport"),("Fukuoka Airport","Fukuoka Airport"),("Naha Airport","Naha Airport")]:
    add(name=f"{nm} airspace (drones)", kind="airport", scope="venue", country="JP", region=None, geo=q,
        rules={"drones":"prohibited"}, summary="One of the 8 airports MLIT designated under the Drone Act (notice 2026-07-03, applied from 2026-07-14): drones and similar are prohibited over the airport premises (Red Zone) and the surrounding Yellow Zone (about 1,000 m) regardless of size, unless the airport administrator consents and police are notified in advance. MLIT's page has the official zone maps; MLIT permission under the Civil Aeronautics Act is needed separately.",
        date="2026-07-14", status="in_force", source="https://www.mlit.go.jp/koku/koku_tk2_000023.html", publisher="MLIT Civil Aviation Bureau", via=MLIT)
add(name="Tokyo metropolitan parks", kind="park", scope="organization", country="JP", region="Tokyo", geo=None,
    rules={"drones":"prohibited"}, summary="Drone flights (and radio-controlled aircraft) are prohibited in Tokyo metropolitan parks for user safety.",
    date=None, status="in_force", source="https://www.kensetsu.metro.tokyo.lg.jp/park/kouenannai/qanda", publisher="Tokyo Metropolitan Government Bureau of Construction", via=None)
add(name="Ueno Park (Ueno Onshi Koen)", kind="park", scope="venue", country="JP", region="Tokyo", geo="Ueno Park, Tokyo",
    rules={"drones":"prohibited"}, summary="Use of drones and radio-controlled models in the park is prohibited.",
    date="2023-03-06", status="in_force", source="https://www.kensetsu.metro.tokyo.lg.jp/jimusho/toubuk/ueno/rules/", publisher="Tokyo Metropolitan Government (Ueno Park)", via=None)
add(name="Kosode-koji private lane, Gion (Kyoto)", kind="street", scope="venue", country="JP", region="Kyoto", geo="花見小路通",
    rules={"recording":"restricted"}, summary="Residents closed this private lane to tourists; photographing geiko and maiko without permission is not allowed.",
    date=None, status="in_force", source="https://gionminami.jp/?page_id=578", publisher="Gion Minami (residents' site supported by Kyoto city)", via=None)

# ---------------- Singapore / Hong Kong / Korea / Cambodia / India / Malaysia ----------------
CAAS = "https://www.caas.gov.sg/unmanned-aircraft/requirements-for-flying-ua/"
add(name="Singapore (national drone rules)", kind="jurisdiction", scope="jurisdiction", country="SG", region=None, geo=None, boundary="Singapore",
    rules={"drones":"restricted"}, summary="Permits needed above 200 ft AMSL, within restricted/danger areas, within 5 km of any airport or military airbase, or for events >50 people; UA activities never allowed in prohibited areas; SPF permit for protected areas.",
    date="2026-05-08", status="in_force", source=CAAS, publisher="Civil Aviation Authority of Singapore", via="https://www.caas.gov.sg/unmanned-aircraft/no-fly-zones-and-ua-flying-areas/")
for nm, icao in [("Singapore Changi Airport","WSSS"),("Seletar Airport","WSSL"),("Paya Lebar Air Base","WSAP"),
              ("Tengah Air Base","WSAT"),("Sembawang Air Base","WSAG")]:
    a = _ARP[icao]
    add(name=f"{nm} 5 km drone zone", kind="airport", scope="radius", country="SG", region=None, geo=None, lat=a["lat"], lng=a["lng"], radius_m=5000,
        coord_source=f"Aerodrome reference point, AIP Singapore AD 2.2 {icao} (valid 2026-09-03): {a['url']}",
        rules={"drones":"restricted"}, summary=f"Within 5 km of an airport or military airbase a CAAS Class 2 Activity Permit is required. Circle centred on the AIP reference point of {icao}; OneMap Drone Query is the authoritative boundary.",
        date="2026-05-08", status="in_force", source=CAAS, publisher="Civil Aviation Authority of Singapore", via=None)
CAD = "https://www.cad.gov.hk/english/sua_tipsforvisitors.html"
for nm, q, rule, s in [
    ("Hong Kong International Airport (Restricted Flying Zone)","Hong Kong International Airport","restricted","SUA must not be flown in this Restricted Flying Zone unless wholly within an enclosed area; operations need prior CAD permission."),
    ("Victoria Harbour (Restricted Flying Zone)","Star Ferry Pier Tsim Sha Tsui","restricted","SUA must not be flown in this Restricted Flying Zone unless wholly within an enclosed area; operations need prior CAD permission."),
    ("Express Rail Link West Kowloon Control Point (Restricted Flying Zone)","Hong Kong West Kowloon Station","restricted","SUA must not be flown in this Restricted Flying Zone unless wholly within an enclosed area; operations need prior CAD permission."),
    ("Cheung Chau Helipad area (Restricted Flying Zone)","Cheung Chau, Hong Kong","restricted","SUA must not be flown in this Restricted Flying Zone unless wholly within an enclosed area; operations need prior CAD permission."),
    ("Penny's Bay / Hong Kong Disneyland (Flight Prohibition Area)","Hong Kong Disneyland","prohibited","SUA must not be flown over the Prohibition Area under the Air Navigation (Flight Prohibition) Order, e.g. Hong Kong Disneyland.")]:
    add(name=nm, kind="airspace", scope="venue", country="HK", region=None, geo=q, rules={"drones":rule}, summary=s,
        date=None, status="in_force", source=CAD, publisher="Civil Aviation Department, Hong Kong", via=None)
SW = "https://www.seoulwindow.com/en/guides/drone-rules-korea-seoul/"
add(name="Cheong Wa Dae P-73 no-fly zone (Seoul)", kind="airspace", scope="radius", country="KR", region="Seoul", geo="Cheong Wa Dae, Seoul", radius_m=3700,
    rules={"drones":"prohibited"}, summary="Prohibited area P73 (central Seoul): drone flights need approval from the Capital Defense Command (02-524-3346), per MOLIT's Drone One-Stop service. The ~3.7 km radius around Cheong Wa Dae is from Seoul Window (citing Yonhap/MOLIT, Jan 2026), not from the official page.",
    date="2026-01", status="in_force", source="https://drone.onestop.go.kr/introduce/systemintro3/", publisher="MOLIT Drone One-Stop Civil Service (official)", via=SW)
add(name="Gwangnaru Hangang Drone Park (Seoul)", kind="park", scope="venue", country="KR", region="Seoul", geo="광나루한강공원",
    rules={"drones":"restricted"}, zones=[{"zone":"drone park, hobby drones up to 25 kg with booking","drones":"allowed"},{"zone":"drones fitted with a camera","drones":"restricted (separate aerial-photography approval via Drone One-Stop)"}],
    summary="Seoul's Hangang drone park (27,000 m², open since 2016): hobby drones up to 25 kg with free advance online booking; 08:00-16:00 Oct-Mar, 08:00-18:00 Apr-Sep, no flights after sunset; under 150 m, line of sight, not over crowds. Camera-equipped drones need separate aerial-photography approval.",
    date="2016-06-25", status="in_force", source="https://hangang.seoul.go.kr/www/contents/760.do?mid=512", publisher="Seoul Future Hangang Headquarters (official)", via=SW)
add(name="Hangang Parks (Seoul) — drones", kind="park", scope="organization", country="KR", region="Seoul", geo=None,
    rules={"drones":"prohibited"}, summary="The Hangang park area is a zone where unapproved drone flights are prohibited (punishable under the Aviation Safety Act); hobby drones up to 25 kg may use the Gwangnaru drone park, elsewhere flight approval (and aerial-photography approval for camera drones) via MOLIT's Drone One-Stop portal is required.",
    date=None, status="in_force", source="https://hangang.seoul.go.kr/www/bbsPost/7/530/detail.do?mid=590", publisher="Seoul Future Hangang Headquarters (official FAQ)", via=None)
add(name="Gimpo International Airport control zone (Seoul)", kind="airport", scope="radius", country="KR", region="Seoul", geo="Gimpo International Airport", radius_m=9300,
    rules={"drones":"restricted"}, summary="Airfield control zones extend 9.3 km; unauthorized flight in a control zone that disrupts aircraft is a criminal offence.",
    date="2026-01", status="in_force", source=SW, publisher="Seoul Window (secondary)", via=None)
add(name="Angkor Archaeological Park", kind="monument", scope="venue", country="KH", region="Siem Reap", geo="Angkor Wat",
    rules={"drones":"prohibited","recording":"restricted"}, summary="Drones (and 360/180-degree cameras) may not be used at Angkor without a prior written request to the APSARA Authority, which checks the content and purpose (spokesperson Long Kosal, Jan 2023); APSARA's visitor code of conduct also bars drones without written permission. Personal photos and videos are fine.",
    date="2023-01-06", status="in_force", source="https://eacnews.asia/home/details/18661", publisher="EAC News (secondary, quoting the APSARA Authority spokesperson)", source_type="secondary",
    via="https://siemreap.net/wp-content/uploads/2017/04/angkor-visitor-code-of-conduct-english.pdf")
add(name="India (drone airspace zones)", kind="jurisdiction", scope="jurisdiction", country="IN", region=None, geo=None, boundary="India",
    rules={"drones":"restricted"}, summary="Digital Sky airspace map: green zones need no permission (up to 400 ft); yellow zones need ATC permission; red zones need Central Government permission.",
    date=None, status="in_force", source="https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1757850&lang=2&reg=3", publisher="Press Information Bureau, Ministry of Civil Aviation", via=None)
add(name="Malaysia (drone authorisation)", kind="jurisdiction", scope="jurisdiction", country="MY", region=None, geo=None, boundary="Malaysia",
    rules={"drones":"restricted"}, summary="CAAM authorisation (e.g. Standard Authorisation to Fly) is required for drone operations in Class A, B, C or G airspace; no flying above 400 ft without authorisation; dropping objects prohibited.",
    date=None, status="in_force", source="https://www.caam.gov.my/public/unmanned-aircraft-system-uas/", publisher="Civil Aviation Authority of Malaysia", via=None)

# ---------------- Europe / Oceania / North America ----------------
add(name="Anne Frank House", kind="museum", scope="venue", country="NL", region="Amsterdam", geo="Anne Frank House, Amsterdam",
    rules={"recording":"prohibited"}, summary="Except with prior written permission, visitors may not shoot photographs, video or film in the museum complex (Article 4.7).",
    date=None, status="in_force", source="https://www.annefrank.org/en/museum/practical-information/terms-and-conditions-visiting/", publisher="Anne Frank House", via=None)
add(name="Rijksmuseum", kind="museum", scope="zones", country="NL", region="Amsterdam", geo="Rijksmuseum, Amsterdam",
    rules={"recording":"restricted"}, zones=[{"zone":"exhibition wing, Cuypers Library","recording":"prohibited"},{"zone":"public areas","recording":"allowed (no flash)"}],
    summary="Photos allowed in public areas without flash; not in the exhibition wing or the Cuypers Library.",
    date=None, status="in_force", source="https://www.rijksmuseum.nl/en/press/filming-and-photographing", publisher="Rijksmuseum", via="https://www.rijksmuseum.nl/en/visit/faq")
add(name="Van Gogh Museum", kind="museum", scope="venue", country="NL", region="Amsterdam", geo="Van Gogh Museum, Amsterdam",
    rules={"recording":"restricted"}, summary="Personal photography allowed without flash, lamps, tripod or selfie stick; filming or making videos is not allowed without explicit permission.",
    date=None, status="in_force", source="https://www.vangoghmuseum.nl/en/visit/house-rules", publisher="Van Gogh Museum", via=None)
add(name="Musée du Louvre", kind="museum", scope="venue", country="FR", region="Paris", geo="Louvre Museum, Paris",
    rules={"recording":"restricted"}, summary="Photos and videos for personal use allowed in the permanent collections; no selfie sticks, flash or lighting; may be prohibited for certain works in temporary exhibitions.",
    date=None, status="in_force", source="https://www.louvre.fr/en/visit/museum-rules", publisher="Musée du Louvre", via=None)
add(name="Paris (drone filming)", kind="jurisdiction", scope="jurisdiction", country="FR", region="Île-de-France", geo=None, boundary="Paris, France",
    rules={"drones":"prohibited"}, summary="Without a Préfecture de police derogation, drone filming is strictly prohibited in Paris (prohibited zone P23).",
    date=None, status="in_force", source="https://www.paris.fr/pages/tourner-avec-un-drone-35519", publisher="Ville de Paris", via=None)
add(name="Neuschwanstein Castle", kind="monument", scope="zones", country="DE", region="Bavaria", geo="Neuschwanstein Castle",
    rules={"recording":"restricted","drones":"prohibited"}, zones=[{"zone":"castle interior","recording":"prohibited"},{"zone":"exterior","recording":"allowed (private use)"}],
    summary="Photographing or filming for private purposes is not permitted inside the castle; site regulations forbid launching, landing or flying drones over the property without permission.",
    date=None, status="in_force", source="https://neuschwanstein.de/englisch/tourist/", publisher="Bavarian Palace Administration", via="https://www.schloesser.bayern.de/deutsch/garten/objekte/anlagenvorschriften/neuschwanstein_avo-engl.pdf")
add(name="UK aerodrome Flight Restriction Zones", kind="jurisdiction", scope="jurisdiction", country="GB", region=None, geo=None, boundary="United Kingdom",
    rules={"drones":"restricted"}, summary="Protected aerodromes have an FRZ (2–2.5 nm ATZ cylinder plus 1 km x 5 km runway protection zones, up to 2,000 ft); flying in it needs permission from the aerodrome.",
    date=None, status="in_force", source="https://www.caa.co.uk/drones/open-category/moving-on-to-more-advanced-flying/airspace/aerodromes-heliports-and-spaceports/", publisher="UK Civil Aviation Authority", via=None)
add(name="Uluṟu-Kata Tjuṯa National Park", kind="park", scope="venue", country="AU", region="Northern Territory", geo="Uluru",
    rules={"drones":"prohibited"}, summary="Remote-controlled devices including drones are not allowed; operating a drone is an offence under the EPBC Act.",
    date=None, status="in_force", source="https://uluru.gov.au/about/frequently-asked-questions/", publisher="Parks Australia", via=None)
add(name="NSW national parks and reserves (NPWS)", kind="park", scope="organization", country="AU", region="New South Wales", geo=None,
    rules={"drones":"restricted"}, summary="Approval needed to launch, land or operate a drone in any NPWS park or reserve (apply 10 days ahead); some parks do not allow recreational drones.",
    date=None, status="in_force", source="https://www.nationalparks.nsw.gov.au/conservation-and-heritage/care-for-parks/drones-in-parks", publisher="NSW National Parks and Wildlife Service", via=None)
add(name="New Zealand public conservation land (DOC)", kind="park", scope="organization", country="NZ", region=None, geo=None,
    rules={"drones":"restricted"}, summary="All drones taking off, hovering or landing on public conservation land need a DOC permit; green zones approved instantly online, orange case-by-case, red rarely approved.",
    date=None, status="in_force", source="https://www.doc.govt.nz/get-involved/apply-for-permits/all-permissions/drone-use-on-conservation-land/recreational-drone-use/", publisher="Department of Conservation", via=None)
add(name="Parks Canada places (all national parks and sites)", kind="park", scope="organization", country="CA", region=None, geo=None,
    rules={"drones":"prohibited"}, summary="All Parks Canada places are 'no drone zones' for recreational use; flying without approval can bring fines up to $25,000.",
    date=None, status="in_force", source="https://parks.canada.ca/voyage-travel/regles-rules/drones", publisher="Parks Canada", via=None)
add(name="Banff National Park", kind="park", scope="venue", country="CA", region="Alberta", geo="Banff National Park",
    rules={"drones":"prohibited"}, summary="Recreational drone flying prohibited; commercial use only by Restricted Activity Permit from the Superintendent.",
    date=None, status="in_force", source="https://parks.canada.ca/pn-np/ab/banff/info/permis-permit/drone", publisher="Parks Canada", via=None)
add(name="U.S. National Park System (default)", kind="park", scope="organization", country="US", region=None, geo=None,
    rules={"drones":"prohibited"}, summary="Policy Memorandum 14-05 directs superintendents to prohibit launching, landing or operating uncrewed aircraft under 36 CFR 1.5 (still in force with a few exceptions); violations are misdemeanors up to 6 months and $5,000.",
    date="2014-06", status="in_force", source="https://www.nps.gov/articles/uncrewed-aircraft-in-the-national-parks.htm", publisher="U.S. National Park Service", via=None)
add(name="Washington DC Flight Restricted Zone (15-mile inner ring)", kind="airspace", scope="radius", country="US", region="District of Columbia", geo="Ronald Reagan Washington National Airport", radius_m=24140,
    rules={"drones":"prohibited"}, summary="Flying an unmanned aircraft within the 15-mile inner ring of the DC SFRA is prohibited without specific FAA authorization.",
    date=None, status="in_force", source="https://www.faa.gov/uas/resources/community_engagement/no_drone_zone/dc", publisher="Federal Aviation Administration", via=None)
add(name="Portland (OR) places of public accommodation", kind="jurisdiction", scope="jurisdiction", country="US", region="Oregon", geo=None, boundary="Portland, Oregon, United States",
    rules={"ai_capture":"prohibited"}, summary="City Code ch. 34.10 prohibits private entities from using face recognition technologies in places of public accommodation (limited exceptions).",
    date=None, status="in_force", source="https://www.portland.gov/code/34/10", publisher="City of Portland", via=None)
add(name="Pearson VUE test centres (NCBE exams)", kind="exam", scope="organization", country="US", region=None, geo=None,
    rules={"camera_glasses":"prohibited","recording":"prohibited"}, summary="No personal items in the testing room, including cell phones, smart glasses, picture-taking devices and wearable technology.",
    date="2026-06", status="in_force", source="https://www.ncbex.org/sites/default/files/2026-06/NCBE%20Candidate%20Rules%20Agreement.pdf", publisher="NCBE / Pearson VUE", via=None)
