# Hand-curated seed entries. Every entry cites a real public source.
# rules keys: camera_glasses, recording, ai_capture, robots, drones
# values: allowed | restricted | prohibited   (omitted = not addressed by the source)
VR = "https://vr.org/smart-glasses-bans"
E = []
def add(**k): E.append(k)

# ---------- Smart / camera glasses (found via VR.org tracker, primary source linked) ----------
add(name="U.S. District Court for the District of Maryland", kind="court", scope="multi_site", country="US", region="Maryland",
    geo="Baltimore, Maryland, USA", rules={"camera_glasses":"prohibited"},
    summary="Visitors may not bring smart glasses into the courthouse, with limited exceptions.",
    date="2026-11-02", status="in_force", source="https://www.mdd.uscourts.gov/news/electronic-devices-courthouse-2026-10-27t000000", publisher="U.S. District Court, District of Maryland", via=VR)
add(name="Polk County Public Schools", kind="school", scope="multi_site", country="US", region="Florida",
    geo="Polk County, Florida, USA", rules={"camera_glasses":"prohibited"},
    summary="Students may not possess or wear Meta/Ray-Ban smart glasses and similar wearable recording or communication devices in school.",
    date="2026-08", status="in_force", source="https://www.polkschoolsfl.com/news/important_notice_regarding_smart_glasses", publisher="Polk County Public Schools", via=VR)
add(name="New York State Unified Court System (all state and local courts)", kind="court", scope="multi_site", country="US", region="New York",
    geo="Albany, New York, USA", rules={"camera_glasses":"prohibited"},
    summary="Smart glasses are prohibited in the state's courthouses.",
    date="2026-07", status="in_force", source="https://www.nycourts.gov/press/court-policy-prohibition-against-smart-glasses", publisher="New York State Unified Court System", via=VR)
add(name="Philadelphia First Judicial District courthouses", kind="court", scope="multi_site", country="US", region="Pennsylvania",
    geo="Philadelphia City Hall, Philadelphia, USA", rules={"camera_glasses":"prohibited","recording":"prohibited"},
    summary="Glasses with any recording capability, prescription included, are not permitted in any First Judicial District courthouse, building or office without written authorization; wearers are denied entry.",
    date="2026-03", status="in_force", source="https://courts.phila.gov/pdf/notices/2026/Smart-Glasses-Order.pdf", publisher="First Judicial District of Pennsylvania", via=VR)
add(name="Marine Corps Installations East (MCB Camp Lejeune)", kind="military", scope="multi_site", country="US", region="North Carolina",
    geo="Camp Lejeune, North Carolina, USA", rules={"camera_glasses":"prohibited"},
    summary="Smart glasses are prohibited for use and wear aboard MCIEAST-MCB Camp Lejeune under the region's photo and video policy.",
    date="2026-02-12", status="in_force", source="https://www.lejeune.marines.mil/Sections/G-3-5-Operations-Plans/Operations-Security-OPSEC/", publisher="MCIEAST-MCB Camp Lejeune", via=VR)
add(name="U.S. District Court for the Western District of Wisconsin", kind="court", scope="venue", country="US", region="Wisconsin",
    geo="Madison, Wisconsin, USA", rules={"camera_glasses":"prohibited"},
    summary="Smart glasses are on the court's list of prohibited items.",
    date="2025-02", status="in_force", source="https://www.wiwd.uscourts.gov/news/updated-list-prohibited-items", publisher="U.S. District Court, Western District of Wisconsin", via=VR)
add(name="U.S. District Court for the Middle District of Florida", kind="court", scope="multi_site", country="US", region="Florida",
    geo="Tampa, Florida, USA", rules={"camera_glasses":"prohibited"},
    summary="Smart glasses are prohibited in all areas of the courthouse.",
    date=None, status="in_force", source="https://www.flmd.uscourts.gov/security", publisher="U.S. District Court, Middle District of Florida", via=VR)
