# Phase 6 seed entries (retrieved 2026-11-23). Official sources only.
# Includes previously skipped bot-walled places retried via official PDFs or
# Wayback snapshots of the official URL, plus further high-demand places.
# Every rule is taken from a source URL that was fetched and read.
E = []
def add(**k): E.append(k)

# ---------------- Previously skipped (retried) ----------------
add(name="Musée d'Orsay", kind="museum", scope="venue", country="FR", region="Paris",
    geo="Musée d'Orsay, Paris",
    rules={"recording": "restricted"},
    summary="Photography and video recordings for strictly private purposes are permitted in the museum provided they do not compromise the integrity of the works, impede visitor movement or disturb others. Flash, lamps and other lighting devices, and all types of stands, tripods and telescopic arms, are forbidden. Photographs and video for commercial, professional or any purpose other than the visitor's private use are strictly forbidden unless specifically authorised. Photography or filming may be prohibited for certain works or, in temporary exhibitions, entirely, as signalled at the entrance or next to the work. Official visiting rules, Resolution No. 2021-003, Item 7, Articles 60-65.",
    date=None, status="in_force",
    source="https://www.musee-orsay.fr/sites/default/files/2025-12/2brochure%20Re%CC%80glement%20visite%20O-O%202021%20AN_0.pdf",
    publisher="Musée d'Orsay (Public Establishment of the Musée d'Orsay and the Musée de l'Orangerie)", via=None)

add(name="Eiffel Tower", kind="monument", scope="venue", country="FR", region="Paris",
    geo="Eiffel Tower, Paris",
    rules={"recording": "restricted"},
    summary="Professional photography, film shoots, and the recording of radio and television programmes are subject to special rules and must be requested from SETE in writing in advance; written authorisation must be presented on any inspection at the monument (visitor regulations, Article 36). Any professional audio or visual recording in which staff or members of the public may appear also requires the consent of the people concerned (Article 35). These articles are from the official SETE visitor regulations PDF (French), as archived by the Wayback Machine on 7 February 2026. A later May 2026 edition was bot-walled and could not be re-read for this entry, so later clauses are not recorded here.",
    date=None, status="in_force",
    source="https://www.toureiffel.paris/modules/custom/sete_base/assets/reglement_visite_tour_eiffel_fr.pdf",
    publisher="Société d’Exploitation de la Tour Eiffel (SETE)",
    via="https://web.archive.org/web/20260207103621/https://www.toureiffel.paris/modules/custom/sete_base/assets/reglement_visite_tour_eiffel_fr.pdf")

add(name="Louvre Abu Dhabi", kind="museum", scope="venue", country="AE", region="Abu Dhabi",
    geo="Louvre Abu Dhabi",
    rules={"recording": "restricted"},
    summary="The museum's official Photography & Filming Guidelines (archived 20 April 2025) welcome visitors to photograph and film, with these limits: only hand-held cameras may be used in the museum; flash is not allowed inside the galleries; large equipment, tripods or selfie sticks are not permitted in the museum (selfie sticks are only permitted outside the galleries and under the dome); filming and photoshoots of commercial products and special occasions such as weddings, anniversaries and graduations are strictly prohibited, even with a hand-held camera. Media and commercial work needs prior press-team approval and a permit.",
    date=None, status="in_force",
    source="https://www.louvreabudhabi.ae/en/about-us/pressroom/photography-guidelines",
    publisher="Louvre Abu Dhabi",
    via="https://web.archive.org/web/20250420035900/https://www.louvreabudhabi.ae/en/about-us/pressroom/photography-guidelines")

add(name="National Gallery of Australia", kind="museum", scope="venue", country="AU", region="Canberra",
    geo="National Gallery of Australia, Canberra",
    rules={"recording": "restricted"},
    summary="The Gallery's official visitor map (October 2025) states that photography for personal use is welcomed, and that photography for commercial use, use of flash, selfie-sticks and tripods is not permitted. The map points to the Gallery's conditions of entry for the full conditions.",
    date=None, status="in_force",
    source="https://nga.gov.au/media/dd/documents/NGA5551_GalleryMap_Oct_25_FA.pdf",
    publisher="National Gallery of Australia", via=None)

add(name="South African National Parks (SANParks)", kind="park", scope="organization", country="ZA", region=None,
    geo=None,
    rules={"drones": "prohibited"},
    summary="SANParks' official rules and regulations state: 'The use of drones inside (and over) national parks is strictly prohibited.' The page cites the National Environmental Management Act and the National Environmental Management: Protected Areas Act for a stay in a national park. Read from the official rules page as archived by the Wayback Machine on 13 November 2025.",
    date=None, status="in_force",
    source="https://www.sanparks.org/travel/plan/useful-information/rules-regulations",
    publisher="South African National Parks (SANParks)",
    via="https://web.archive.org/web/20251113053229/https://www.sanparks.org/travel/plan/useful-information/rules-regulations")

