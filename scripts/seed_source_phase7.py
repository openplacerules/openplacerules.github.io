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

