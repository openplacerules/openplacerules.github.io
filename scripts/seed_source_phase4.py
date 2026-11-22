# Phase 4 seed entries (retrieved 2026-11-22). Official sources only.
# High-traffic tourist and camera-sensitive places. Every rule is taken from a
# source URL that was fetched and read; uncertain claims are omitted.
E = []
def add(**k): E.append(k)

# ---------------- United Kingdom ----------------
add(name="British Museum", kind="museum", scope="venue", country="GB", region="London",
    geo="British Museum, London",
    rules={"recording": "restricted"},
    zones=[{"zone": "most galleries", "recording": "allowed (handheld cameras including phones, with flash; private, non-commercial use)"},
           {"zone": "Study Rooms and areas indicated by notices", "recording": "restricted"},
           {"zone": "whole museum", "recording": "selfie sticks and similar devices not permitted; stands, special lighting, 3D imaging, and commercial or professional work need prior arrangement"}],
    summary="Handheld cameras (including phones) with flash, and audio or film recording that does not need a stand, are permitted except where notices say otherwise, for private non-commercial use only (including personal non-commercial social media). Additional restrictions may apply in areas such as Study Rooms. Selfie sticks and similar devices are not permitted; stands, special lighting, 3D imaging, and commercial or professional work must be arranged in advance.",
    date=None, status="in_force",
    source="https://www.britishmuseum.org/visit/visitor-guidelines-and-conditions-entry",
    publisher="British Museum", via=None)

add(name="National Gallery, London", kind="museum", scope="venue", country="GB", region="London",
    geo="National Gallery, Trafalgar Square, London",
    rules={"recording": "restricted"},
    summary="Photography and filming are allowed for personal, non-commercial purposes, including in exhibitions unless a label says otherwise. Additional lighting or flash, tripods and selfie sticks are not permitted. Some loan paintings may be restricted, as indicated by signs. Photography of children and young people is prohibited without the accompanying adult's consent.",
    date=None, status="in_force",
    source="https://www.nationalgallery.org.uk/visiting/visitor-photography",
    publisher="The National Gallery, London", via=None)

add(name="Tate galleries", kind="museum", scope="multi_site", country="GB", region=None,
    geo="Tate Modern, London",
    rules={"recording": "restricted"},
    summary="Photos may be taken in the gallery unless it is stated otherwise. Photography and video recording with a mobile device must be for personal, non-commercial use only. Flash, camera supports and selfie sticks are not permitted. Photoshoots and filming using professional equipment or for commercial purposes require prior permission.",
    date=None, status="in_force",
    source="https://www.tate.org.uk/visit/tate-gallery-rules",
    publisher="Tate", via=None)

add(name="Victoria and Albert Museum (V&A)", kind="museum", scope="venue", country="GB", region="London",
    geo="Victoria and Albert Museum, London",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Visitors may take photographs and film for personal use with hand-held cameras and phones, and may share the visit on social media for private, non-commercial use. Tripods, monopods, gimbals, selfie sticks, drones, flashes, reflectors and modelling lights are not permitted in the galleries. Commercial use, professional portraits and event shoots (including weddings and engagements) are not permitted in public museum spaces without going through the commercial team. Occasional exhibitions or areas may prohibit all photography.",
    date=None, status="in_force",
    source="https://www.vam.ac.uk/info/guidelines-for-using-the-galleries",
    publisher="Victoria and Albert Museum", via=None)

add(name="Natural History Museum, London", kind="museum", scope="venue", country="GB", region="London",
    geo="Natural History Museum, London",
    rules={"recording": "restricted"},
    summary="Photography, filming, scanning, drawing and audio recording are allowed for personal, non-commercial purposes. Some objects or exhibitions may be restricted, as indicated. Photography or filming of identifiable children, young people or adults at risk is prohibited without the accompanying adult's consent. Photography, filming or streaming of tours is not permitted. Additional lighting or flashes, gimbals, tripods, camera stands, monopods, easels or selfie sticks are not permitted without permission. Commercial work needs prior permission and in some cases a licence.",
    date="2026-08-07", status="in_force",
    source="https://www.nhm.ac.uk/about-us/visitor-admissions-policy.html",
    publisher="Natural History Museum", via=None)