add(name="SAT test centers (College Board)", kind="exam", scope="organization", country="US", region=None,
    geo=None, rules={"camera_glasses":"prohibited","ai_capture":"prohibited"},
    summary="Smart glasses and any eyewear with internet or AI features are not allowed during testing, prescription pairs included.",
    date=None, status="in_force", source="https://satsuite.collegeboard.org/testing-rules/sat", publisher="College Board", via=VR)
add(name="Royal Caribbean ships (onboard zones)", kind="cruise", scope="zones", country="US", region=None,
    geo=None, rules={"camera_glasses":"restricted"},
    zones=[{"zone":"casino, spa, restrooms, locker rooms, medical areas, youth areas, crew areas","camera_glasses":"prohibited"},{"zone":"rest of ship","camera_glasses":"allowed"}],
    summary="Smart glasses may come aboard but may not be used in the casino, spa, restrooms, locker rooms, medical areas, youth areas or crew areas.",
    date=None, status="in_force", source="https://www.royalcaribbean.com/faq/questions/prohibited-items-onboard-policy", publisher="Royal Caribbean", via=VR)
add(name="U.S. Immigration and Customs Enforcement workplaces", kind="government", scope="organization", country="US", region=None,
    geo=None, rules={"camera_glasses":"prohibited"},
    summary="An internal memo (reported, not public) bars employees from wearing Meta's glasses in the federal workspace.",
    date="2026-08-18", status="in_force", source="https://www.nytimes.com/2026/08/18/technology/ice-meta-smart-glasses.html", publisher="The New York Times", via=VR)
add(name="Courts and tribunals of England and Wales (HMCTS)", kind="court", scope="multi_site", country="GB", region="England and Wales",
    geo="Royal Courts of Justice, London", rules={"camera_glasses":"prohibited"},
    summary="Meta's glasses are prohibited in criminal, civil and family courts and tribunals in England and Wales; they are taken at the entrance and returned on exit.",
    date="2026-08-11", status="in_force", source="https://www.theguardian.com/technology/2026/aug/11/meta-glasses-banned-from-courts-in-england-and-wales", publisher="The Guardian", via=VR)
add(name="GCSE and A level exam rooms (JCQ)", kind="exam", scope="organization", country="GB", region=None,
    geo=None, rules={"camera_glasses":"prohibited"},
    summary="Smart glasses are unauthorised material that candidates must not take into the exam room; possession alone can lead to sanctions.",
    date="2026-09-01", status="in_force", source="https://www.jcq.org.uk/knowledge-hub/written-exams/", publisher="Joint Council for Qualifications", via=VR)
for nm in ["ATG Theatres (UK)","Soho House (UK)","Jeremy King restaurants (London)"]:
    add(name=nm, kind="venue", scope="multi_site", country="GB", region=None, geo="London, United Kingdom",
        rules={"camera_glasses":"restricted"},
        summary="Reported to ask wearers to remove camera glasses (at ATG, during performances).",
        date="2026-08-06", status="in_force", source="https://www.theguardian.com/technology/2026/aug/06/restaurants-pubs-and-theatres-ban-metas-spy-glasses-over-privacy-fears", publisher="The Guardian", via=VR)
add(name="UK Comic-Con (Monopoly Events)", kind="event", scope="organization", country="GB", region=None, geo=None,
    rules={"camera_glasses":"prohibited","recording":"prohibited"},
    summary="Attendees may not wear any recording device at its events; offenders may be removed.",
    date="2026-07", status="in_force", source="https://www.bbc.co.uk/news/articles/c204le0nvn3o", publisher="BBC News", via=VR)
add(name="Senedd Siambr (Welsh Parliament debating chamber)", kind="legislature", scope="venue", country="GB", region="Wales",
    geo="Senedd, Cardiff Bay, Cardiff", rules={"camera_glasses":"prohibited"},
    summary="Members may not use smart glasses in the Siambr until a review is complete (temporary).",
    date="2026-11-11", status="in_force_temporary", source="https://nation.cymru/news/smart-glasses-banned-in-senedd-until-further-notice/", publisher="Nation.Cymru", via=VR)
