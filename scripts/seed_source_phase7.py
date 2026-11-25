# Phase 7 seed entries (retrieved 2026-11-25). Official sources only.
# Every rule is taken from a source URL that was fetched and read.
E = []
def add(**k): E.append(k)

# ---------------- U.S. federal courts (smart glasses / electronic-device orders) ----------------

add(name="U.S. District Court for the Northern District of Illinois",
    kind="court", scope="multi_site", country="US", region="Illinois",
    geo="219 South Dearborn Street, Chicago, Illinois, USA",
    rules={"camera_glasses": "prohibited", "recording": "restricted"},
    summary="A joint courthouse security order dated 1 May 2026, issued for the Everett McKinley Dirksen U.S. Courthouse in Chicago, the Stanley J. Roszkowski U.S. Courthouse in Rockford, and listed N.D. Illinois probation offices in Chicago and Lisle by the U.S. Court of Appeals for the Seventh Circuit and the U.S. District Court for the Northern District of Illinois, provides that eyeglasses determined to be “smart glasses” (eyeglasses which, at a minimum, may be used as a camera, video recorder, or audio recorder), regardless of manufacturer, make, model, or type of imbedded technology, are prohibited items and shall not be permitted inside and shall not be used in any building, courthouse, courtroom, or any other location in which court business and proceedings are conducted. Eyeglasses are subject to search at security screening. Members of the media or the public may not film, photograph, or record a video image of any uniformed courthouse security personnel on duty, or of any security equipment or device, in the courthouses or on the grounds. Media interviews inside the courthouses are limited to designated media areas.",
    date="2026-05-01", status="in_force",
    source="https://www.ilnd.uscourts.gov/_assets/_documents/Joint%20Courthouse%20Security%20Order.pdf",
    publisher="U.S. District Court, Northern District of Illinois, and U.S. Court of Appeals for the Seventh Circuit",
    via=None)

add(name="U.S. District Court for the Southern District of Iowa",
    kind="court", scope="multi_site", country="US", region="Iowa",
    geo="Des Moines, Iowa, USA",
    rules={"camera_glasses": "prohibited", "recording": "prohibited"},
    summary="Public Administrative Order No. 25-AO-8-P, dated 24 November 2025, governs prohibited items in any courthouse or upon any courthouse grounds of the Southern District of Iowa, including the U.S. courthouses in Des Moines, Council Bluffs and Davenport. Electronic devices that capture, record, broadcast, transmit, or store anything by electronic, photographic, audio, or visual means are prohibited; the order lists, among other devices, cameras, audio/video recorders, smart glasses and smart watches. No recording or photograph of any type may be made within the courthouse unless expressly authorised in advance by the Chief Judge. Limited exceptions, including when a judicial officer authorises devices for ceremonial or educational proceedings, are set out in the order.",
    date="2025-11-24", status="in_force",
    source="https://www.iasd.uscourts.gov/sites/iasd/files/general-orders/25-AO-8%20-%20Prohibited%20Items%20Order.pdf",
    publisher="U.S. District Court, Southern District of Iowa", via=None)

add(name="U.S. District Court for the Northern District of Mississippi",
    kind="court", scope="multi_site", country="US", region="Mississippi",
    geo="United States Courthouse, Oxford, Mississippi, USA",
    rules={"camera_glasses": "prohibited", "recording": "prohibited"},
    summary="The court’s Policy on Possession of Electronic Devices, filed 19 November 2026, provides that, subject to listed exceptions, no electronic devices capable of recording or transmitting (including broadcasting or streaming) photographs, video, or audio are allowed in the courthouses of the district. Prohibited devices include, but are not limited to, mobile phones, laptop computers, tablets, smart watches, smart glasses, cameras, and other wireless communication devices. Court employees and tenants may bring electronic devices; attorneys and support staff directly involved in litigation then before the court may bring mobile phones, laptops, tablets and smart watches (the attorney exception does not list smart glasses). A judge may grant permission for a specified proceeding. Notwithstanding those exceptions, no person may record or transmit photographs, video, or audio of any court proceedings or inside any courthouse of the district, including proceedings conducted by telephone or video conference.",
    date="2026-11-19", status="in_force",
    source="https://www.msnd.uscourts.gov/sites/msnd/files/forms/MSND%20Policy%20on%20Possession%20of%20Electronic%20Devices_11.19.2026.pdf",
    publisher="U.S. District Court, Northern District of Mississippi", via=None)