add(name="St Paul's Cathedral", kind="place_of_worship", scope="zones", country="GB", region="London",
    geo="St Paul's Cathedral, London",
    rules={"recording": "restricted"},
    zones=[{"zone": "Cathedral Floor, Crypt, Stone Gallery and Golden Gallery (sightseeing hours, Monday to Saturday)", "recording": "allowed (non-flash stills for personal, non-commercial use)"},
           {"zone": "Whispering Gallery", "recording": "prohibited"},
           {"zone": "St Dunstan's Chapel", "recording": "prohibited"},
           {"zone": "during services", "recording": "prohibited"},
           {"zone": "whole cathedral", "recording": "no visitor videography or moving images; no flash, additional lighting, tripods, monopods, gimbals or selfie sticks"}],
    summary="Non-flash stills photography for personal, non-commercial use is welcomed on the Cathedral Floor, in the Crypt and on the Stone and Golden Galleries during sightseeing hours (Monday to Saturday). Photography is not permitted on the Whispering Gallery, in St Dunstan's Chapel, or during services. Visitor videography and recording of moving images are not allowed. Flash, additional lighting, tripods, monopods, gimbals and selfie sticks are not to be used. Temporary no-photography areas may be signed.",
    date=None, status="in_force",
    source="https://www.stpauls.co.uk/filming-and-photography",
    publisher="St Paul's Cathedral", via=None)

add(name="Buckingham Palace", kind="monument", scope="zones", country="GB", region="London",
    geo="Buckingham Palace, London",
    rules={"recording": "prohibited", "drones": "prohibited"},
    zones=[{"zone": "inside the Palace, and on a guided garden highlights tour", "recording": "prohibited"},
           {"zone": "other outdoor areas of a visit (non-commercial)", "recording": "allowed"}],
    summary="Strictly no photography or filming is permitted inside Buckingham Palace, and photography is also not permitted on a guided garden highlights tour. Outside those areas, photography and filming for non-commercial purposes are encouraged. Drones may not be brought into Buckingham Palace and Gardens. Commercial filming needs an application.",
    date=None, status="in_force",
    source="https://www.rct.uk/visit/buckingham-palace/practical-information-for-visiting-buckingham-palace",
    publisher="Royal Collection Trust", via=None)

add(name="Historic Environment Scotland sites", kind="heritage", scope="organization", country="GB", region="Scotland",
    geo=None,
    rules={"recording": "restricted", "drones": "restricted"},
    summary="Photography and videography for personal use are welcome at Historic Environment Scotland sites, with some exceptions (ask staff). Recreational drone (UAS) operations from an area under HES care need prior consent; applications should be made at least five working days ahead, with CAA certification, public liability insurance and a site-specific risk assessment.",
    date=None, status="in_force",
    source="https://www.historicenvironment.scot/visit/visitor-faqs/",
    publisher="Historic Environment Scotland",
    via="https://www.historicenvironment.scot/about-us/our-work/filming-and-photography/using-drones-at-historic-scotland-sites/")

add(name="Edinburgh Castle", kind="monument", scope="venue", country="GB", region="Edinburgh",
    geo="Edinburgh Castle",
    rules={"recording": "restricted", "drones": "restricted"},
    summary="As a Historic Environment Scotland site, photography and videography for personal use are welcome, with some exceptions (ask staff). Recreational drone operations from HES land need prior written consent (apply at least five working days ahead, with CAA certification, insurance and a site-specific risk assessment).",
    date=None, status="in_force",
    source="https://www.historicenvironment.scot/visit/visitor-faqs/",
    publisher="Historic Environment Scotland",
    via="https://www.historicenvironment.scot/about-us/our-work/filming-and-photography/using-drones-at-historic-scotland-sites/")

add(name="Royal Opera House, Covent Garden", kind="venue", scope="venue", country="GB", region="London",
    geo="Royal Opera House, Covent Garden, London",
    rules={"recording": "prohibited"},
    summary="The use of mobile phones, electronic devices, and all photography, filming and sound recording is not allowed during the performance.",
    date=None, status="in_force",
    source="https://www.rbo.org.uk/visit/attending-a-performance",
    publisher="Royal Opera House", via=None)

# ---------------- France ----------------
add(name="Palace of Versailles", kind="monument", scope="zones", country="FR", region="Île-de-France",
    geo="Château de Versailles",
    rules={"recording": "restricted", "drones": "prohibited"},
    zones=[{"zone": "permanent exhibition spaces inside the Versailles and Trianon Museum", "recording": "allowed (private purposes; no flash, tripods or selfie sticks)"},
           {"zone": "Estate (Gardens, Park, Marie-Antoinette's Estate)", "drones": "prohibited (except professional drones with prefecture declaration, the establishment's agreement, and professional insurance)"}],
    summary="Works in the permanent exhibition spaces may be photographed or filmed for private purposes only; professional, collective or commercial uses need the prior written permission of the President of the Establishment. Flash photography, tripods and selfie sticks are not permitted inside. In the Estate (Gardens, Park and Marie-Antoinette's Estate), floating or aerial models and remote-controlled aircraft, including drones, are not allowed; only professional drones may be used, subject to a prefecture declaration, the establishment's agreement, and professional insurance.",
    date=None, status="in_force",
    source="https://en.chateauversailles.fr/rules-visit",
    publisher="Château de Versailles", via=None)

