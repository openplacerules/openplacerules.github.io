"""Official place-rule entries for phase 8. Each source URL was fetched and reviewed."""
E = []

def add(**kw):
    E.append(kw)

# --- Hospitals (camera glasses / recording) ---

add(name="The Dudley Group NHS Foundation Trust",
    kind="hospital", scope="multi_site", country="GB", region="West Midlands",
    geo="Russells Hall Hospital, Dudley, United Kingdom",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="The Trust asks that smart glasses and other wearable devices capable of recording audio, video or images are not worn or used within NHS buildings and clinical areas, because they can discreetly capture recordings that may include confidential patient information. Patients and visitors who need to wear such devices for accessibility or medical reasons are encouraged to speak to a member of staff. Photography, filming or recording for commercial, media, influencer or publication purposes requires prior permission from the Communications Team. Unauthorised recordings may lead to exclusion and referral to security or the police.",
    status="in_force",
    source="https://www.dgft.nhs.uk/patients-and-visitors/photography-filming-and-audio-recording-on-nhs-trust-premises/",
    publisher="The Dudley Group NHS Foundation Trust")

add(name="Sandwell and West Birmingham NHS Trust",
    kind="hospital", scope="multi_site", country="GB", region="West Midlands",
    geo="Sandwell General Hospital, West Bromwich, United Kingdom",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="The Trust asks that smart glasses and other wearable devices capable of recording audio, video or images are not worn or used within NHS buildings and clinical areas, because they can discreetly capture recordings that may include confidential patient information. Patients and visitors who need to wear such devices for accessibility or medical reasons are encouraged to speak to a member of staff. Photography, filming or recording for commercial, media, influencer or publication purposes requires prior permission from the Communications Team. Unauthorised recordings may lead to exclusion and referral to security or the police.",
    status="in_force",
    source="https://www.swbh.nhs.uk/patients-visitors/photography-filming-and-audio-recording-on-nhs-trust-premises/",
    publisher="Sandwell and West Birmingham NHS Trust")

add(name="Nottingham University Hospitals NHS Trust",
    kind="hospital", scope="multi_site", country="GB", region="Nottinghamshire",
    geo="Queen's Medical Centre, Nottingham, United Kingdom",
    rules={"camera_glasses": "restricted", "recording": "restricted"},
    summary="Before taking photographs, filming or making recordings, visitors should speak to a member of staff, and consent must be obtained from anyone who may appear, including staff. The use of wearable recording devices, such as smart glasses, is subject to the same privacy and consent requirements as mobile phones and cameras. Recordings must not be shared online if they include identifiable people who have not consented or confidential information. The Trust may restrict or stop photography, filming or recording where it may affect patient privacy, confidentiality, safety or the delivery of care.",
    status="in_force",
    source="https://www.nuh.nhs.uk/visitors/",
    publisher="Nottingham University Hospitals NHS Trust")

add(name="Memorial Sloan Kettering Cancer Center",
    kind="hospital", scope="multi_site", country="US", region="New York",
    geo="Memorial Sloan Kettering Cancer Center, 1275 York Avenue, New York, USA",
    rules={"camera_glasses": "restricted", "recording": "restricted"},
    summary="MSK's visitor Code of Conduct, updated 20 April 2026 and applying at all MSK locations, does not allow taking photos or recording video or sound in any location where other patients or visitors may be captured. This includes phones, tablets, smart glasses, and other devices that can record.",
    date="2026-04-20", status="in_force",
    source="https://www.mskcc.org/locations/planning-visit-travel-to-msk/policy-visitors-patients",
    publisher="Memorial Sloan Kettering Cancer Center")