add(name="Western Australia public schools", kind="school", scope="multi_site", country="AU", region="Western Australia",
    geo="Perth, Western Australia", rules={"camera_glasses":"prohibited"},
    summary="Smart glasses are banned on government school premises and at school events for students, staff, parents, visitors and contractors (exemptions for approved medical/accessibility reasons).",
    date="2026-10-12", status="in_force", source="https://www.education.wa.edu.au/web/policies/-/ceo-instruction-ban-on-smart-glasses-school-premises-and-residential-facilities", publisher="WA Department of Education", via=VR)
add(name="City of Sydney pools", kind="pool", scope="multi_site", country="AU", region="New South Wales",
    geo="Sydney Town Hall, Sydney", rules={"camera_glasses":"prohibited"},
    summary="Smart glasses may not be used at City of Sydney pools; the resolution extends the rule to leisure centres, libraries and childcare.",
    date="2026-09", status="in_force", source="http://meetings.cityofsydney.nsw.gov.au/ieDecisionDetails.aspx?Id=6875", publisher="City of Sydney", via=VR)
add(name="Yarra City Council pools, gyms, playgrounds and childcare", kind="local_government", scope="multi_site", country="AU", region="Victoria",
    geo="Richmond, Victoria, Australia", rules={"camera_glasses":"prohibited"},
    summary="Smart glasses barred from council pools, gyms, playgrounds and childcare.",
    date="2026-09", status="in_force", source="https://www.abc.net.au/news/2026-09-09/yarra-council-bans-smart-glasses-from-pools-playgrounds/107132706", publisher="ABC News", via=VR)
add(name="Brisbane City Council public pools", kind="pool", scope="multi_site", country="AU", region="Queensland",
    geo="Brisbane City Hall, Brisbane", rules={"camera_glasses":"allowed","recording":"prohibited"},
    summary="Bans filming people without consent at its public pools. Wearing the glasses is still allowed.",
    date="2026-08", status="in_force", source="https://www.abc.net.au/news/2026-08-25/brisbane-bans-non-consensual-filming-at-public-pools/107075886", publisher="ABC News", via=VR)
add(name="Early childhood education and care services (Australia, staff)", kind="childcare", scope="jurisdiction", country="AU", region=None,
    geo=None, rules={"camera_glasses":"prohibited"},
    summary="Staff cannot use or carry personal devices, smart glasses included, while working directly with children.",
    date="2026-02-27", status="in_force", source="https://www.acecqa.gov.au/national-quality-framework/child-safety/safe-use-devices-education-and-care-services", publisher="ACECQA", via=VR)
add(name="Victoria schools (students)", kind="school", scope="jurisdiction", country="AU", region="Victoria",
    geo="Melbourne, Victoria, Australia", rules={"camera_glasses":"restricted"},
    summary="Students at every Victorian school must keep smart glasses switched off and stored during school hours (Ministerial Order No. 1515).",
    date="2027-01-28", status="starts_soon", source="https://www.premier.vic.gov.au/smart-glasses-be-banned-all-victorian-schools", publisher="Premier of Victoria", via=VR)
add(name="Victoria government schools (adults and visitors)", kind="school", scope="jurisdiction", country="AU", region="Victoria",
    geo="Melbourne, Victoria, Australia", rules={"camera_glasses":"prohibited"},
    summary="Nobody, parents and visitors included, may wear or use smart glasses on government school premises or at school events.",
    date="2027-01-27", status="starts_soon", source="https://www2.education.vic.gov.au/pal/smart-glasses-covert-filming-devices/policy", publisher="Victorian Department of Education", via=VR)
add(name="City of Canterbury Bankstown leisure and aquatic centres", kind="pool", scope="multi_site", country="AU", region="New South Wales",
    geo="Bankstown, New South Wales, Australia", rules={"camera_glasses":"prohibited"},
    summary="Council voted to ban smart glasses from all its leisure and aquatic facilities; conditions of entry not yet updated as of Nov 15, 2026 per VR.org.",
    date="2026-09-15", status="starts_soon", source="https://www.cbcity.nsw.gov.au/sites/default/files/2026-09/minutes_-_ordinary_meeting_of_council_-_15_september_2026.pdf", publisher="City of Canterbury Bankstown", via=VR)