add(name="Centre Pompidou", kind="museum", scope="venue", country="FR", region="Paris",
    geo="Centre Pompidou, Paris",
    rules={"recording": "restricted"},
    summary="Photography, filming and sound recording in the museum, exhibition and performance spaces are forbidden except with written authorisation of the President or authorised staff; a tolerance is granted for amateurs, in line with the French Ministry of Culture's heritage photography charter. Visitors are asked not to photograph staff. Camera tripods, flashes and selfie poles (perches) must not be brought in without express authorisation.",
    date=None, status="in_force",
    source="https://mediation.centrepompidou.fr/informations_pratiques/reglement_visite.pdf",
    publisher="Centre Pompidou", via=None)

add(name="Paris Opera (Palais Garnier and Opéra Bastille)", kind="venue", scope="multi_site", country="FR", region="Paris",
    geo="Palais Garnier, Paris",
    rules={"recording": "prohibited"},
    summary="For individuals, photography, filming and sound recording are not allowed during performances (Paris Opera visitor regulations, Article 21).",
    date=None, status="in_force",
    source="https://www.operadeparis.fr/en/terms-of-use/paris-opera-visitor-regulations",
    publisher="Opéra national de Paris", via=None)

# ---------------- Spain ----------------
add(name="Museo Nacional del Prado", kind="museum", scope="venue", country="ES", region="Madrid",
    geo="Museo Nacional del Prado, Madrid",
    rules={"recording": "prohibited"},
    summary="Photography or filming in the galleries is not permitted.",
    date=None, status="in_force",
    source="https://www.museodelprado.es/en/visit/regulations",
    publisher="Museo Nacional del Prado", via=None)

add(name="Basílica de la Sagrada Família", kind="place_of_worship", scope="venue", country="ES", region="Barcelona",
    geo="Sagrada Família, Barcelona",
    rules={"recording": "restricted"},
    summary="Tripods may not be used for video or photos on the grounds, except by people or companies with prior Press Department accreditation. Photos or video recordings may not be made for commercial, advertising or dissemination purposes without the Foundation's prior written authorisation. Bags, rucksacks, luggage and professional photography and video equipment are checked at the entrance.",
    date=None, status="in_force",
    source="https://sagradafamilia.org/en/rules-and-regulations",
    publisher="Basílica de la Sagrada Família", via=None)

add(name="Alhambra and Generalife", kind="monument", scope="venue", country="ES", region="Granada",
    geo="Alhambra, Granada",
    rules={"recording": "restricted"},
    summary="Photography is permitted without flash and without tripods, monopods or any other camera stabilizing equipment.",
    date=None, status="in_force",
    source="https://www.alhambra-patronato.es/en/visit/organize-your-visit/time-of-the-visit",
    publisher="Patronato de la Alhambra y Generalife", via=None)

add(name="Park Güell", kind="park", scope="venue", country="ES", region="Barcelona",
    geo="Park Güell, Barcelona",
    rules={"recording": "restricted"},
    summary="Photographs or films for professional or commercial purposes need express authorisation from the organisation.",
    date=None, status="in_force",
    source="https://parkguell.barcelona/en/planning-your-visit/access-regulations",
    publisher="Park Güell (Barcelona)", via=None)

add(name="Museo Reina Sofía", kind="museum", scope="venue", country="ES", region="Madrid",
    geo="Museo Reina Sofía, Madrid",
    rules={"recording": "restricted"},
    summary="Photographs may be taken without a flash, tripod, selfie stick or any other type of camera stand in all of the Museo's sites, unless stated otherwise. Filming for informational and/or commercial purposes needs prior authorisation from the Press Department.",
    date=None, status="in_force",
    source="https://museoreinasofia.es/en/visit/",
    publisher="Museo Reina Sofía", via=None)

add(name="Guggenheim Museum Bilbao", kind="museum", scope="venue", country="ES", region="Biscay",
    geo="Guggenheim Museum Bilbao",
    rules={"recording": "restricted"},
    summary="Photographs without flash are permitted for private use only. Exceptions are signposted and/or indicated by staff. Tripods and selfie sticks are prohibited inside the museum galleries.",
    date=None, status="in_force",
    source="https://www.guggenheim-bilbao.eus/en/useful-information/tips",
    publisher="Guggenheim Museum Bilbao", via=None)

add(name="Patrimonio Nacional palaces and royal sites", kind="heritage", scope="organization", country="ES", region=None,
    geo="Royal Palace of Madrid",
    rules={"recording": "restricted"},
    summary="Personal photographs without flash are permitted, except in places where photography is expressly disabled. Tripods, selfie sticks or similar devices are not allowed. The privacy of visitors and staff must be respected. This is the FAQ rule for Patrimonio Nacional sites, including the Royal Palace of Madrid.",
    date=None, status="in_force",
    source="https://tickets.patrimonionacional.es/es/preguntas-frecuentes",
    publisher="Patrimonio Nacional", via=None)

