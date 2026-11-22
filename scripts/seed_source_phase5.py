# Phase 5 seed entries (retrieved 2026-11-22). Official sources only.
# Places previously skipped because the live official page was bot-walled were
# retried via official PDFs, government tourism/heritage pages, or a Wayback
# Machine snapshot of the official URL. Every rule is taken from a source URL
# that was fetched and read; uncertain claims are omitted.
E = []
def add(**k): E.append(k)

# ---------------- United States ----------------
add(name="The Metropolitan Museum of Art", kind="museum", scope="venue", country="US", region="New York",
    geo="The Metropolitan Museum of Art, New York",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Non-flash photography and video recording for private, non-commercial use are allowed, unless otherwise noted, with hand-held cameras and personal cellular devices without flash. Filming of guided tours is at the discretion of the individual guide. Unauthorized or staged photoshoots, photography of works or galleries designated as no-photography, and use of flash are not allowed. Selfie sticks, tripods, monopods, drones and professional video equipment are not allowed unless previously arranged and approved by the Communications Department. Photographs and video captured at The Met cannot be published, sold, reproduced, transferred, distributed or commercially exploited.",
    date=None, status="in_force",
    source="https://www.metmuseum.org/policies/photo-and-video-policy",
    publisher="The Metropolitan Museum of Art",
    via="https://web.archive.org/web/20260718094959/https://www.metmuseum.org/policies/photo-and-video-policy")

add(name="Museum of Modern Art (MoMA)", kind="museum", scope="venue", country="US", region="New York",
    geo="Museum of Modern Art, 11 West 53rd Street, New York",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="MoMA's official visiting FAQ states that still photography and video are permitted for personal, non-commercial use only unless otherwise noted, and that flash, tripods and camera extension poles are not allowed (https://www.moma.org/visit/tips, archived at https://web.archive.org/web/20260731235400/https://www.moma.org/visit/tips). The visitor guidelines also prohibit selfie sticks, tripods, monopods and any professional video equipment, and prohibit drones, unmanned aerial devices, survey balloons, photography mini-copters and any flying device.",
    date=None, status="in_force",
    source="https://www.moma.org/visit/visitor-guidelines-and-policies",
    publisher="The Museum of Modern Art",
    via="https://web.archive.org/web/20260801052122/https://www.moma.org/visit/visitor-guidelines-and-policies")

add(name="Smithsonian Institution museums and gardens", kind="museum", scope="organization", country="US", region=None,
    geo=None,
    rules={"recording": "restricted"},
    summary="The Smithsonian permits still and video photography for noncommercial use only in its museums and exhibitions, unless otherwise posted. Tripods, monopods, selfie sticks or similar devices are prohibited in Smithsonian museums and gardens. Working members of the media who need to use a tripod or monopod must obtain permission from the museum's Public Affairs Office and must be escorted by a museum staff member.",
    date=None, status="in_force",
    source="https://www.si.edu/visit/guidelines",
    publisher="Smithsonian Institution",
    via="https://web.archive.org/web/20260703232434/https://www.si.edu/visit/guidelines")

add(name="National Gallery of Art, Washington", kind="museum", scope="venue", country="US", region="Washington, DC",
    geo="National Gallery of Art, Washington, DC",
    rules={"recording": "restricted"},
    summary="Personal photography is allowed unless signage specifically prohibits it. Monopods, tripods and selfie sticks may not be used inside the National Gallery buildings. These rules are stated on the Gallery's official visitor map.",
    date=None, status="in_force",
    source="https://www.nga.gov/sites/default/files/2025-06/nga-map-french.pdf",
    publisher="National Gallery of Art", via=None)

add(name="Art Institute of Chicago", kind="museum", scope="venue", country="US", region="Chicago",
    geo="Art Institute of Chicago, Chicago",
    rules={"recording": "restricted"},
    summary="Photography of the collection and special exhibitions is encouraged for personal, nondistributional, noncommercial use. Non-flash photography is permitted in all permanent galleries; signs indicate the few works that may not be photographed because of a lender requirement. Equipment must not exceed the size of an SLR camera designed for personal use. Flash, tripods, monopods, handheld microphones, selfie sticks and other extraneous equipment are not allowed anywhere in the museum, its gardens or public spaces.",
    date=None, status="in_force",
    source="https://www.artic.edu/visit/visitor-policies",
    publisher="Art Institute of Chicago",
    via="https://web.archive.org/web/20260807202530/https://www.artic.edu/visit/visitor-policies")