add(name="Kruger National Park", kind="park", scope="venue", country="ZA", region="Mpumalanga / Limpopo",
    geo="Kruger National Park, South Africa",
    rules={"drones": "prohibited"},
    summary="Kruger National Park is a SANParks national park. SANParks' official rules and regulations state that the use of drones inside (and over) national parks is strictly prohibited.",
    date=None, status="in_force",
    source="https://www.sanparks.org/travel/plan/useful-information/rules-regulations",
    publisher="South African National Parks (SANParks)",
    via="https://web.archive.org/web/20251113053229/https://www.sanparks.org/travel/plan/useful-information/rules-regulations")

add(name="National Palace Museum (Taipei)", kind="museum", scope="venue", country="TW", region="Taipei",
    geo="National Palace Museum, Taipei",
    rules={"recording": "restricted"},
    summary="Exhibition Visitor Information for the National Palace Museum (approved 22 December 2012; rule 5 amended 2 December 2016): in the exhibition, visitors may take pictures and record videos, but may not use a flashlight, assistant exposure light, tripod or selfie stick. A stop sign indicates relics that may not be photographed. Visitors must not block escape routes or other visitors when taking photos. Commercial use or other special needs requires an application. This museum-wide visitor information is published on the official Southern Branch site (the Taipei official notices page was bot-walled).",
    date=None, status="in_force",
    source="https://south.npm.gov.tw/english/VisitEn/VisitInforEn.htm",
    publisher="National Palace Museum", via=None)

add(name="Southern Branch of the National Palace Museum", kind="museum", scope="venue", country="TW", region="Chiayi",
    geo="Southern Branch of the National Palace Museum, Taibao, Chiayi",
    rules={"recording": "restricted"},
    summary="The same official Exhibition Visitor Information for the National Palace Museum applies: visitors may take pictures and record videos in the exhibition, but may not use a flashlight, assistant exposure light, tripod or selfie stick; some relics are marked no-photography; commercial or special-purpose photography requires an application.",
    date=None, status="in_force",
    source="https://south.npm.gov.tw/english/VisitEn/VisitInforEn.htm",
    publisher="National Palace Museum (Southern Branch)", via=None)

add(name="Galleria Borghese", kind="museum", scope="venue", country="IT", region="Rome",
    geo="Galleria Borghese, Rome",
    rules={"recording": "restricted"},
    summary="The museum's official Photos and Video page states that reproduction and distribution of photographs and videos is free (no authorisation needed) when it is not for commercial gain, either direct or indirect; the photos and videos are made without tripods and/or stands, without flashes or other light sources, and without physical contact with the artworks; and distribution does not lead to further reproduction for commercial purposes, including indirect ones (Legislative Decree 83/2014, Art. 12(3), converted into Law 106/2014). All other photographic or video reproduction needs authorisation from the Ufficio Iconografico, free of charge or against a royalty as provided by law. The Italian text adds that the Directorate may prohibit recording, in whole or in part, in particular circumstances and during temporary exhibitions when works from other collections are present.",
    date=None, status="in_force",
    source="https://galleriaborghese.cultura.gov.it/en/info/foto-e-video/",
    publisher="Galleria Borghese", via=None)

# ---------------- Smart-glasses house rules ----------------
add(name="Norwegian Museum of Science and Technology (Norsk Teknisk Museum)", kind="museum", scope="venue", country="NO", region="Oslo",
    geo="Norsk Teknisk Museum, Oslo",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="The museum's official photography and filming guidelines state that photography and filming without extra lighting equipment is permitted and free of charge for private use unless otherwise indicated, and that commercial or published work needs prior permission and a fee. Use of smart glasses is not permitted in the museum. An exception applies for use as an assistive device in case of disability, but not for filming or photographing visitors or staff. The English opening-hours page likewise states that the use of metaglasses and other smart glasses is not permitted, with the same assistive-device exception. A museum press release of 26 August 2026 announced the smart-glasses ban, citing privacy and the many child visitors.",
    date="2026-08-26", status="in_force",
    source="https://www.tekniskmuseum.no/images/Dokumenter/fotografering-og-filming-teknisk-museum-26.pdf",
    publisher="Norsk Teknisk Museum",
    via="https://www.tekniskmuseum.no/en/opening-hours")