# ---------------- Italy and Greece ----------------
add(name="Uffizi Galleries", kind="museum", scope="venue", country="IT", region="Tuscany",
    geo="Galleria degli Uffizi, Firenze, Italy",
    rules={"recording": "restricted"},
    summary="Photographs for personal or study purposes are allowed (Legislative Decree 83/2014), except for works on loan for temporary exhibitions, and provided flash, stands or tripods are not used. Flash photography, selfie sticks, light stands, tripods or any kind of professional equipment are forbidden. Other purposes (publication or commercial use) need specific authorisation and may incur a fee.",
    date=None, status="in_force",
    source="https://www.uffizi.it/en/pages/rules-to-visit-the-uffizi-galleries",
    publisher="Uffizi Galleries", via=None)

add(name="Pompeii Archaeological Park", kind="monument", scope="venue", country="IT", region="Campania",
    geo="Pompeii Archaeological Park",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Without explicit written authorisation, photographs or videos are authorised only for personal use or for study (and for non-profit enhancement by public or private bodies), under the Cultural Heritage Code. Professional or commercial photography or video, and professional optical and audio equipment (tripods, cameras, microphones, audio mixers, etc.), need formal authorisation from the Park. Drones (RPAS) may not be used without the Park's authorisation.",
    date=None, status="in_force",
    source="https://pompeiisites.org/en/visiting-info/regulations-for-visitors/",
    publisher="Parco Archeologico di Pompei",
    via="https://pompeiisites.org/en/faq-en/can-i-use-drones/")

add(name="Teatro alla Scala", kind="venue", scope="venue", country="IT", region="Lombardy",
    geo="Teatro alla Scala, Milan",
    rules={"recording": "prohibited"},
    summary="The use of mobile phones, cameras with or without flash, and audio or video recording devices is not permitted in the auditorium.",
    date=None, status="in_force",
    source="https://www.teatroallascala.org/en/visit/information/during-the-performance.html",
    publisher="Teatro alla Scala", via=None)

add(name="Acropolis Museum", kind="museum", scope="zones", country="GR", region="Attica",
    geo="Acropolis Museum, Athens",
    rules={"recording": "restricted"},
    zones=[{"zone": "Archaic Acropolis Gallery (first floor)", "recording": "prohibited"},
           {"zone": "all other areas", "recording": "allowed (amateur photography and filming for personal use; no flash or professional lights or tripod)"}],
    summary="Amateur photography and filming for personal use is permitted in all areas except the Archaic Acropolis Gallery on the first floor, without flash and without additional professional equipment (lights, tripod). Publication of photographs in print or digital form is not allowed.",
    date=None, status="in_force",
    source="https://www.theacropolismuseum.gr/en/photographyfilming",
    publisher="Acropolis Museum", via=None)

# ---------------- Austria and Germany ----------------
add(name="Schönbrunn Palace", kind="monument", scope="venue", country="AT", region="Vienna",
    geo="Schönbrunn Palace, Vienna",
    rules={"recording": "restricted"},
    summary="The use of tripods, selfie sticks or similar photographic or video equipment is prohibited, as is the use of flash and similar lighting. Photos or videos may only be used for personal, non-commercial purposes. Photography and filming for other purposes requires a paid permit.",
    date=None, status="in_force",
    source="https://www.schoenbrunn.at/fileadmin/content_schoenbrunn/Downloads/Schoss_Schoenbrunn_Hausordnung_ENG_Smejkal.pdf",
    publisher="Schloß Schönbrunn Kultur- und Betriebsges.m.b.H.",
    via="https://www.schoenbrunn.at/behutsamer-umgang-mit-kulturerbe")

add(name="Kunsthistorisches Museum Vienna", kind="museum", scope="venue", country="AT", region="Vienna",
    geo="Kunsthistorisches Museum, Vienna",
    rules={"recording": "restricted"},
    summary="Photography and filming are only permitted for private, non-commercial purposes. Flash and tripods are not permitted. Signs may ban photography of particular works of art.",
    date=None, status="in_force",
    source="https://www.khm.at/en/visit",
    publisher="KHM Museumsverband", via=None)

add(name="Belvedere", kind="museum", scope="multi_site", country="AT", region="Vienna",
    geo="Belvedere Palace, Vienna",
    rules={"recording": "restricted"},
    summary="Photographing and filming in the museum is allowed for private, non-commercial purposes, without flash, tripods or selfie sticks, as long as the integrity of the exhibits is guaranteed. Rooms, exhibitions or individual exhibits marked with a photography ban are excluded. Academic or reporting permits can be requested from the communications department.",
    date=None, status="in_force",
    source="https://www.belvedere.at/en/house-rules",
    publisher="Belvedere Museum Vienna", via=None)