add(name="Oslo municipal schools", kind="school", scope="multi_site", country="NO", region="Oslo",
    geo="Oslo, Norway", rules={"camera_glasses":"prohibited","ai_capture":"prohibited"},
    summary="AI glasses are not allowed during the school day (\"KI-briller er ikke tillatt i skoletiden\").",
    date="2026-08", status="in_force", source="https://vestreaker.osloskolen.no/nyhetsarkiv/bruk-av-ki-briller-i-skolen/", publisher="Osloskolen", via=VR)
add(name="Punjab province (Pakistan)", kind="jurisdiction", scope="jurisdiction", country="PK", region="Punjab",
    geo="Lahore, Pakistan", rules={"camera_glasses":"prohibited"},
    summary="Section 144 order bans wearing, using and selling camera glasses with hidden recording ability (and disguised mini cameras) across Punjab. First 30-day order 2026-10-20; extended for another 30 days (reported 2026-11-19).",
    date="2026-11-19", status="in_force_temporary", source="https://www.dunyanews.tv/en/Pakistan/983738-punjab-extends-ban-on-use-sale-of-cameraenabled-smart-glasses-other", publisher="Dunya News", via="https://www.dawn.com/news/2038582/punjab-govt-issues-ban-on-use-and-sale-of-camera-enabled-smart-glasses-devices-with-hidden-recording-ability")
add(name="Canadian Department of National Defence / CAF secure zones", kind="military", scope="organization", country="CA", region=None,
    geo=None, rules={"camera_glasses":"prohibited","ai_capture":"prohibited"},
    summary="AI glasses are forbidden in all Operations, Security and High Security Zones.",
    date="2026-07-06", status="in_force", source="https://www.canada.ca/en/department-national-defence/maple-leaf/defence/2026/07/artificial-intelligence-glasses.html", publisher="Government of Canada", via=VR)
add(name="CSAT exam rooms (South Korea)", kind="exam", scope="jurisdiction", country="KR", region=None,
    geo=None, rules={"camera_glasses":"prohibited"},
    summary="Having smart glasses in the exam room voids that year's exam; wearing them also bars the student from the next year's test.",
    date="2026-10", status="in_force", source="https://www.koreajoongangdaily.com/korea/ai-glasses-could-cost-students-two-csats/12922933", publisher="Korea JoongAng Daily", via=VR)
add(name="Courts Service of Ireland (court buildings)", kind="court", scope="multi_site", country="IE", region=None,
    geo="Four Courts, Dublin", rules={"camera_glasses":"allowed","recording":"prohibited"},
    summary="Smart glasses are not banned from Irish court buildings, but recording a hearing without a judge's permission can lead to contempt proceedings.",
    date="2026-11-12", status="in_force", source="https://www.rte.ie/news/business/2026/1112/1599006-smart-glasses-not-allowed-to-record-court-proceedings/", publisher="RTE News", via=VR)

# ---------- Irish gyms (Irish Times, Oct 27 2026) ----------
IT="https://www.irishtimes.com/ireland/2026/10/27/smart-glasses-people-shouldnt-have-to-worry-about-a-recording-or-where-it-might-end-up/"
add(name="BD Gyms (5 gyms, Dublin and Laois)", kind="gym", scope="multi_site", country="IE", region="Dublin", geo="Dublin, Ireland",
    rules={"camera_glasses":"prohibited"},
    summary="Reported to prohibit recordable devices such as smart glasses in its gyms.",
    date="2026-10-27", status="in_force", source=IT, publisher="The Irish Times", via=None)
add(name="FlyeFit (22 gyms in Dublin, Cork and Galway)", kind="gym", scope="multi_site", country="IE", region=None, geo="Dublin, Ireland",
    rules={"camera_glasses":"prohibited"},
    summary="Reported to have banned Meta glasses in its gyms.",
    date="2026-10-27", status="in_force", source=IT, publisher="The Irish Times", via=None)
add(name="West Wood Club (6 Dublin clubs)", kind="gym", scope="multi_site", country="IE", region="Dublin", geo="Dublin, Ireland",
    rules={"camera_glasses":"restricted"},
    summary="Reported to prohibit the unauthorised use of wearable devices at its premises.",
    date="2026-10-27", status="in_force", source=IT, publisher="The Irish Times", via=None)