add(name="Community Memorial hospitals",
    kind="hospital", scope="multi_site", country="US", region="California",
    geo="Community Memorial Hospital, Ventura, California, USA",
    rules={"camera_glasses": "restricted", "recording": "restricted"},
    summary="Community Memorial policy prohibits photography and audio or video recording in patient care areas without staff approval and permission from everyone being photographed or recorded. Visitors are asked to keep recording devices, including smart glasses and recording pens, turned off and put away, and to keep recording features on phones and other devices off. If a staff member asks a visitor to stop recording or remove a recording device, they must do so immediately.",
    status="in_force",
    source="https://www.mycmh.org/patients-visitors/hospital-patients/visitor-information/",
    publisher="Community Memorial")

add(name="Larkin Health",
    kind="hospital", scope="multi_site", country="US", region="Florida",
    geo="Larkin Community Hospital, South Miami, Florida, USA",
    rules={"camera_glasses": "restricted", "recording": "restricted"},
    zones=[
        {"zone": "Behavioral Health Unit", "camera_glasses": "prohibited", "recording": "prohibited"},
    ],
    summary="Photography, audio recording and video recording are prohibited without prior authorization, including on cell phones, smart watches, smart glasses, tablets, cameras and other recording devices. On the Behavioral Health Unit, no recording devices (including cell phones, smart watches, smart glasses, tablets and cameras) are permitted, and personal items such as phones must be left outside the unit.",
    status="in_force",
    source="https://larkinhealth.com/en/patients-visitors/visiting-hours/guidelines-for-visitors/",
    publisher="Larkin Health")

# --- Universities ---

add(name="School of Visual Arts",
    kind="university", scope="venue", country="US", region="New York",
    geo="School of Visual Arts, 209 East 23rd Street, New York, USA",
    rules={"camera_glasses": "prohibited", "ai_capture": "prohibited"},
    summary="SVA's Personal Wearable Technology & AI-Enabled Devices policy, effective 1 August 2026 and last updated 17 September 2026, prohibits employees, faculty, staff, contractors, student workers and others performing services for SVA from wearing or using AI-enabled glasses, smart glasses, or similar wearable devices capable of recording audio, video, or capturing biometric or environmental data while performing job duties, participating in meetings, in classrooms, or in settings involving interactions with students, colleagues, or the public. Where a device cannot reliably disable these functions, it may not be worn in covered settings. Visitors must comply with campus rules and instructions concerning recording-capable wearable devices. Assistive or medical devices that are not designed to record or capture such data are excluded.",
    date="2026-09-17", effective_from="2026-08-01", status="in_force",
    source="https://policy.sva.edu/policy/personal-wearable-technology-and-ai-enabled-devices",
    publisher="School of Visual Arts")

add(name="Colorado Community College System",
    kind="university", scope="multi_site", country="US", region="Colorado",
    geo="9101 East Lowry Boulevard, Denver, Colorado, USA",
    rules={"camera_glasses": "restricted", "recording": "restricted", "ai_capture": "restricted"},
    summary="System Procedure SP 19-50a, revised 11 February 2026, applies to employees, students, volunteers, guests and visitors at CCCS and its colleges. Unless an exception applies, including approved accommodations, the System prohibits overt or covert recording of any individual on a System campus, or engaged in CCCS business, without prior approval from an authorized official. The use of devices that may obscure whether recording is occurring, such as AI-enabled glasses or wearable devices, is treated as covert recording if individuals cannot reasonably discern or are not notified when recording is taking place. Classroom recording is permitted only with the prior consent of the faculty member, except for approved accommodations. Video recording and photographing of buildings, individuals and events in areas open to the public is permitted if it does not interfere with official business or endanger safety.",
    date="2026-02-11", status="in_force",
    source="https://cccs.edu/about/governance/policies-procedures/sp-19-50a-use-of-recording-devices/",
    publisher="Colorado Community College System")