add(name="Staatliche Museen zu Berlin", kind="museum", scope="organization", country="DE", region="Berlin",
    geo="Museum Island, Berlin",
    rules={"recording": "restricted"},
    summary="Written permission of the museum management board is required to show film footage and photographs taken in the museums for commercial purposes of any kind. The board also has the right to impose a general ban on photography in exhibitions and exhibition rooms.",
    date=None, status="in_force",
    source="https://www.smb.museum/en/plan-your-visit/museum-regulations/",
    publisher="Staatliche Museen zu Berlin", via=None)

# ---------------- United States ----------------
add(name="J. Paul Getty Museum (Getty Center and Getty Villa)", kind="museum", scope="multi_site", country="US", region="California",
    geo="Getty Center, Los Angeles",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Photos and videos for personal use are welcome at the Getty Center and Getty Villa with handheld cameras, video cameras and camera phones in public outdoor spaces and permanent collection galleries: personal use only (may not be sold); natural light only, no flash or other supplemental light; no professional shoots (including wedding, engagement and modeling). Selfie sticks are welcome outdoors only, not inside. Tripods, monopods, handheld microphones, lighting, props and other external equipment are not permitted. Some works and changing exhibitions may be restricted, as signed. Drones are not permitted at either site.",
    date=None, status="in_force",
    source="https://www.getty.edu/visit/photo-and-video-policy/",
    publisher="J. Paul Getty Trust", via=None)

add(name="San Francisco Museum of Modern Art (SFMOMA)", kind="museum", scope="venue", country="US", region="California",
    geo="SFMOMA, San Francisco",
    rules={"recording": "restricted"},
    summary="Photography and videography are allowed for personal, noncommercial use except where indicated. No flashes, tripods or selfie sticks. Photography may be restricted in certain exhibitions.",
    date=None, status="in_force",
    source="https://www.sfmoma.org/visit/visitor-guidelines/guidelines-for-visiting-sfmoma/",
    publisher="San Francisco Museum of Modern Art", via=None)

add(name="Museum of Fine Arts, Boston", kind="museum", scope="venue", country="US", region="Massachusetts",
    geo="Museum of Fine Arts, Boston",
    rules={"recording": "restricted"},
    summary="Still photography and video taken from a handheld device of objects in the permanent collection are permitted for personal, non-distributional, non-commercial use. Visitors should refrain from photography of loans and temporary exhibitions. Flashes, tripods, or video cameras in the galleries are prohibited. Photographs or videotapes may not be reproduced, published or otherwise distributed.",
    date=None, status="in_force",
    source="https://www.mfa.org/collections/mfa-images/web-use-and-gallery-photography",
    publisher="Museum of Fine Arts, Boston", via=None)

add(name="Whitney Museum of American Art", kind="museum", scope="venue", country="US", region="New York",
    geo="Whitney Museum of American Art, New York",
    rules={"recording": "restricted"},
    summary="Unless otherwise noted, photography in the galleries is allowed for personal, non-commercial purposes only. The use of flash, tripods and selfie sticks is prohibited. Selfie sticks, tripods, monopods and any professional video equipment are also listed among prohibited items.",
    date=None, status="in_force",
    source="https://whitney.org/visit/policies",
    publisher="Whitney Museum of American Art", via=None)

add(name="Los Angeles County Museum of Art (LACMA)", kind="museum", scope="venue", country="US", region="California",
    geo="Los Angeles County Museum of Art",
    rules={"recording": "restricted"},
    summary="Visitors are welcome to take personal photography in the galleries unless otherwise noted.",
    date=None, status="in_force",
    source="https://www.lacma.org/faq",
    publisher="Los Angeles County Museum of Art", via=None)

add(name="The Broad", kind="museum", scope="venue", country="US", region="California",
    geo="The Broad, Los Angeles",
    rules={"recording": "restricted"},
    summary="Photographs and smartphone video are welcome for personal use only, unless signage indicates that no photography is allowed.",
    date=None, status="in_force",
    source="https://www.thebroad.org/visit/know-you-go-faq",
    publisher="The Broad", via=None)

add(name="National September 11 Memorial & Museum", kind="museum", scope="zones", country="US", region="New York",
    geo="National September 11 Memorial & Museum, New York",
    rules={"recording": "restricted"},
    zones=[{"zone": "Memorial plaza", "recording": "allowed (personal photography)"},
           {"zone": "Memorial Museum", "recording": "allowed (private, noncommercial use, unless otherwise posted; no flash)"},
           {"zone": "security screening areas and other restricted areas", "recording": "prohibited"}],
    summary="Personal photography is permitted at the 9/11 Memorial. In the Museum, photography is permitted for private, noncommercial use in all locations unless otherwise posted; the use of a flash is prohibited in all Memorial Museum areas at all times. Professional photography (including commercial purposes and professional equipment) is not permitted unless authorised. Cameras and audio recording devices may not be used in security screening areas, other restricted areas, or internal offices. Tripods and professional camera or audio equipment are not permitted (authorised professional equipment is at Security Staff discretion).",
    date=None, status="in_force",
    source="https://www.911memorial.org/visit/about/visitor-guidelines",
    publisher="National September 11 Memorial & Museum", via=None)