# ---------- Recording / photography at landmarks ----------
VM="https://www.museivaticani.va/content/museivaticani/en/organizza-visita/consigli-utili.html"
add(name="Sistine Chapel", kind="museum", scope="venue", country="VA", region=None, geo="Sistine Chapel, Vatican City",
    rules={"recording":"prohibited","drones":"prohibited"},
    summary="Forbidden to take photographs or films with any type of equipment; use of mobile phones is forbidden.",
    date=None, status="in_force", source=VM, publisher="Vatican Museums", via=None)
add(name="Vatican Museums (excluding Sistine Chapel)", kind="museum", scope="zones", country="VA", region=None, geo="Vatican Museums, Vatican City",
    rules={"recording":"restricted","drones":"prohibited"},
    zones=[{"zone":"Sistine Chapel","recording":"prohibited"},{"zone":"all other areas","recording":"allowed (personal use, no flash, no tripods/selfie sticks)"}],
    summary="Personal photography allowed except in the Sistine Chapel; flash, tripods, drones and professional equipment not allowed without authorisation.",
    date=None, status="in_force", source=VM, publisher="Vatican Museums", via=None)
add(name="Westminster Abbey", kind="place_of_worship", scope="zones", country="GB", region="London", geo="Westminster Abbey, London",
    rules={"recording":"restricted"},
    zones=[{"zone":"Shrine of St Edward the Confessor, St Faith's Chapel, Queen's Diamond Jubilee Galleries","recording":"prohibited"},{"zone":"during services and live performances","recording":"prohibited"},{"zone":"rest of church","recording":"allowed (personal photos; no video, flash, tripods, selfie sticks)"}],
    summary="Personal photography generally permitted; no video recording, flash or tripods; no photography during services or in specified chapels/galleries.",
    date=None, status="in_force", source="https://www.westminster-abbey.org/about/photography-in-the-abbey", publisher="Westminster Abbey", via=None)
add(name="Taj Mahal", kind="monument", scope="zones", country="IN", region="Uttar Pradesh", geo="Taj Mahal, Agra",
    rules={"drones":"prohibited","recording":"restricted"},
    zones=[{"zone":"main mausoleum","recording":"prohibited"},{"zone":"night viewing","recording":"video cameras prohibited; still cameras permitted"}],
    summary="Drone camera strictly prohibited inside and around the Taj Mahal; photography prohibited inside the main mausoleum.",
    date=None, status="in_force", source="https://www.tajmahal.gov.in/dos-and-donts.aspx", publisher="Taj Mahal (official site)", via=None)

# ---------- Drones ----------
add(name="Yosemite National Park", kind="park", scope="venue", country="US", region="California", geo="Yosemite National Park",
    rules={"drones":"prohibited"},
    summary="Launching, landing or operating unmanned aircraft is prohibited; the park will not issue drone permits.",
    date=None, status="in_force", source="https://www.nps.gov/yose/planyourvisit/safety.htm", publisher="U.S. National Park Service", via=None)
add(name="Yellowstone National Park", kind="park", scope="venue", country="US", region="Wyoming", geo="Yellowstone National Park",
    rules={"drones":"prohibited"},
    summary="Launching, landing or operating unmanned aircraft is prohibited except as approved in writing by the Superintendent.",
    date=None, status="in_force", source="https://www.nps.gov/yell/learn/management/lawsandpolicies.htm", publisher="U.S. National Park Service", via=None)
add(name="Zion National Park", kind="park", scope="venue", country="US", region="Utah", geo="Zion National Park",
    rules={"drones":"prohibited"},
    summary="Unmanned aircraft prohibited except as approved in writing by the Superintendent (Compendium signed Jan 5, 2026).",
    date="2026-01-05", status="in_force", source="https://www.nps.gov/zion/learn/management/superintendents-compendium.htm", publisher="U.S. National Park Service", via=None)