add(name="Yeshiva University",
    kind="university", scope="multi_site", country="US", region="New York",
    geo="Yeshiva University, Amsterdam Avenue, New York, USA",
    rules={"camera_glasses": "restricted", "recording": "restricted", "ai_capture": "restricted"},
    zones=[
        {"zone": "Patient care areas", "recording": "prohibited"},
    ],
    summary="The University Recording Policy (January 2026) strictly prohibits audio, video, image or digital recording of conversations, meetings, events or activities without the express knowledge and explicit consent of all parties involved. This includes livestreams, AI transcription tools, and any other form of recording, including the use of smart glasses. Where consent has been obtained, the recording device must be in plain view; it is strictly prohibited, unless the University expressly authorizes it, to hide the act of recording or a recording indicator, such as the visible light on smart glasses. The policy applies to faculty, staff, students, contractors, volunteers and guests in University-related activities on campus or offsite. Use of visual or recording devices is strictly prohibited in patient care areas or where protected health information may be discussed. Personal-use recordings at large public events such as commencement are permitted unless restricted.",
    date="2026-01", status="in_force",
    source="https://www.yu.edu/sites/default/files/inline-files/University%20Recording%20Policy%20%28January%202026%29.pdf",
    publisher="Yeshiva University")

add(name="Jesus College, Cambridge",
    kind="university", scope="venue", country="GB", region="Cambridgeshire",
    geo="Jesus College, Cambridge, United Kingdom",
    rules={"camera_glasses": "restricted", "recording": "restricted", "drones": "restricted"},
    summary="The College's filming, photography and recording policy (Communications Office, November 2025) applies to anyone wishing to film, photograph or record audio on the main site and its properties, including students, staff, visitors and the general public, and expressly includes devices with built-in cameras such as smart glasses. Disability-related use of such a device needs approval from the Disability Tutor or Head of HR; other requests go to the Communications Office. Permission is not required for non-commercial, handheld filming in public outside grounds or a person's own accommodation if only people known to the filmmaker are recognisable, there is no disruption, and the College's name is not used to imply endorsement. Other filming requires advance permission. Drone flights that launch from or land on College property always need advance written permission, with CAA, insurance and other documents, and unauthorised use may be reported.",
    date="2025-11", status="in_force",
    source="https://www.jesus.cam.ac.uk/sites/default/files/inline-files/Filming%2C%20photography%20and%20audio%20recording%20policy.pdf",
    publisher="Jesus College, Cambridge")

# --- Concert halls and venues ---

add(name="Paradiso",
    kind="venue", scope="venue", country="NL", region="Amsterdam",
    geo="Paradiso, Weteringschans, Amsterdam, Netherlands",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="Paradiso's house rules do not allow professional cameras, video equipment or other recording devices without prior permission, and do not allow hidden or discreet recording devices, including smart glasses with recording capabilities such as Meta Ray-Ban glasses.",
    status="in_force",
    source="https://www.paradiso.nl/en/info/about-us/huisregels",
    publisher="Paradiso")

add(name="Concertgebouw",
    kind="venue", scope="venue", country="NL", region="Amsterdam",
    geo="Concertgebouw, Amsterdam, Netherlands",
    rules={"recording": "restricted"},
    summary="The Concertgebouw's official visitor guidance says filming or photographing during the concert is not allowed, so that mobile devices cannot cause a disturbance; devices should be switched off or on silent and put away. Filming or photographing is allowed before the concert, in the intermission and during the applause.",
    status="in_force",
    source="https://www.concertgebouw.nl/en/welcome-to-the-concertgebouw",
    publisher="The Concertgebouw")

add(name="Elbphilharmonie",
    kind="venue", scope="venue", country="DE", region="Hamburg",
    geo="Elbphilharmonie, Hamburg, Germany",
    rules={"recording": "restricted"},
    summary="The Elbphilharmonie's official FAQ states that it is forbidden to take photographs or record videos during a concert or event. Video recordings and photography are permitted for private purposes only on the Plaza and in the foyers, as well as before the start or following an event in the concert hall, provided visitors respect the privacy of others and do not interfere with regular operations. Employees may not be photographed or filmed. Event-related video recordings or photographs for editorial or commercial purposes must be authorised by the Press Office.",
    status="in_force",
    source="https://www.elbphilharmonie.de/en/faq",
    publisher="Elbphilharmonie")