add(name="Statue of Liberty National Monument and Ellis Island", kind="monument", scope="venue", country="US", region="New York",
    geo="Statue of Liberty, New York",
    rules={"drones": "prohibited", "recording": "restricted"},
    summary="Launching, landing or operating an unmanned aircraft system (UAS) from or on lands and waters administered by the National Park Service within the boundaries of Statue of Liberty National Monument and Ellis Island is prohibited except as approved in writing by the superintendent. Photography or recording in security screening areas is prohibited if it interferes with or slows down the security screening process.",
    date=None, status="in_force",
    source="https://www.nps.gov/stli/learn/management/superintendents-compendium.htm",
    publisher="U.S. National Park Service", via=None)

add(name="United States Capitol Grounds", kind="government", scope="venue", country="US", region="District of Columbia",
    geo="United States Capitol, Washington, D.C.",
    rules={"drones": "prohibited"},
    summary="Drones and unmanned aircraft systems (UAS) are prohibited at the U.S. Capitol Visitor Center and on U.S. Capitol Grounds (listed as a No Drone Zone).",
    date=None, status="in_force",
    source="https://www.visitthecapitol.gov/visit/know-before-you-go/prohibited-items",
    publisher="U.S. Capitol Visitor Center",
    via="https://www.uscp.gov/visiting-capitol-hill/regulations-prohibitions")

# ---------------- Canada, Australia, New Zealand, South Africa ----------------
add(name="Royal Ontario Museum", kind="museum", scope="venue", country="CA", region="Ontario",
    geo="Royal Ontario Museum, Toronto",
    rules={"recording": "restricted"},
    summary="Photography with flash and video recording are allowed in most permanent galleries for personal use only, with hand-held equipment. Selfie sticks, tripods, monopods and similar supports are not permitted. Some exhibitions have posted restrictions.",
    date=None, status="in_force",
    source="https://www.rom.on.ca/visit/visitor-information",
    publisher="Royal Ontario Museum", via=None)

add(name="National Gallery of Victoria", kind="museum", scope="venue", country="AU", region="Victoria",
    geo="National Gallery of Victoria, Melbourne",
    rules={"recording": "restricted"},
    summary="Visitors are permitted to take photographs with hand-held cameras in non-restricted areas for personal use.",
    date=None, status="in_force",
    source="https://www.ngv.vic.gov.au/about/reports-and-documents/19357-2/",
    publisher="National Gallery of Victoria", via=None)

add(name="Australian War Memorial", kind="museum", scope="venue", country="AU", region="Australian Capital Territory",
    geo="Australian War Memorial, Canberra",
    rules={"recording": "restricted"},
    summary="Still photography and handheld video cameras are permitted. Patrons must obey all signs and notices and any reasonable direction given by Memorial staff or security officers.",
    date=None, status="in_force",
    source="https://www.awm.gov.au/visit/conditions",
    publisher="Australian War Memorial", via=None)

add(name="Museum of New Zealand Te Papa Tongarewa", kind="museum", scope="venue", country="NZ", region="Wellington",
    geo="Te Papa, Wellington",
    rules={"recording": "restricted"},
    summary="You can photograph and film for personal use, unless the signs say otherwise.",
    date=None, status="in_force",
    source="https://www.guide.tepapa.govt.nz/info/services/",
    publisher="Museum of New Zealand Te Papa Tongarewa", via=None)

add(name="Robben Island Museum", kind="museum", scope="venue", country="ZA", region="Western Cape",
    geo="Robben Island, Cape Town",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Cameras are allowed for personal use only; drones and tripods are not allowed. Commercial photography should be arranged with the museum.",
    date=None, status="in_force",
    source="https://www.robben-island.org.za/frequently-asked-questions/",
    publisher="Robben Island Museum", via=None)

# ---------------- East Asia ----------------
add(name="Tokyo National Museum", kind="museum", scope="zones", country="JP", region="Tokyo",
    geo="Tokyo National Museum",
    rules={"recording": "restricted"},
    zones=[{"zone": "second floor of the Heiseikan", "recording": "prohibited"},
           {"zone": "objects marked with a no-photography sign", "recording": "prohibited"},
           {"zone": "other exhibition rooms", "recording": "restricted (permits treated at the Museum's discretion; no flashlights, additional lighting, tripods, monopods or selfie sticks)"}],
    summary="Photography is not allowed on the second floor of the Heiseikan, or of any objects indicated by a no-photography sign. In other exhibition rooms the Museum reserves the right to treat permits. Flashlights, additional lighting, tripods, monopods and selfie sticks are not allowed.",
    date=None, status="in_force",
    source="https://www.tnm.jp/modules/r_free_page/?id=127&lang=en",
    publisher="Tokyo National Museum", via=None)