add(name="U.S. District Court for the Southern District of Mississippi",
    kind="court", scope="multi_site", country="US", region="Mississippi",
    geo="Jackson, Mississippi, USA",
    rules={"camera_glasses": "prohibited", "recording": "prohibited"},
    summary="By order dated 1 November 2026, the court adopted a revised Policy on Possession of Electronic Devices, effective immediately. Subject to listed exceptions, no electronic devices capable of recording or transmitting (including broadcasting or streaming) photographs, video, or audio are allowed in the courthouses of the district. Prohibited devices include, but are not limited to, mobile phones, laptop computers, tablets, smart watches, smart glasses, cameras, and other wireless communication devices. Court employees and tenants may bring electronic devices; attorneys and support staff directly involved in litigation then before the court may bring mobile phones, laptops, tablets and smart watches (the attorney exception does not list smart glasses). A judge may grant permission for a specified proceeding. Notwithstanding those exceptions, no person may record or transmit photographs, video, or audio of any court proceedings or inside any courthouse of the district, including proceedings conducted by telephone or video conference.",
    date="2026-11-01", status="in_force",
    source="https://www.mssd.uscourts.gov/sites/mssd/files/ElectronicDevicesOrderAndPolicy.pdf",
    publisher="U.S. District Court, Southern District of Mississippi", via=None)

add(name="U.S. District Court for the Middle District of Georgia",
    kind="court", scope="multi_site", country="US", region="Georgia",
    geo="Macon, Georgia, USA",
    rules={"camera_glasses": "prohibited", "recording": "prohibited"},
    summary="The court’s Electronic Device Policy, effective 21 November 2025 and applicable in all U.S. courthouses in the Middle District of Georgia, provides that, except as specifically authorised, mobile phones, tablets, iPads, cameras, laptop computers, smart glasses, or any audio or visual recording or electronic transmitting devices of any type may not be brought into the courthouses. Under no circumstances shall any electronic devices be used to photograph, record, broadcast, or transmit judicial proceedings, notwithstanding the exceptions. Judges, law enforcement officers on official business, and attorneys and their staff may bring electronic devices subject to screening; members of the general public, including jurors, grand jurors, and witnesses, may not bring electronic devices into the courthouses. The policy may be suspended for naturalization or other ceremonial or educational proceedings in the discretion of the Clerk, Chief Deputy Clerk, or any judge.",
    date="2025-11-21", status="in_force",
    source="https://www.gamd.uscourts.gov/sites/gamd/files/ELECTRONIC_DEVICE_POLICY-rev_11-21-25.pdf",
    publisher="U.S. District Court, Middle District of Georgia", via=None)

add(name="U.S. District Court for the District of Minnesota",
    kind="court", scope="multi_site", country="US", region="Minnesota",
    geo="United States Courthouse, Minneapolis, Minnesota, USA",
    rules={"camera_glasses": "restricted", "recording": "prohibited"},
    summary="The Policy on Use of Electronic Devices in U.S. Courthouses in the District of Minnesota, effective 9 January 2026, treats cameras, recording devices, cellular telephones, smart phones, tablet computers, laptop computers, smart watches, smart glasses, and similar devices as “electronic devices” subject to inspection at security checkpoints. Upon entry to the Minneapolis or St. Paul courthouses — and, by order of any judge on particular days, at the Duluth or Fergus Falls courthouses — visitors who are not in an exempt category must turn their electronic devices off in the presence of Court Security Officers and place them in a locked pouch or receptacle provided by the U.S. Marshal, which remains with the owner and must not be opened while in the courthouse. Exempt categories include judicial officers and court employees, attorneys with valid bar identification or specified federal credentials, summoned and seated jurors (subject to the presiding judge), credentialed media, certain other official visitors, and listed medical and ceremonial exceptions. Notwithstanding those exemptions, no electronic device may be used or possessed in violation of Federal Rule of Criminal Procedure 53 (prohibiting courtroom photography and broadcasting in criminal cases) or of any directive of a judge, deputy U.S. marshal, or court security officer.",
    date="2026-01-09", status="in_force",
    source="https://www.mnd.uscourts.gov/electronics-device-policy",
    publisher="U.S. District Court, District of Minnesota", via=None)