add(name="Harvard Art Museums", kind="museum", scope="venue", country="US", region="Massachusetts",
    geo="Harvard Art Museums, Cambridge, Massachusetts",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="The museums' official General Policies state that visitors are welcome to photograph and record video in galleries and public spaces for personal use only, with small handheld cameras, tablets and cell phones. Use of flash, tripods, monopods, camera extension poles (selfie sticks), and smart-glasses is not permitted. Publication or distribution of personal photography and video for commercial use is prohibited. Staged personal or professional photography or video shoots, including portraits, are not accommodated. Broadcast, public dissemination or commercial work on Harvard University property needs advance permission.",
    date=None, status="in_force",
    source="https://harvardartmuseums.org/visit/policies/general-policies",
    publisher="Harvard Art Museums", via=None)

_GRONINGEN_SUM = (
    "On 9 October 2026 this organisation signed the official joint statement of the Groningen cultural sector, "
    "which states that glasses equipped with cameras and AI have no place in their buildings or at their events, "
    "because the technology threatens the privacy and safety of visitors, staff and artists. The signatories say they "
    "are including a ban on smart glasses in their house rules. Devices used for accessibility or medical purposes are "
    "not included in the statement."
)
_GRONINGEN_SRC = "https://www.spotgroningen.nl/stories/statement-van-de-cultuursector-in-groningen/"
_GRONINGEN_PUB = "SPOT Groningen (joint statement of the Groningen cultural sector)"

add(name="Groningen cultural sector (smart glasses house-rule ban)", kind="venue", scope="organization", country="NL", region="Groningen",
    geo="Groningen, Netherlands",
    rules={"camera_glasses": "prohibited"},
    summary="A joint official statement dated 9 October 2026, signed by more than 30 Groningen cultural organisations, says glasses with a camera and AI have no place in their buildings or at their events, and that the signatories are including a ban on smart glasses in their house rules. Aids used for supportive or medical purposes are not included. Signatories listed on the SPOT Groningen publication include, among others, Club Guy & Roni, De Noorderlingen, Domies Toen, EM2, Eurosonic Noorderslag, Festival Hongerige Wolf, Forum Groningen, Grand Theatre Groningen, Groninger Archieven, Groninger Museum, Het Houten Huis, Jonge Harten Festival, Kamermuziek Festival Groningen, Museum aan de A, Museum Klooster Ter Apel, Museum Wierdenland, NITE, Noorderlicht, Noorderzon, Noordstaat, NOORDWOORD, NP3, SIGN, Simplon, SPOT Groningen, Stichting Landgoed Fraeylemaborg, Stichting Oude Groninger Kerken, Theater de Steeg, Tumult, Vera and Zummerbühne.",
    date="2026-10-09", effective_from="2026-10-09", status="in_force",
    source=_GRONINGEN_SRC, publisher=_GRONINGEN_PUB, via=None)