add(name="Kiyomizu-dera", kind="place_of_worship", scope="venue", country="JP", region="Kyoto",
    geo="Kiyomizu-dera, Kyoto",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Photo shoots using drones, monopods or tripods are prohibited. Wedding, cosplay or fashion photo sessions using models are also forbidden. Commercial recording on the temple grounds, including photos or videos with the temple structures in the background, needs permission.",
    date=None, status="in_force",
    source="https://www.kiyomizudera.or.jp/en/faq/",
    publisher="Kiyomizu-dera Temple", via=None)

add(name="Meiji Jingu", kind="place_of_worship", scope="zones", country="JP", region="Tokyo",
    geo="Meiji Jingu, Tokyo",
    rules={"recording": "restricted", "drones": "prohibited"},
    zones=[{"zone": "main sanctuary, where people make prayers", "recording": "prohibited"},
           {"zone": "other shrine grounds", "recording": "restricted (no videos or promotional photography without permission)"}],
    summary="Do not take photos or videos at the main sanctuary, where people make prayers. Do not take videos or promotional photography without permission. Do not fly drones.",
    date=None, status="in_force",
    source="https://www.meijijingu.or.jp/en/etiquette/",
    publisher="Meiji Jingu", via=None)

add(name="Hiroshima Peace Memorial Museum", kind="museum", scope="venue", country="JP", region="Hiroshima",
    geo="Hiroshima Peace Memorial Museum",
    rules={"recording": "restricted"},
    summary="Video and photography without flash are allowed for personal purposes (no application required). Tripods and selfie sticks are not allowed in the museum. Photography with flash and/or for publication requires an application in advance.",
    date=None, status="in_force",
    source="https://hpmmuseum.jp/modules/info/index.php?action=PageView&lang=eng&page_id=47",
    publisher="Hiroshima Peace Memorial Museum", via=None)

add(name="The Palace Museum (Forbidden City)", kind="monument", scope="venue", country="CN", region="Beijing",
    geo="Forbidden City, Beijing",
    rules={"recording": "restricted"},
    summary="Flash photography and camera tripods are not allowed in exhibition halls. Do not take photos in exhibition spaces or gift shops where photography is explicitly prohibited, and follow staff instructions.",
    date=None, status="in_force",
    source="https://young.dpm.org.cn/en/node/277",
    publisher="The Palace Museum", via=None)

# ---------------- Middle East and Southeast Asia ----------------
add(name="Sheikh Zayed Grand Mosque", kind="place_of_worship", scope="zones", country="AE", region="Abu Dhabi",
    geo="Sheikh Zayed Grand Mosque, Abu Dhabi",
    rules={"recording": "restricted"},
    zones=[{"zone": "allocated / designated photo stops", "recording": "allowed (photographs and videos for personal use)"},
           {"zone": "elsewhere in the mosque", "recording": "restricted (visitors shall adhere to taking photographs only at the designated photo stops)"}],
    summary="Photographs and videos are allowed for personal use. Visitors shall adhere to taking photographs only at the designated photo stops. Professional filmmakers and media establishments must obtain the Centre's prior permission via the Filming Permit form.",
    date=None, status="in_force",
    source="https://szgmc.gov.ae/en/worshippers/en-to-faqs",
    publisher="Sheikh Zayed Grand Mosque Centre",
    via="https://szgmc.gov.ae/en/worshippers/en-to-mosque-manners")

add(name="Museum of Islamic Art, Doha", kind="museum", scope="venue", country="QA", region="Doha",
    geo="Museum of Islamic Art, Doha",
    rules={"recording": "restricted"},
    summary="Unless otherwise noted, photography of special exhibitions, loaned artworks or artworks in the permanent collection is allowed for personal, non-commercial use using available light. Tripods, selfie sticks and flash photography are not permitted. Press and filming requests are handled separately in advance.",
    date=None, status="in_force",
    source="https://mia.org.qa/en/visit/visitor-guidelines/",
    publisher="Museum of Islamic Art", via=None)

add(name="National Gallery Singapore", kind="museum", scope="venue", country="SG", region=None,
    geo="National Gallery Singapore",
    rules={"recording": "restricted"},
    zones=[{"zone": "galleries generally", "recording": "allowed (still photography, no flash, non-commercial; no videography, selfie sticks or tripods)"},
           {"zone": "special exhibition galleries, levels 3 and 4 of the City Hall Wing", "recording": "restricted"}],
    summary="Still photography (no flash) for non-commercial use is allowed. No flash photography or videography is permitted in the galleries. Selfie sticks and tripods are not allowed. Photography may be restricted in the special exhibition galleries on levels 3 and 4 of the City Hall Wing.",
    date=None, status="in_force",
    source="https://www.nationalgallery.sg/sg/en/visit/visitor-information.html",
    publisher="National Gallery Singapore", via=None)