add(name="Laeiszhalle",
    kind="venue", scope="venue", country="DE", region="Hamburg",
    geo="Laeiszhalle, Hamburg, Germany",
    rules={"recording": "restricted"},
    summary="The official FAQ for the Elbphilharmonie and Laeiszhalle states that it is forbidden to take photographs or record videos during a concert or event. Private photography and video are permitted on the Plaza and in the foyers, and before or after an event in the concert hall, provided visitors respect others' privacy and do not interfere with operations. Employees may not be photographed or filmed. Editorial or commercial recordings must be authorised by the Press Office.",
    status="in_force",
    source="https://www.elbphilharmonie.de/en/faq",
    publisher="Elbphilharmonie")

add(name="Berliner Philharmonie",
    kind="venue", scope="venue", country="DE", region="Berlin",
    geo="Philharmonie Berlin, Herbert-von-Karajan-Strasse, Berlin, Germany",
    rules={"recording": "restricted"},
    summary="The Berliner Philharmoniker Foundation's General Terms and Conditions for Ticket Sales prohibit concertgoers from making visual and audio recordings of any kind at concerts or other events, for reasons of copyright and/or personal rights. Outside of events, photographs may be taken on the premises exclusively for private and non-commercial purposes. The Foundation's visitor guidance also says photography before or after the concert, or during intervals, is permitted in the Philharmonie for private purposes only, and asks guests to switch off mobile phones during the performance.",
    status="in_force",
    source="https://www.berliner-philharmoniker.de/en/terms-of-use/",
    publisher="Stiftung Berliner Philharmoniker")

add(name="Vienna State Opera",
    kind="venue", scope="venue", country="AT", region="Vienna",
    geo="Vienna State Opera, Opernring, Vienna, Austria",
    rules={"recording": "restricted"},
    summary="The Vienna State Opera's official practical information says photography and filming during the performance is not permitted. Photography and filming for private purposes is permitted at the curtain call or during intermission. The use of smartphones and cameras in the proscenium boxes is prohibited throughout the entire performance to protect the orchestra from falling objects.",
    status="in_force",
    source="https://www.wiener-staatsoper.at/en/practical-info/",
    publisher="Wiener Staatsoper")

add(name="Semperoper Dresden",
    kind="venue", scope="venue", country="DE", region="Saxony",
    geo="Semperoper, Dresden, Germany",
    rules={"recording": "restricted"},
    summary="The Staatsoper Dresden General Terms and Conditions, in force from 1 August 2025, prohibit any audio and/or photo or video recordings of events by visitors for reasons including copyright and personal rights. Beyond events, image recordings may only be made on the premises for private and non-commercial purposes. Staff may demand the surrender or deletion of a recording and ask the visitor to leave if these rules are breached.",
    date="2025-08-01", status="in_force",
    source="https://www.semperoper.de/en/terms-and-conditions.html",
    publisher="Staatsoper Dresden")

add(name="Palau de la Música Catalana",
    kind="venue", scope="venue", country="ES", region="Catalonia",
    geo="Palau de la Música Catalana, Barcelona, Spain",
    rules={"recording": "restricted"},
    summary="The Palau's official concert regulations state that photography, filming and recording inside the concert hall during concerts are not permitted ('No es permet de fotografiar, filmar ni gravar dins la sala durant els concerts'). For building visits, the Palau's practical information says photography is allowed without flash or tripods.",
    status="in_force",
    source="https://www.palaumusica.cat/ca/normativa_1629173",
    publisher="Palau de la Música Catalana")

# --- Theme parks, parks and attractions ---