add(name="U.S. District Court for the District of South Carolina",
    kind="court", scope="multi_site", country="US", region="South Carolina",
    geo="901 Richland Street, Columbia, South Carolina, USA",
    rules={"camera_glasses": "prohibited", "recording": "prohibited"},
    summary="Order 3:25-mc-00235-TMC, dated 31 March 2025, prohibits wireless communications devices at all court facilities in the District of South Carolina. The order applies to cell phones or multi-media enabled smart phones; smart watches; smart glasses; cameras; laptop or tablet computers; and all similar devices that have the capability of recording or transmitting sound, pictures, and/or video using wireless technology or other means. If such an item is brought to the courthouse, a Court Security Officer will advise the person to store it in a nearby home, office, or vehicle, or, if that is not practicable, leave it with security on entry. Exempt categories include co-located U.S. government tenants, court employees (including contract court reporters and interpreters), the U.S. Attorney, Federal Public Defender, U.S. Marshal and employees thereof, court security officers, federal, state and local law enforcement agents, and attorneys on court business whose possession and use is related to their official duties (with support staff accompanying authorised attorneys also exempt). Any audio or video recording of proceedings, or the taking of photographs by any means, is not permitted while in the courthouse. The presiding judge may authorise cameras and other equipment for ceremonial proceedings, including naturalization or a judge’s investiture.",
    date="2025-03-31", status="in_force",
    source="https://www.scd.uscourts.gov/StandingOrders/Electronic_Devices_in_Courthouses/3-25-mc-235_Prohibition_of_Wireless_Communications_Devices_in_Courtroom_Facilities.pdf",
    publisher="U.S. District Court, District of South Carolina", via=None)

add(name="U.S. District Court for the Northern District of California",
    kind="court", scope="multi_site", country="US", region="California",
    geo="450 Golden Gate Avenue, San Francisco, California, USA",
    rules={"camera_glasses": "restricted", "recording": "prohibited"},
    zones=[
        {"zone": "San Francisco courtrooms", "camera_glasses": "prohibited", "recording": "prohibited"},
        {"zone": "Oakland, San Jose and McKinleyville courthouses", "camera_glasses": "prohibited", "recording": "prohibited"},
    ],
    summary="General Order No. 58, amended 6 October 2026, prohibits photographing and video and audio recording in the courtrooms and in the common areas of the courthouse (corridors and other areas outside the courtrooms), and also prohibits photographing or recording any court proceeding from a location outside the courthouse in conjunction with remote audio or video access, subject to exceptions a judge may authorise for court events or ceremonial occasions, or that the Chief Judge may authorise in writing. Electronic devices may otherwise be brought into courtrooms and used in a non-disruptive manner for purposes other than photography, video recording, audio recording, or streaming, unless a judge further restricts or prohibits their use. “Smart glasses” with recording, photographing, or streaming capabilities may not be brought into San Francisco courtrooms by anyone, including jurors, and are barred entirely from the courthouses in Oakland, San Jose, and McKinleyville.",
    date="2026-10-06", status="in_force",
    source="https://cand.uscourts.gov/sites/default/files/general-orders/GO-58-Revised-10-6-2026.pdf",
    publisher="U.S. District Court, Northern District of California", via=None)

# ---------------- Museums, gyms, parks, stadiums ----------------

add(name="National Corvette Museum",
    kind="museum", scope="venue", country="US", region="Kentucky",
    geo="National Corvette Museum, Bowling Green, Kentucky, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The museum’s Visitor Code of Conduct (updated 7 January 2026) states that drones are prohibited on the museum’s campus, over buildings, parking lots, and pedestrians without prior approval, and that flights may face additional restrictions during events; requests for drone flight authorisation go to the museum’s security team. Guests are welcome to take personal photography in the galleries unless otherwise noted; flash, tripods, and selfie sticks are not allowed.",
    date="2026-01-07", status="in_force",
    source="https://www.corvettemuseum.org/wp-content/uploads/2026/01/Visitor-Code-of-Conduct.pdf",
    publisher="National Corvette Museum", via=None)

add(name="Cleveland Museum of Art",
    kind="museum", scope="venue", country="US", region="Ohio",
    geo="Cleveland Museum of Art, Cleveland, Ohio, USA",
    rules={"recording": "restricted"},
    summary="The museum’s official Museum Visitor Policies provide that on-site visitors may capture still and moving images and make three-dimensional models (“capture media”) of public-domain artworks in the publicly displayed collections, and that quick snapshots are permitted in the galleries. Organized photo shoots are not permitted in the galleries. Visitors are prohibited from taking photos, videos, or recordings of staff or volunteers without their consent. Only point-and-shoot cameras, phones, and handheld equipment may be used, provided there is no disruption to museum operations or guest accessibility. Flash, tripods, monopods, selfie sticks, additional lighting, props, or large, multicomponent, nonhandheld equipment are not permitted. Wedding, engagement, prom and similar group photographs are permitted only on the museum’s grounds or on the first floor of the Ames Family Atrium. The museum reserves the right to limit photo activity at any time.",
    date=None, status="in_force",
    source="https://www.clevelandart.org/plan-your-visit/museum-visitor-policies",
    publisher="Cleveland Museum of Art", via=None)