add(name="Columbus Museum of Art", kind="museum", scope="venue", country="US", region="Columbus, Ohio",
    geo="Columbus Museum of Art, Columbus, Ohio",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Photography for personal use is encouraged. Flash, tripods, monopods and selfie sticks should not be used. Photography equipment requires prior approval. Drones and radio-controlled devices may not be brought in. The museum's 2026 photography and videography guidelines, linked from the official visit page, add that photography and video are for personal use only, with no flash in the galleries (flash may be allowed only in certain areas such as the Atrium, Edwards Court, Broad Street Lobby and Sculpture Garden) and that photos or videos of the museum's artwork, buildings, staff or volunteers may not be used for advertising, promotion or commercial purposes without written permission.",
    date=None, status="in_force",
    source="https://www.columbusmuseum.org/plan-your-visit",
    publisher="Columbus Museum of Art",
    via="https://assets.speakcdn.com/assets/3048/photography_and_videography_guidelines_2026.pdf")

add(name="National Archives Museum", kind="museum", scope="venue", country="US", region="Washington, DC",
    geo="National Archives Museum, Washington, DC",
    rules={"recording": "restricted"},
    summary="Non-flash photography, filming and videotaping for personal use are encouraged in all public areas of the National Archives unless otherwise posted. Flash, other supplemental lighting, selfie sticks, monopods or similar equipment are not permitted. News and commercial use is covered by a separate photography policy.",
    date=None, status="in_force",
    source="https://visit.archives.gov/visit/tips-guidelines",
    publisher="US National Archives and Records Administration", via=None)

# ---------------- United Kingdom ----------------
add(name="Tower of London", kind="monument", scope="zones", country="GB", region="London",
    geo="Tower of London, London",
    rules={"recording": "restricted"},
    zones=[{"zone": "Jewel House", "recording": "prohibited"},
           {"zone": "Chapel of St. John (in the White Tower)", "recording": "prohibited"},
           {"zone": "most other areas of the site (non-commercial)", "recording": "allowed"}],
    summary="Visitors are welcome to take photographs within most areas of the Tower of London. Photography is not allowed in the Jewel House or the Chapel of St. John in the White Tower, and photography of certain individual items may be restricted because of loan arrangements. Commercial and media photography, filming and sketching should be requested in advance from the Media and PR Team. Tripods, monopods, selfie sticks (interiors) and gimbals may not be used unless arrangements have been made in advance. Wedding photography is exclusive to couples hiring the Tower for their wedding day.",
    date=None, status="in_force",
    source="https://www.hrp.org.uk/tower-of-london/visit/facilities/",
    publisher="Historic Royal Palaces",
    via="https://web.archive.org/web/20251026220446/https://www.hrp.org.uk/tower-of-london/visit/facilities/")

# ---------------- France ----------------
add(name="Cathédrale Notre-Dame de Paris", kind="place_of_worship", scope="zones", country="FR", region="Paris",
    geo="Cathédrale Notre-Dame de Paris, Paris",
    rules={"recording": "restricted"},
    zones=[{"zone": "confessionals and the people in them", "recording": "prohibited"},
           {"zone": "nave, outside liturgical celebrations, for private personal use", "recording": "restricted"}],
    summary="Individual photography for private use is tolerated in the nave, outside liturgical celebrations, if it remains discreet and silent, without flash, tripod, boom, stabilizer or any other unauthorized capture device, and does not disturb visitors or prayer. Posed, staged, lascivious, spectacular or promotional photography is forbidden. Professional, institutional, journalistic or commercial recording needs prior written authorization from the cathedral's communications department, requested at least ten working days ahead. Photographing or filming the confessionals, and the people there, is strictly forbidden, even incidentally. Photographing any identifiable person, especially someone praying or taking part in the liturgy, without their consent is strictly forbidden.",
    date="2026-06-30", status="in_force",
    source="https://cellar-c2.services.clever-cloud.com/s3.notredamedeparis.fr/uploads/2026/07/20260630_NDP_Reglement-interieur-des-espaces-ERP-VF.pdf",
    publisher="Cathédrale Notre-Dame de Paris", via=None)