add(name="Efteling",
    kind="theme_park", scope="venue", country="NL", region="North Brabant",
    geo="Efteling, Kaatsheuvel, Netherlands",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Efteling's official park regulations (28 February 2025) prohibit the use of drones in and around Efteling, and say mobile phones, GoPros or selfie sticks must not be used in a manner that is dangerous or causes a nuisance. Commercial activities, including filming, require prior written permission. Visitors may not record audio or video of Efteling staff without their explicit prior consent.",
    date="2025-02-28", status="in_force",
    source="https://www.efteling.com/en/-/media/files/conditions/28-02-2025/20250228-parkreglement-en.pdf",
    publisher="Efteling")

add(name="Europa-Park",
    kind="theme_park", scope="venue", country="DE", region="Baden-Württemberg",
    geo="Europa-Park, Rust, Germany",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Europa-Park's park and parking rules (status June 2026) prohibit drones and remote-controlled toys on the premises. Cameras, mobile phones and similar loose items must be stored securely before entering a ride. Visitors may take their own photographs and films for private purposes if other guests are not impaired or disturbed; professional photo and film shoots for commercial purposes, and live streaming via all online platforms, are permitted only with prior written permission.",
    date="2026-06", status="in_force",
    source="https://www.europapark.de/en/theme-park/park-and-parking-rules-and-regulations",
    publisher="Europa-Park")

add(name="Phantasialand",
    kind="theme_park", scope="venue", country="DE", region="North Rhine-Westphalia",
    geo="Phantasialand, Brühl, Germany",
    rules={"camera_glasses": "restricted", "recording": "restricted", "drones": "prohibited"},
    summary="Phantasialand's official admission and use conditions (April 2026) forbid filming and photographing with phones or other cameras during the ride on all attractions; this expressly includes smart glasses and comparable technologies, as well as body-mounted action cameras and cameras on selfie sticks or other aids. Flash may not be used in shows, and filming of shows is not permitted for copyright reasons. Carrying and operating drones is forbidden on the entire grounds. Commercial filming and photography requires the approval of management.",
    date="2026-04", status="in_force",
    source="https://www.phantasialand.de/de/eintrittsbedingungen/",
    publisher="Phantasialand")

add(name="Tivoli Gardens",
    kind="theme_park", scope="venue", country="DK", region="Copenhagen",
    geo="Tivoli Gardens, Copenhagen, Denmark",
    rules={"recording": "restricted", "drones": "restricted"},
    summary="Tivoli Gardens' official park regulations do not permit professional or semi-professional audio, photo or video equipment, including SLR cameras with interchangeable or zoom lenses, when attending performances and concerts. Regardless of equipment, it is not permitted to record and publish entire concerts or performances, or substantial parts thereof, without prior permission from Tivoli. Permission to use and fly a drone within Tivoli Gardens must be pre-approved by Tivoli and relevant government officials.",
    status="in_force",
    source="https://www.tivoli.dk/en/practical-information/regulations-of-tivoli-gardens",
    publisher="Tivoli Gardens")

add(name="Keukenhof",
    kind="park", scope="venue", country="NL", region="South Holland",
    geo="Keukenhof, Lisse, Netherlands",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Keukenhof's official park rules permit photography and filming for personal use at both Keukenhof Castle and Estate and the Flower Show, but prohibit publication of visual and audio material and commercial use unless written permission has been granted. Flying drones or other flying objects over the Castle and Estate and over the Flower Show is prohibited.",
    status="in_force",
    source="https://www.keukenhof.nl/en/park-rules",
    publisher="Keukenhof")

add(name="Madurodam",
    kind="theme_park", scope="venue", country="NL", region="South Holland",
    geo="Madurodam, The Hague, Netherlands",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Madurodam's official park rules (5 July 2023) prohibit using drones in and around the park, and prohibit using phones, GoPros, selfie sticks and similar items in an annoying way. Professional photo or video recordings are not permitted without Madurodam's prior written permission.",
    date="2023-07-05", status="in_force",
    source="https://www.madurodam.nl/en/park-rules",
    publisher="Madurodam")