add(name="High Museum of Art",
    kind="museum", scope="venue", country="US", region="Georgia",
    geo="High Museum of Art, Atlanta, Georgia, USA",
    rules={"recording": "restricted"},
    summary="The museum’s official visiting tips and Photography Policy and Guidelines state that non-flash photography is encouraged in the permanent collection galleries. Photographs must be for personal use only and may not be sold, published, or used to promote any outside product or service. Visitors should use hand-held cameras, cell phones, and tablets with the flash turned off; tripods, lights, selfie-sticks, and other camera accessories are not permitted. Photography of special exhibitions or works on loan is sometimes prohibited by lenders, with photo policies posted in those galleries. The museum reserves the right to withhold or withdraw permission to photograph on the premises. Commercial photography and film shoots must be approved and scheduled in advance by the Public Relations Office.",
    date=None, status="in_force",
    source="https://high.org/visiting-tips/",
    publisher="High Museum of Art",
    via="https://high.org/press-room/photography-policy-and-guidelines/")

add(name="PureGym (UK clubs)",
    kind="gym", scope="organization", country="GB", region=None,
    geo="London, United Kingdom",
    rules={"recording": "restricted"},
    summary="PureGym’s official Filming & Photography Policy — UK states that members are welcome to use a phone or personal camera to record their own training on the gym floor for personal use, provided other members are kept out of the shot unless they have said they are happy to appear, and that filming must be paused or reframed if a team member or another member asks. Devices used to film should be kept visible and obvious, and discreet recording devices should be left outside the gym. No filming or photography is to take place in changing rooms, showers, or toilets. Group-exercise classes and studio spaces require permission from the instructor and the participants before filming or photography that may include anyone else. Larger setups (lighting rigs, big tripods, multiple cameras, or repeated re-shoots) and commercial, promotional or influencer filming need prior arrangement with gym management. The gym rules also state that members must not take pictures, videos or live stream other members without their permission, and must not make video calls in the changing rooms.",
    date=None, status="in_force",
    source="https://www.puregym.com/media/1gyj1bog/filming-photography-policy-uk.pdf",
    publisher="PureGym",
    via="https://www.puregym.com/gym-rules/")

add(name="California State Parks (default)",
    kind="park", scope="organization", country="US", region="California",
    rules={"drones": "restricted"},
    summary="The official California State Parks page “Unmanned Aircraft System (Drones) in State Parks” states that drones are currently allowed in State Parks, State Beaches, State Historic Parks, State Recreational Areas, and State Vehicular Recreation Areas except where prohibited by a District Superintendent’s posted order (for reasons that may include protection of threatened species, cultural and natural resources, high fire danger, public safety, recreational conflicts, visitor-experience privacy, and park unit classification). State Park regulations prohibit the use of motorized equipment, including unmanned aircraft systems, within wilderness areas, cultural preserves, and natural preserves (Cal. Code Regs. tit. 14, § 4351). Even absent a posted order, park staff may contact operators when drones threaten visitors, property, wildlife, or privacy, and may ask an operator flying in a dangerous or reckless manner to stop and remove the drone. Commercial drone use in a state park requires a permit, and commercial photography or filming also requires a permit from the California Film Commission (Cal. Code Regs. tit. 14, § 4316). Recreational users are told to check with the local State Park District and to follow FAA recreational UAS rules.",
    date=None, status="in_force",
    source="https://www.parks.ca.gov/?page_id=29229",
    publisher="California Department of Parks and Recreation", via=None)

add(name="Wembley Stadium",
    kind="venue", scope="venue", country="GB", region="London",
    geo="Wembley Stadium, London, United Kingdom",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="Wembley Stadium’s official Prohibited items page lists “Unauthorised fliers & drones” among restricted items that are legal to possess but not allowed within the stadium, and also lists large-bodied cameras, professional cameras and recording devices (described as applying to cameras that have interchangeable lenses), and selfie sticks. The Ground Regulations published by Wembley National Stadium Limited provide, at clause 17, that no person other than a person who holds an appropriate licence may bring into the Ground or use within the Ground any equipment which is capable of recording or transmitting (by digital or other means) any audio, visual or audio-visual material or any information or data in relation to the Event or the Ground. The prohibited-items page notes that some non-FA events at the stadium may publish their own list of prohibited items, which override the list above and are communicated to ticket holders for those events.",
    date=None, status="in_force",
    source="https://www.wembleystadium.com/plan-your-visit/stadium-guide/prohibited-items",
    publisher="Wembley National Stadium Limited",
    via="https://www.wembleystadium.com/plan-your-visit/stadium-guide/rules-and-regulations")