add(name="Grand Canyon National Park", kind="park", scope="venue", country="US", region="Arizona", geo="Grand Canyon Village, Arizona",
    rules={"drones":"prohibited"},
    summary="Does not allow recreational use of uncrewed aircraft by the public.",
    date=None, status="in_force", source="https://www.nps.gov/articles/uncrewed-aircraft-in-the-national-parks.htm", publisher="U.S. National Park Service", via=None)
add(name="Walt Disney World theme park airspace (FAA TFR FDC 4/3634)", kind="theme_park", scope="radius", country="US", region="Florida", geo=None,
    lat=28.4125, lng=-81.5722, radius_m=5556,
    rules={"drones":"prohibited"},
    summary="All aircraft operations including unmanned and remote-controlled aircraft prohibited within 3 NM, surface to 3,000 ft AGL (permanent security TFR, 14 CFR 99.7).",
    date="2015-10-08", status="in_force", source="https://tfr.faa.gov/tfr3/?page=detail_4_3634", publisher="Federal Aviation Administration", via=None)
add(name="Disneyland theme park airspace (FAA TFR FDC 4/3635)", kind="theme_park", scope="radius", country="US", region="California", geo=None,
    lat=33.8014, lng=-117.9214, radius_m=5556,
    rules={"drones":"prohibited"},
    summary="All aircraft operations including unmanned and remote-controlled aircraft prohibited within 3 NM, surface to 3,000 ft AGL (permanent security TFR, 14 CFR 99.7).",
    date="2015-10-08", status="in_force", source="https://tfr.faa.gov/tfr3/?page=detail_4_3635", publisher="Federal Aviation Administration", via=None)
RP="https://www.royalparks.org.uk/sites/default/files/2024-12/Drone%20Policy%202024.pdf"
add(name="Richmond Park 'Flying Field'", kind="park", scope="zones", country="GB", region="London", geo="Richmond Park, London",
    rules={"drones":"allowed"},
    zones=[{"zone":"Flying Field","drones":"allowed (recreational, under Park Regulations and CAA rules; no VR/FPV goggles)"}],
    summary="The one area of the Royal Parks identified as suitable for recreational drones; VR/FPV goggles not allowed.",
    date="2024-12", status="in_force", source=RP, publisher="The Royal Parks", via=None)
add(name="Central London Royal Parks (Hyde Park, Kensington Gardens, St James's Park, Green Park, Regent's Park and Primrose Hill)", kind="park", scope="multi_site", country="GB", region="London", geo="Hyde Park, London",
    rules={"drones":"restricted"},
    summary="Flying becomes prohibited where a notice says so or a constable asks you to stop; all central London parks are in restricted airspace requiring NATS approval; commercial filming needs written permission.",
    date="2024-12", status="in_force", source=RP, publisher="The Royal Parks", via=None)
add(name="Stonehenge", kind="monument", scope="venue", country="GB", region="Wiltshire", geo="Stonehenge, Wiltshire",
    rules={"drones":"prohibited"},
    summary="Drones and remote-controlled flying devices are not permitted at Stonehenge or the surrounding areas (solstice/equinox conditions of entry).",
    date="2026-12-22", status="in_force", source="https://www.english-heritage.org.uk/visit/places/stonehenge/things-to-do/solstice/winter-solstice-2026", publisher="English Heritage", via=None)
add(name="English Heritage sites", kind="heritage", scope="organization", country="GB", region="England", geo=None,
    rules={"drones":"restricted"},
    summary="Recreational users may not take off or land at English Heritage sites; professional flights need approval, usually outside opening hours.",
    date=None, status="in_force", source="https://www.english-heritage.org.uk/about/our-policies-and-reports/drone-guidance/", publisher="English Heritage", via=None)
add(name="National Trust land and properties", kind="heritage", scope="organization", country="GB", region=None, geo=None,
    rules={"drones":"prohibited"},
    summary="Does not permit unauthorised drone operation on its land or properties; byelaws prohibit unauthorised airborne vehicles over National Trust property.",
    date=None, status="in_force", source="https://www.nationaltrust.org.uk/who-we-are/about-us/flying-drones-at-our-places", publisher="National Trust", via=None)