for _name, _kind, _geo, _src, _pub in [
    ("Club Guy & Roni", "venue", "Club Guy & Roni, Groningen", None, None),
    ("De Noorderlingen", "venue", "De Noorderlingen, Groningen", None, None),
    ("Domies Toen", "museum", "Domies Toen, Groningen", None, None),
    ("EM2 Groningen", "venue", "EM2, Groningen", None, None),
    ("Eurosonic Noorderslag (ESNS)", "event", "Eurosonic Noorderslag, Groningen",
     "https://esns.nl/en/esns/news/statement-from-the-cultural-sector-in-groningen/", "Eurosonic Noorderslag (ESNS)"),
    ("Festival Hongerige Wolf", "event", "Festival Hongerige Wolf, Groningen", None, None),
    ("Forum Groningen", "venue", "Forum Groningen", None, None),
    ("Grand Theatre Groningen", "venue", "Grand Theatre Groningen", None, None),
    ("Groninger Archieven", "venue", "Groninger Archieven, Groningen", None, None),
    ("Groninger Museum", "museum", "Groninger Museum, Groningen", None, None),
    ("Het Houten Huis", "venue", "Het Houten Huis, Groningen", None, None),
    ("Jonge Harten Festival", "event", "Jonge Harten Festival, Groningen", None, None),
    ("Kamermuziek Festival Groningen", "event", "Kamermuziek Festival Groningen", None, None),
    ("Museum aan de A", "museum", "Museum aan de A, Groningen", None, None),
    ("Museum Klooster Ter Apel", "museum", "Museum Klooster Ter Apel", None, None),
    ("Museum Wierdenland", "museum", "Museum Wierdenland, Ezinge", None, None),
    ("NITE Groningen", "venue", "NITE, Groningen", None, None),
    ("Noorderlicht", "museum", "Noorderlicht, Groningen",
     "https://noorderlicht.com/en/updates/statement-van-de-cultuursector-in-groningen", "Noorderlicht"),
    ("Noorderzon Festival of Performing Arts & Society", "event", "Noorderzon, Groningen", None, None),
    ("Noordstaat", "venue", "Noordstaat, Groningen", None, None),
    ("NP3", "museum", "NP3, Groningen", None, None),
    ("SIGN Groningen", "museum", "SIGN, Groningen", None, None),
    ("Simplon", "venue", "Simplon, Groningen", None, None),
    ("SPOT Groningen", "venue", "SPOT Groningen",
     "https://www.spotgroningen.nl/stories/statement-van-de-cultuursector-in-groningen/", "SPOT Groningen"),
    ("Landgoed Fraeylemaborg", "heritage", "Fraeylemaborg, Slochteren", None, None),
    ("Stichting Oude Groninger Kerken", "place_of_worship", "Oude Groninger Kerken, Groningen", None, None),
    ("Theater de Steeg", "venue", "Theater de Steeg, Groningen", None, None),
    ("Tumult Groningen", "venue", "Tumult, Groningen", None, None),
    ("Vera Groningen", "venue", "Vera, Groningen", None, None),
    ("Zummerbühne", "venue", "Zummerbühne, Groningen", None, None),
]:
    add(name=_name, kind=_kind, scope="venue" if _kind != "event" else "venue", country="NL", region="Groningen",
        geo=_geo, rules={"camera_glasses": "prohibited"}, summary=_GRONINGEN_SUM,
        date="2026-10-09", effective_from="2026-10-09", status="in_force",
        source=_src or _GRONINGEN_SRC, publisher=_pub or _GRONINGEN_PUB, via=None)

add(name="Musis & Stadstheater Arnhem", kind="venue", scope="venue", country="NL", region="Gelderland",
    geo="Musis & Stadstheater, Arnhem",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="The theatres' official house rules state that hidden recording equipment, including camera glasses (such as Meta glasses), is not permitted, and that it is forbidden to make image or sound recordings of visitors and staff without permission. Without permission, visitors may not take photos or make video or sound recordings; during performances and concerts, equipment for recording image or sound may not be taken into the auditorium without permission, and phones should be silenced with no photos or recordings. This is the theatres' own house-rule wording; it is not a verbatim copy of the Autoriteit Persoonsgegevens 19 November 2026 standard text.",
    date=None, status="in_force",
    source="https://www.musisenstadstheater.nl/nl/jouw-bezoek/huisregels",
    publisher="Musis & Stadstheater Arnhem", via=None)

add(name="TivoliVredenburg", kind="venue", scope="venue", country="NL", region="Utrecht",
    geo="TivoliVredenburg, Utrecht",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="The venue's official house rules state that hidden recording equipment, including camera glasses, is not permitted, and that it is forbidden to make recordings of visitors and staff without permission. Professional photo, video and audio recording equipment may not be brought in without permission; consumer cameras are permitted. Professional equipment is defined as devices with interchangeable lenses and SLR cameras. Photos, videos or audio recorded in TivoliVredenburg may not be sold to third parties without prior permission. This is the venue's own house-rule wording, published before the Autoriteit Persoonsgegevens 19 November 2026 standard text, and is not a verbatim copy of that text.",
    date=None, status="in_force",
    source="https://www.tivolivredenburg.nl/huisregels/",
    publisher="TivoliVredenburg", via=None)

# ---------------- Further official high-demand places ----------------
add(name="Ghibli Museum, Mitaka", kind="museum", scope="venue", country="JP", region="Tokyo",
    geo="Ghibli Museum, Mitaka, Tokyo",
    rules={"recording": "prohibited"},
    summary="The museum's official English visitor information ('Visitor Policies') states: please don't take photos or videos inside the Museum. Mobile phones should be turned off inside the Museum.",
    date=None, status="in_force",
    source="https://www.ghibli-museum.jp/en/info/",
    publisher="Ghibli Museum, Mitaka", via=None)

add(name="Prague Castle", kind="monument", scope="venue", country="CZ", region="Prague",
    geo="Prague Castle, Prague",
    rules={"drones": "prohibited"},
    summary="The official Prague Castle visitor page states that Prague Castle and its surroundings are part of a no-flight zone, and asks visitors not to use flying devices known as drones in that area.",
    date=None, status="in_force",
    source="https://www.hrad.cz/en/prague-castle-for-visitors",
    publisher="Prague Castle", via=None)