add(name="United States Holocaust Memorial Museum",
    kind="museum", scope="venue", country="US", region="District of Columbia",
    geo="United States Holocaust Memorial Museum, Washington, District of Columbia, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The museum’s official Filming, Photography, and Media Usage guidelines, which also point to its building policies, state that non-flash photography is permitted in the museum for non-commercial purposes, and that additional equipment such as lights, stands and selfie sticks is prohibited. Flash photography and tripods are also not allowed under the building policies. Drones are not permitted anywhere on museum property, inside or outside of the building. Photographs for advertising or commercial purposes are not allowed, and visitors may not record audio or video of people not with their group without express permission. Professional and commercial filming and photography on museum property require prior permission from the Communications office.",
    date=None, status="in_force",
    source="https://www.ushmm.org/information/press/filming-photography-and-media-usage",
    publisher="United States Holocaust Memorial Museum",
    via="https://www.ushmm.org/information/visit-the-museum/building-policies")

add(name="Kyoto National Museum",
    kind="museum", scope="venue", country="JP", region="Kyoto",
    geo="Kyoto National Museum, Kyoto, Japan",
    rules={"recording": "restricted"},
    summary="The museum’s official “A Message to Museum Visitors” page states that photography is prohibited in the galleries, in order to protect the artworks and the wishes of their owners and to maintain an optimal viewing environment, excluding the designated “Photo Spots” of special exhibitions. The museum asks visitors to follow any additional verbal instructions from staff issued to protect artworks or maintain viewing conditions.",
    date=None, status="in_force",
    source="https://www.kyohaku.go.jp/eng/visit/requests/",
    publisher="Kyoto National Museum", via=None)

add(name="TOKYO SKYTREE",
    kind="monument", scope="venue", country="JP", region="Tokyo",
    geo="TOKYO SKYTREE, Tokyo, Japan",
    rules={"drones": "prohibited", "recording": "restricted"},
    summary="The official TOKYO SKYTREE FAQ states that, for safety, drones and other unmanned aircraft are prohibited on the premises of TOKYO SKYTREE TOWN, and asks visitors also to refrain from using small unmanned aircraft that are not covered by law. The official “A request to our customers” page lists drones among items not allowed on the premises, and its photography and live-streaming guidelines prohibit photography that may disturb other visitors or infringe the privacy of other guests and certain staff; commercial photography, recording or interviews on the premises for business purposes require permission in advance. Failure to comply may result in denied entry or being asked to leave.",
    date=None, status="in_force",
    source="https://en.tokyo-skytree.jp/inquiry/faq/",
    publisher="TOKYO SKYTREE (Tobu Tower Skytree Co., Ltd.)",
    via="https://en.tokyo-skytree.jp/ticket/to_guest/")

add(name="Lord's Cricket Ground",
    kind="venue", scope="venue", country="GB", region="London",
    geo="Lord's Cricket Ground, London, United Kingdom",
    rules={"drones": "prohibited", "recording": "restricted"},
    summary="The official Lord’s Security page, which sets out prohibited or restricted items and cricket match regulations, lists Remote Piloted Aircraft Systems (RPAS) or equipment to control or operate such RPAS as prohibited or restricted items (section 3.3). At cricket matches, any camera tripods, monopods, lenses with a total focal length of greater than 200mm, or commercial digital video equipment or sound recording equipment, is strictly prohibited unless authorised by MCC (section 4.3). The same camera and drone rules also appear in the General Ground Regulations.",
    date=None, status="in_force",
    source="https://www.lords.org/lords/match-day/security",
    publisher="Marylebone Cricket Club (Lord's)",
    via="https://www.lords.org/information/general-ground-regulations")

add(name="Old Trafford",
    kind="venue", scope="venue", country="GB", region="Manchester",
    geo="Old Trafford, Manchester, United Kingdom",
    rules={"recording": "restricted"},
    summary="Manchester United’s official “Prohibited items at Old Trafford” page lists items that must not be brought into the stadium, including laptops or tablets, large bodied cameras, and image or sound recording devices. Entry will also be refused with any other articles deemed dangerous, hazardous or that compromise public health and safety.",
    date=None, status="in_force",
    source="https://www.manutd.com/en/club/visit-old-trafford/prohibited-items-at-old-trafford",
    publisher="Manchester United Football Club", via=None)