add(name="Machu Picchu (Llaqta / Historic Sanctuary)", kind="monument", scope="venue", country="PE", region="Cusco", geo="Machu Picchu, Peru",
    rules={"drones":"prohibited"},
    summary="Drones, paragliders and any small aircraft are banned; no flyovers (Ministry of Culture rules, RM 216-2018-MC art. 19). Secondary source.",
    date="2026-11-05", status="in_force", source="https://cuscoperu.site/en/what-not-to-bring-to-machu-picchu/", publisher="cuscoperu.site (summarising Peru Ministry of Culture rules)", via=None)

# ---------- Robots (sidewalk delivery robots) ----------
DTW="https://deliverytechwatch.com/states/california"
add(name="Toronto sidewalks and cycle tracks", kind="jurisdiction", scope="jurisdiction", country="CA", region="Ontario", geo="Toronto, Ontario, Canada",
    rules={"robots":"prohibited"},
    summary="By-law 1075-2021 prohibits operating micro-utility devices (e.g. delivery robots) on sidewalks and cycle tracks.",
    date="2021-12-17", status="in_force", source="https://www.toronto.ca/legdocs/bylaws/2021/law1075.pdf", publisher="City of Toronto", via=None)
add(name="San Francisco public sidewalks", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo="San Francisco, California, USA",
    rules={"robots":"restricted"},
    summary="Ordinance 244-17 bars autonomous delivery devices from public rights-of-way except under a Public Works testing permit: sidewalks in PDR zones only, a human operator within 30 ft, at most nine devices citywide, permits up to 180 days.",
    date="2017-12-12", status="in_force", source="https://sfpublicworks.org/sites/default/files/Autonomous%20Delivery%20Devices%20Legislation.pdf", publisher="San Francisco Public Works", via=None)
add(name="Santa Monica sidewalks", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo="Santa Monica, California, USA",
    rules={"robots":"restricted"},
    summary="Autonomous and semi-autonomous delivery robots barred from city sidewalks and pedestrian paths; remotely controlled ones allowed under a business license (5 mph, 150 lb).",
    date="2021-05-11", status="in_force", source="https://www.santamonica.gov/programs/personal-delivery-devices", publisher="City of Santa Monica (Personal Delivery Devices program)", via=DTW)
add(name="Glendale (CA) public rights-of-way", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo="Glendale, California, USA",
    rules={"robots":"restricted"},
    summary="Ordinance No. 6056 bars delivery robots from public rights-of-way except under an operating agreement with the city.",
    date="2026-10-06", status="in_force", source="https://glendaleca.primegov.com/api/compilemeetingattachmenthistory/historyattachment/?historyId=cc2f6c9f-0eaa-4c02-93a5-2fb41544ac90", publisher="City of Glendale (council agenda: adoption of PDD pilot ordinance)", via=DTW)
add(name="West Hollywood", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo="West Hollywood, California, USA",
    rules={"robots":"restricted"},
    summary="Operators need an operating agreement setting speed, weight, hours, fleet size and no-go zones; $1,000 per device per violation without one (Ordinance 25-29).",
    date="2025-12-15", status="in_force", source="https://weho.granicusideas.com/meetings/1693-regular-city-council-meeting/agenda_items/6939ad52f395e79db90002c6-b-dot-7-adopt-ordinance-no-25-29-2nd-reading-an-o", publisher="City of West Hollywood (council agenda item: Ordinance 25-29, ch. 11.50)", via=DTW)
add(name="San José sidewalks", kind="jurisdiction", scope="jurisdiction", country="US", region="California", geo="San Jose, California, USA",
    rules={"robots":"restricted"},
    summary="Ordinance No. 31354 licenses delivery robots ($200/yr per sidewalk device, 5 mph on sidewalks, flags); effective 2026-11-20.",
    date="2026-11-20", status="in_force", source="https://legistar.granicus.com/sanjose/attachments/114eb060-f159-4f5f-831b-a16ea912af9a.pdf", publisher="City of San José (council agenda item 5.1: PDD regulation, new Municipal Code ch. 11.91)", via=DTW)