add(name="ARTIS",
    kind="park", scope="venue", country="NL", region="Amsterdam",
    geo="ARTIS, Plantage Kerklaan, Amsterdam, Netherlands",
    rules={"recording": "restricted"},
    summary="ARTIS's official visitor regulations (version TJ27082026, 27 August 2026) forbid, without ARTIS's express permission, the use of photo, video, film, sound and other recording equipment, unless it is intended for private, non-commercial use.",
    date="2026-08-27", status="in_force",
    source="https://www.artis.nl/media/idml31os/bezoekersreglement-artis-27082026.pdf",
    publisher="ARTIS")

add(name="Pairi Daiza",
    kind="park", scope="venue", country="BE", region="Hainaut",
    geo="Pairi Daiza, Brugelette, Belgium",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Pairi Daiza's official regulations say pictures taken during a visit may only be used in a strictly family sphere; any commercial or professional use of pictures taken in the park is subject to Pairi Daiza's written approval. Among items that may not be brought into the Garden are handheld camera or cell-phone extension poles such as selfie sticks, and recreational devices such as drones and remote-control toys. Flash photography is not allowed in the Aquarium.",
    status="in_force",
    source="https://www.pairidaiza.eu/en/pairi-daiza-regulations/",
    publisher="Pairi Daiza")

add(name="Atomium",
    kind="monument", scope="venue", country="BE", region="Brussels",
    geo="Atomium, Brussels, Belgium",
    rules={"recording": "restricted"},
    summary="The Atomium's official tour and rules state that professional photography, filming, and recording of radio and television programmes are subject to a prior request to the Atomium, and that written authorisation must be presented at any check in the building. Professional audio or visual recordings in which the public or staff may be the subject also require the consent of the parties involved.",
    status="in_force",
    source="https://atomium.be/atomium-tour_and_rules",
    publisher="Atomium")

add(name="Rulantica",
    kind="theme_park", scope="venue", country="DE", region="Baden-Württemberg",
    geo="Rulantica, Rust, Germany",
    rules={"recording": "restricted"},
    summary="Rulantica's official swimming and car park rules (status June 2026) allow visitors to take their own photos and videos for private purposes if they do not disrupt other visitors, and do not permit photographing strangers or unknown groups without their consent. Professional photography and filming for commercial use is only permitted with prior written consent. Action cams such as GoPros with a head mount are permitted except on the Dugdrob, Vildfål and Isbrekker attractions. Photography and filming is not permitted in the Snorri-Saga attraction for copyright reasons, and photography and filming below water is only permitted with the explicit consent of staff. Staff may review images and request deletion if they suspect the rules have been disregarded.",
    date="2026-06", status="in_force",
    source="https://www.europapark.de/en/rulantica/info/safety/swimming-and-car-park-rules-and-regulations",
    publisher="Europa-Park")

# --- Casinos (new jurisdiction) ---

add(name="Macao casinos",
    kind="casino", scope="multi_site", country="MO", region="Macao",
    geo="Grand Lisboa, Macau",
    rules={"recording": "prohibited"},
    summary="Macao Law No. 17/2018, published in the Official Gazette on 27 December 2018 and in force from 28 December 2018, added Article 8-A to Law No. 10/2012. It prohibits the recording of images or sounds in any location inside casinos, and the use of mobile phones or other communication equipment at gaming tables and within a limited area of three metres around them, except when authorised by the Director of the Gaming Inspection and Coordination Bureau (DICJ). If there are indications that someone has recorded images or sounds inside a casino without authorisation, authorised personnel may require the device and recordings to be shown and may order the recordings destroyed.",
    date="2018-12-28", status="in_force",
    source="https://images.bo.dsaj.gov.mo/bo/i/2018/52/lei-17-2018.pdf",
    publisher="Boletim Oficial da Região Administrativa Especial de Macau")