# ---------------- Italy (one official visitor regulation covers four sites) ----------------
_COL_SRC = "https://colosseo.it/sito/wp-content/uploads/2026/10/Regolamento-Visitatori-Parco-archeologico-del-Colosseo-approvato-dal-CDA-aggiornato-al-8-ottobre-2026.pdf"
_COL_SUM = "The official visitor regulation of the Parco archeologico del Colosseo (approved 1 April 2026, updated 8 October 2026) applies to the Colosseum, the Roman Forum, the Palatine and the Domus Aurea. Selfie sticks and visors of any type may not be brought in. Professional optical and audio equipment (tripods, cameras, microphones, audio mixers, etc.) and drones may not be used without formal authorization from the park's director."
_COL_RULES = {"recording": "restricted", "drones": "prohibited"}
for _name, _geo in [
    ("Colosseum (Parco archeologico del Colosseo)", "Colosseum, Rome, Italy"),
    ("Roman Forum (Parco archeologico del Colosseo)", "Roman Forum, Rome, Italy"),
    ("Palatine Hill (Parco archeologico del Colosseo)", "Palatine Hill, Rome, Italy"),
    ("Domus Aurea (Parco archeologico del Colosseo)", "Domus Aurea, Rome, Italy"),
]:
    add(name=_name, kind="heritage", scope="venue", country="IT", region="Rome",
        geo=_geo, rules=_COL_RULES, summary=_COL_SUM, date="2026-10-08", status="in_force",
        source=_COL_SRC, publisher="Parco archeologico del Colosseo", via=None)

# ---------------- Switzerland ----------------
add(name="Château de Chillon", kind="heritage", scope="venue", country="CH", region="Veytaux",
    geo="Château de Chillon, Veytaux, Switzerland",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Visitor photography without flash is authorized in the permanent collection rooms, for private use only; flash and other lighting devices are strictly prohibited. Professional photography, filming (including with drones) and radio or television recordings must be authorized in advance by castle management, in writing at least two months ahead. The use of drones is strictly prohibited on the Chillon Castle Foundation site, in order to preserve the monument, keep visitors safe and protect flora and fauna; unmanned aircraft are also prohibited within the nearby Grangettes Nature Reserve. In exceptional circumstances permission may be granted by the Foundation, subject to strict conditions, if requested in writing at least two months ahead.",
    date="2025-12-15", status="in_force",
    source="https://www.chillon.ch/wp-content/uploads/2026/01/reglement-tournages-prises-de-vues-drones-en.pdf",
    publisher="Chillon Castle Foundation", via=None)

# ---------------- Republic of Korea (one official visiting regulation covers the palace sites) ----------------
_KR_SRC = "https://royal.khs.go.kr/ROYAL/contents/R704000000.do"
_KR_PUB = "궁능유적본부 (Korea Heritage Service, Royal Palaces and Tombs Office)"
_KR_SUM = "Official visiting rules of the Royal Palaces and Tombs Office. Visitor commemorative photography is treated as already permitted. Photography using special costumes or props (character costumes, mascot heads, airsuits and similar non-everyday dress) needs a formal permit. The site director may restrict photography in particular areas to prevent crowding. Commercial filming (film, drama, advertising, entertainment, some TV) and other non-souvenir photography need a permit. Aerial photography with drones is permitted only for a public institution filming for a public-interest purpose, or in other cases the Office recognizes, and then only after the required aviation photography permission under Ministry of National Defense and related rules."
_KR_RULES = {"recording": "restricted", "drones": "prohibited"}
for _name, _geo, _extra in [
    ("Gyeongbokgung", "Gyeongbokgung, Seoul, South Korea", None),
    ("Changdeokgung", "Changdeokgung, Seoul, South Korea", None),
    ("Changgyeonggung", "Changgyeonggung, Seoul, South Korea", None),
    ("Deoksugung", "Deoksugung, Seoul, South Korea", None),
    ("Jongmyo Shrine", "Jongmyo, Seoul, South Korea", " Because of the special nature of the site, photography at Jongmyo may be further restricted."),
]:
    add(name=_name, kind="heritage", scope="venue", country="KR", region="Seoul",
        geo=_geo, rules=_KR_RULES, summary=_KR_SUM + (_extra or ""),
        date=None, status="in_force", source=_KR_SRC, publisher=_KR_PUB, via=None)

add(name="Joseon royal tombs", kind="heritage", scope="organization", country="KR", region=None,
    geo=None,
    rules={"recording": "restricted", "drones": "prohibited"},
    summary=_KR_SUM + " Because of the special nature of the sites, photography at the Joseon royal tombs (and at Chilgung) may be further restricted.",
    date=None, status="in_force", source=_KR_SRC, publisher=_KR_PUB, via=None)