add(name="Fushimi Inari Taisha",
    kind="place_of_worship", scope="venue", country="JP", region="Kyoto",
    geo="Fushimi Inari Taisha, Kyoto, Japan",
    rules={"drones": "prohibited", "recording": "restricted"},
    summary="The shrine’s official “Request for All Visitors” (dated 1 January 2022) lists acts that are prohibited in order to maintain the dignity of the sacred area, including flying drones or other aircraft; photography for commercial purposes or in prohibited areas; and preventing worshippers from passing by taking photographs or filming on narrow paths. Anyone caught performing the listed actions will be asked to refrain, or to leave if they do not comply.",
    date="2022-01-01", status="in_force",
    source="https://inari.jp/en/request/",
    publisher="Fushimi Inari Taisha (Shrine Office)", via=None)

add(name="Himeji Castle",
    kind="monument", scope="venue", country="JP", region="Hyogo",
    geo="Himeji Castle, Himeji, Japan",
    rules={"recording": "restricted"},
    summary="The official Himeji Castle frequently asked questions state that it is prohibited to use a monopod, tripod or a selfie stick inside the building, and that these items may also be prohibited outside in case of heavy congestion and other reasons. Staff may approach visitors with warnings in order to protect the cultural properties and to secure safety.",
    date=None, status="in_force",
    source="https://www.himejicastle.jp/en/faq.html",
    publisher="Himeji Castle (Himeji City)", via=None)

add(name="Fenway Park",
    kind="venue", scope="venue", country="US", region="Massachusetts",
    geo="Fenway Park, Boston, Massachusetts, USA",
    rules={"recording": "restricted"},
    summary="The official Fenway Park Information Guide states that professional audio/visual equipment is prohibited from Fenway Park, with examples including tripods, monopods, and detachable lenses longer than 6 inches (the prohibited-items section also lists microphones among examples). Consumer-rated cameras and video cameras are permitted inside Fenway Park but cannot be used to reproduce the game and must not interfere with other fans’ enjoyment of the game.",
    date=None, status="in_force",
    source="https://www.mlb.com/redsox/ballpark/information/guide",
    publisher="Boston Red Sox (Fenway Park Information Guide)", via=None)

add(name="U.S. District Court for the District of Arizona",
    kind="court", scope="multi_site", country="US", region="Arizona",
    geo="Sandra Day O'Connor United States Courthouse, Phoenix, Arizona, USA",
    rules={"camera_glasses": "prohibited"},
    summary="General Order 25-08, dated 2 May 2025, prohibits devices that may be used for covert recording in all publicly accessible areas of the Sandra Day O’Connor United States Courthouse in Phoenix, the Evo A. DeConcini United States Courthouse in Tucson, the John M. Roll United States Courthouse in Yuma, and all portions of the AWD Professional Building in Flagstaff occupied by the U.S. District Court and U.S. Pretrial Services. Prohibited devices include but are not limited to USB mini voice recorders, camera and voice recorder pens, and smart glasses.",
    date="2025-05-02", status="in_force",
    source="https://www.azd.uscourts.gov/sites/azd/files/general-orders/25-08.pdf",
    publisher="U.S. District Court, District of Arizona", via=None)

add(name="Science Museum, London",
    kind="museum", scope="venue", country="GB", region="London",
    geo="Science Museum, London, United Kingdom",
    rules={"recording": "restricted"},
    summary="The museum’s official visit FAQs state that visitors are permitted to use hand-held cameras or phones within the museum for private and non-commercial purposes, but must not use cameras in any areas where video or photography is restricted (always clearly signed) or make any recording or take any photograph of any person without that person’s authorisation. Visitors must respect the privacy of others; if a visitor complains that photography, filming or recording is intrusive, the photographer may be asked to stop and/or delete any imagery and/or leave the museum. Non-private or commercial use of cameras or recording devices, and the use of tripods or lighting, is only allowed by prior arrangement.",
    date=None, status="in_force",
    source="https://www.sciencemuseum.org.uk/visit/visit-faqs",
    publisher="Science Museum (Science Museum Group)", via=None)