add(name="Gardens by the Bay", kind="park", scope="venue", country="SG", region=None,
    geo="Gardens by the Bay, Singapore",
    rules={"recording": "restricted", "drones": "prohibited"},
    zones=[{"zone": "Floral Fantasy", "recording": "restricted (tripods and camera stands not permitted)"},
           {"zone": "whole gardens on weekends and public holidays", "recording": "restricted (tripods not allowed)"},
           {"zone": "Bay Central, Bay East and Bay South gardens", "drones": "prohibited"}],
    summary="Tripods are not allowed in the Gardens on weekends and public holidays, and tripods and camera stands are not permitted in Floral Fantasy. Prior approval is required for commercial filming and photography (apply at least 14 days in advance). Remote-controlled aerial cameras (including drones), planes, helicopters and similar devices are not allowed at Bay Central, Bay East and Bay South gardens.",
    date=None, status="in_force",
    source="https://www.gardensbythebay.com.sg/en/plan-your-visit/visiting-guidelines.html",
    publisher="Gardens by the Bay", via=None)

add(name="M+ Museum, Hong Kong", kind="museum", scope="venue", country="HK", region="Hong Kong",
    geo="M+ Museum, Hong Kong",
    rules={"recording": "restricted"},
    summary="Photography and filming for personal and non-commercial use are welcomed; flash should be turned off. Video recording is only permitted when specified — check gallery signs or ask staff before taking a video. Professional photography or videography for commercial purposes is handled separately.",
    date=None, status="in_force",
    source="https://www.mplus.org.hk/en/frequently-asked-questions/",
    publisher="M+", via=None)

# ---------------- Memorials and Mexico ----------------
add(name="Auschwitz-Birkenau State Museum", kind="museum", scope="zones", country="PL", region="Małopolskie",
    geo="Auschwitz-Birkenau State Museum, Oświęcim",
    rules={"recording": "restricted", "drones": "prohibited"},
    zones=[{"zone": "Block No. 4, Room No. 5, and the basement of Block No. 11", "recording": "prohibited"},
           {"zone": "inside buildings", "recording": "restricted (no flash equipment or tripods)"},
           {"zone": "visitor screening checkpoints, visitor service points, luggage inspection areas, and other security-system elements", "recording": "prohibited"},
           {"zone": "above the Museum and in its direct surroundings (EP P20)", "drones": "prohibited"}],
    summary="Filming and photographing inside buildings using flash equipment or tripods is not allowed. Filming and photography are strictly prohibited in Block No. 4, Room No. 5, and in the basement of Block No. 11, and at visitor screening checkpoints, visitor service points, luggage inspection areas and other security-system elements. There is an EP P20 non-fly zone above the Museum and in its direct surroundings; bringing in or operating drones without the permission described in the regulations is prohibited.",
    date=None, status="in_force",
    source="https://www.auschwitz.org/gfx/auschwitz/userfiles/_public/visit/65_en.pdf",
    publisher="Auschwitz-Birkenau State Museum",
    via="https://www.auschwitz.org/en/press/filming-and-photographing/")

add(name="Museo Frida Kahlo (Casa Azul)", kind="museum", scope="venue", country="MX", region="Mexico City",
    geo="Museo Frida Kahlo, Mexico City",
    rules={"recording": "restricted"},
    summary="The ticket includes taking photographs, using mobile devices without flash, of the artworks and spaces of the Museum, solely for personal use; any other purpose needs authorisation from Banco de México Fideicomiso Museos Diego Rivera y Frida Kahlo. Do not record videos anywhere in the Museum (indoors and outdoors). Photos may be taken in the outdoor patio (as stated on the visit page).",
    date=None, status="in_force",
    source="https://www.museofridakahlo.org.mx/visit/?lang=en",
    publisher="Museo Frida Kahlo", via=None)

add(name="INAH archaeological zones and museums", kind="heritage", scope="organization", country="MX", region=None,
    geo=None,
    rules={"recording": "restricted"},
    summary="The National Institute of Anthropology and History states there is no ban on entering with mobile phones, tablets or non-professional cameras, or on taking images for personal use with those devices, subject to the restrictions each site has established. Videography with those devices for commercial purposes is subject to a fee. Individual sites may have tighter rules.",
    date=None, status="in_force",
    source="https://www.inah.gob.mx/boletines/falso-que-el-inah-prohiba-el-uso-de-dispositivos-moviles-en-zonas-arqueologicas-y-museos",
    publisher="Instituto Nacional de Antropología e Historia (INAH)", via=None)