add(name="Yankee Stadium",
    kind="venue", scope="venue", country="US", region="New York",
    geo="Yankee Stadium, Bronx, New York, USA",
    rules={"recording": "restricted"},
    summary="The official Yankee Stadium Policies and Procedures state that single-frame flash photography is permitted, as are extended-length zoom lenses provided they do not interfere with the game or event or other guests’ enjoyment. Selfie sticks, mono/tripods and other professional camera equipment, video cameras, and any other equipment designed for the sole purpose of video and/or audio recording are not permitted. Guests are not permitted to transmit and/or stream, or aid in transmitting and/or streaming, any account, description, picture, video, audio, reproduction or other information about any games or events; attempting to do so may result in immediate ejection and/or revocation of ticket privileges without refund.",
    date=None, status="in_force",
    source="https://www.mlb.com/yankees/ballpark/information/guide",
    publisher="New York Yankees (Yankee Stadium Policies and Procedures)", via=None)

add(name="Wrigley Field",
    kind="venue", scope="venue", country="US", region="Illinois",
    geo="Wrigley Field, Chicago, Illinois, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Wrigley Field Policies and Procedures state that professional-grade video and still cameras, including cameras with an extended or removable lens and/or other components such as microphones, tripods and monopods, are not permitted. Video and still cameras designed for personal viewing are permitted provided they do not interfere with the game or other guests’ enjoyment; any other use, distribution or commercial use is prohibited. The prohibited-items list for Cubs games and winter programming at Wrigley Field and Gallagher Way includes unmanned aerial vehicles (including drones).",
    date=None, status="in_force",
    source="https://www.mlb.com/cubs/ballpark/information/guide",
    publisher="Chicago Cubs (Wrigley Field Policies and Procedures)", via=None)

add(name="Dodger Stadium",
    kind="venue", scope="venue", country="US", region="California",
    geo="Dodger Stadium, Los Angeles, California, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Dodger Stadium Policies and Procedures state that still and video cameras are permitted in the stadium for personal use only, that taking photos or videotaping any game action is prohibited, and that professional photographic tools (such as tripods and telephoto lenses) are not permitted; lenses cannot exceed 6 inches in length. The prohibited-items list for UNIQLO Field at Dodger Stadium and its parking lots includes professional camera/video equipment, tripods and monopods, and unmanned aerial vehicles or other radio-controlled flying objects.",
    date=None, status="in_force",
    source="https://www.mlb.com/dodgers/ballpark/information/guide",
    publisher="Los Angeles Dodgers (Dodger Stadium Policies and Procedures)", via=None)

add(name="Oriole Park at Camden Yards",
    kind="venue", scope="venue", country="US", region="Maryland",
    geo="Oriole Park at Camden Yards, Baltimore, Maryland, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Oriole Park at Camden Yards Policies and Procedures state that guests may bring cameras and video equipment for personal use only, provided it does not interfere with other guests’ enjoyment of the game; camera bags are not permitted, and cameras with a lens longer than seven inches may not be brought in except by credentialed media. Filming of any game footage is strictly prohibited by Major League Baseball. The page also states that Oriole Park is a “No Drone Zone,” and that the FAA imposes temporary flight restrictions to regulate the airspace around Camden Yards during Baltimore Orioles baseball games, with administrative action, civil penalties and criminal charges possible for operators who do not adhere to those restrictions.",
    date=None, status="in_force",
    source="https://www.mlb.com/orioles/ballpark/information/guide",
    publisher="Baltimore Orioles (Oriole Park at Camden Yards Policies and Procedures)", via=None)

add(name="Citi Field",
    kind="venue", scope="venue", country="US", region="New York",
    geo="Citi Field, Queens, New York, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Citi Field Policies and Procedures state that cameras are permitted, but cameras with ancillary equipment such as tripods and/or large boom microphones, as well as cameras which, due to their size, would interfere with another guest’s experience, are prohibited. Drones are not permitted inside the ballpark or parking lots at any time.",
    date=None, status="in_force",
    source="https://www.mlb.com/mets/ballpark/information/guide",
    publisher="New York Mets (Citi Field Policies and Procedures)", via=None)

add(name="Oracle Park",
    kind="venue", scope="venue", country="US", region="California",
    geo="Oracle Park, San Francisco, California, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Oracle Park Policies and Procedures state that cameras and video equipment are allowed in Oracle Park for MLB games, provided the equipment does not obstruct the view of others, and that guests are not allowed to reproduce or re-broadcast any film or videotape of Giants games for commercial purposes without written permission from the San Francisco Giants and Major League Baseball. The Giants reserve the right to require patrons to put cameras or video equipment away. The same page states that drones (or unmanned aircraft systems) cannot be flown near Oracle Park before, during, or after Giants games, and notes the federal restriction on flying within a three-nautical-mile radius of a stadium with a seating capacity of 30,000 or more during MLB games and certain other sporting events, starting one hour before the scheduled game.",
    date=None, status="in_force",
    source="https://www.mlb.com/giants/ballpark/information/guide",
    publisher="San Francisco Giants (Oracle Park Policies and Procedures)", via=None)

add(name="Kauffman Stadium",
    kind="venue", scope="venue", country="US", region="Missouri",
    geo="Kauffman Stadium, Kansas City, Missouri, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Kauffman Stadium Policies and Procedures list, among items not permitted into the stadium, cameras with 12-inch or more lenses and unmanned aerial vehicles, including but not limited to drones. If any listed items are discovered at the gates, security staff will ask that they be returned to a vehicle or thrown away; prohibited items will not be stored at the gates or guest services.",
    date=None, status="in_force",
    source="https://www.mlb.com/royals/ballpark/information/guide",
    publisher="Kansas City Royals (Kauffman Stadium Policies and Procedures)", via=None)

add(name="Petco Park",
    kind="venue", scope="venue", country="US", region="California",
    geo="Petco Park, San Diego, California, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Petco Park Policies and Procedures state that guests are welcome to bring non-professional still cameras and video cameras into Petco Park for personal use provided the lenses are no longer than 6 inches long and do not have extra detachable lenses, and that guests must avoid obstructing the views of others. The Padres reserve the right to request that guests discontinue filming or taking photographs on ballpark property, and note that special events may require different policies. The prohibited-items list includes cameras with lenses longer than 6 inches (no extra detachable lenses), drones, remote-controlled unmanned aerial vehicles or other motorized vehicles/devices, and selfie sticks.",
    date=None, status="in_force",
    source="https://www.mlb.com/padres/ballpark/information/guide",
    publisher="San Diego Padres (Petco Park Policies and Procedures)", via=None)

add(name="Angel Stadium",
    kind="venue", scope="venue", country="US", region="California",
    geo="Angel Stadium, Anaheim, California, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Angel Stadium Policies and Procedures state that cameras are permitted within Angel Stadium provided they are for personal use and no game action is recorded, as required by MLB, and that any video recording equipment or cameras with zoom lenses measuring greater than 6 inches in length are not allowed without proper media credentials. The same page states that drones, sometimes referred to as unmanned aircraft systems (UAS), are not permitted on or above Angel Stadium property, including around or above the stadium, the surrounding parking lots, or other parking lots in the immediate stadium vicinity.",
    date=None, status="in_force",
    source="https://www.mlb.com/angels/ballpark/information/guide",
    publisher="Los Angeles Angels (Angel Stadium Policies and Procedures)", via=None)

add(name="Daikin Park",
    kind="venue", scope="venue", country="US", region="Texas",
    geo="Daikin Park, Houston, Texas, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Policies and Procedures at Daikin Park state that visitors are welcome to bring video and still cameras into the ballpark, that lenses must not exceed 8 inches, and that tripods and monopods are not allowed. The prohibited-items list includes drones.",
    date=None, status="in_force",
    source="https://www.mlb.com/astros/ballpark/information/guide",
    publisher="Houston Astros (Policies and Procedures at Daikin Park)", via=None)

add(name="Truist Park",
    kind="venue", scope="venue", country="US", region="Georgia",
    geo="Truist Park, Atlanta, Georgia, USA",
    rules={"recording": "restricted", "drones": "prohibited"},
    summary="The official Truist Park Policies and Procedures state that all cameras must be handheld and that the camera lens cannot exceed 5 inches in length (3 inches for Truist Park concerts), and that no tripods or monopods will be permitted. Hand-held video cameras and still cameras for personal use may be brought into the ballpark, provided no game action is recorded in accordance with Major League Baseball regulations, and the equipment may not obstruct the view of other guests. For the safety and security of all guests, the use of drones, unmanned aerial vehicles (UAVs), or any remote-controlled aircraft is strictly prohibited within Truist Park and The Battery, including the parking areas; anyone found operating or in possession of these devices will be immediately removed from the premises and may face law enforcement action. Unauthorized drones, unmanned vehicles and remote-controlled vehicles are also listed in the code of conduct.",
    date=None, status="in_force",
    source="https://www.mlb.com/braves/ballpark/information/guide",
    publisher="Atlanta Braves (Truist Park Policies and Procedures)", via=None)
