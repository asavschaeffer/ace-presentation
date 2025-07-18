## **ACE Valet Operations Improvement Proposal: Presentation Blueprint**

**Document Version:** Supermaxx-2,000 SuperDoc (Rev 2.0)
**Prepared for:** Development Team & Grok 4-Heavy
**Date:** July 18, 2025

-----

### **1. Presentation Overview**

[cite\_start]This document outlines the blueprint for a modular, interactive presentation designed to transform the narrative around ACE Parking’s valet operations from one of reactive chaos to proactive, system-driven efficiency[cite: 95, 110, 118]. The core of the presentation is a 5-7 minute, visually-driven story that runs on any device, online or offline.

The central metaphor visualizes the operational hierarchy:

  * [cite\_start]**The Valet:** A firefighter on the ground, tackling immediate, tangible problems[cite: 13, 43].
  * [cite\_start]**The Manager:** An overseer in a watchtower, organizing processes and directing the frontline team[cite: 13].
  * [cite\_start]**The Executive:** A fire-spotter in a plane, observing the entire landscape, armed with metrics and strategic vision[cite: 13].

[cite\_start]The presentation begins with a cluttered desk symbolizing the current state of operations and concludes with a clean, organized command center, culminating in a clear call-to-action: "Launch Pilot Program"[cite: 100, 105].

-----

### **2. Platform, Hosting & Offline-First Strategy**

  * **Platform:** A static Single-Page Application (SPA) built with standard HTML, CSS, and JavaScript. It will be bundled for simple deployment.
  * **Hosting:** Deployable on any static hosting service such as Netlify, Vercel, or an internal ACE server.
  * **Offline‑First Architecture:** All essential assets—including 3D models, JSON data stores, images, and code bundles—will be pre-cached using a **service worker**. [cite\_start]This ensures the presentation is 100% functional without an internet connection, making it reliable for any presentation environment[cite: 91].
  * **Data Storage:** A local JSON file will serve as the primary data source. On first load, this data will be cached into the browser's local storage (IndexedDB as a fallback) for instant access on subsequent views.
  * [cite\_start]**API (Optional):** A tiny, serverless REST API endpoint can be integrated for future enhancements, such as collecting stakeholder feedback or synchronizing data across multiple sites[cite: 192, 361].

-----

### **3. Responsive & Accessible Design**

  * **Responsive Layouts:** A mobile-first, fluid design will be implemented using CSS Grid and Flexbox. Specific breakpoints will be defined to optimize the viewing experience on all target devices:
      * **Mobile (\<768px):** Single-column, touch-friendly interface.
      * **Tablet/Laptop (768px - 1280px):** Two-column interactive layout.
      * **Projector (\>1280px):** A widescreen (16:9) hero view with enlarged fonts and simplified UI for high visibility.
  * **Accessibility (A11y):** The presentation will adhere to modern accessibility standards.
      * A `prefers-reduced-motion` toggle will disable all non-essential animations.
      * All interactive elements will have clear, keyboard-navigable focus states.
      * ARIA labels will be used for modals, buttons, and other controls to ensure screen reader compatibility.
      * Color palettes will be designed for high contrast to ensure legibility.

-----

### **4. Presentation Structure & Navigation**

The presentation is divided into five self-contained sections. A persistent, subtle "Skip To…" menu will allow the presenter to navigate non-linearly to address specific questions.

#### **Section 1: Opening Scene – The Chaotic Desk**

  * **Visuals:** A 3D desk environment is shown buried under a pile of 30-50 scattered, color-coded papers. A small, overwhelmed "firefighter" figure (the valet) stands amidst the chaos. In the background, a watchtower (manager) and a circling airplane (executive) are visible.
  * **Contextual Details:** The papers are not generic; they represent real, documented issues. Clicking on a paper triggers a modal with specific details. Examples include:
      * [cite\_start]A red paper titled "**$7,500 Damage Claim**" with the description: "A poorly trained valet caused $7,500 in damage to a handicap vehicle on 4/25, highlighting the cost of inadequate training"[cite: 102, 236].
      * [cite\_start]A crumpled sticky note titled "**Lost Keys**" with the description: "Reliance on sticky notes for room numbers leads to key loss, guest frustration, and incorrect billing"[cite: 135].
      * [cite\_start]A paper titled "**No Training**" reading: "Six new valets with zero experience from the 'new training program' were useless, unable to write tickets or perform basic functions"[cite: 9, 10].
      * [cite\_start]A paper titled "**Staffing Gap Over-spend**" with the description: "Current inefficiencies and turnover contribute to staffing gap bonuses exceeding $3,000 per month"[cite: 97, 238].
  * [cite\_start]**Narration/Key Message:** "Our valets are like firefighters, but they're being sent to fight a forest fire without a map or a radio. The result is chaos that directly impacts service, morale, and the bottom line"[cite: 1, 97].

#### **Section 2: Valet Layer – The Firefighter/Soldier**

  * **Visuals:** The camera zooms in on the firefighter figure. Urgent papers glow red.
  * **Interactions:** The presenter clicks on a "problem" paper (e.g., "**Inconsistent Procedures**"). The modal shows the problem and a proposed solution. Upon closing the modal, the red paper flips over to a cool blue "solution" paper and animates, sliding neatly into a binder labeled "**Valet SOPs & BDTs**".
  * **Contextual Details:** Solutions are drawn directly from the proposal:
      * [cite\_start]**Problem:** "Disorganized Key Basket"[cite: 135]. [cite\_start]**Solution:** "Implement Revised Call-Down Logs & Key Tracking for clear chain of custody"[cite: 183, 185].
      * [cite\_start]**Problem:** "Taxi Congestion on Ramp"[cite: 137]. [cite\_start]**Solution:** "Provide valets with pre-printed cards with QR codes and instructions for taxi drivers"[cite: 84].
      * [cite\_start]**Problem:** "Complex Parking Decisions"[cite: 138, 205]. [cite\_start]**Solution:** "Introduce Binary Decision Trees (BDTs) to guide valets through common scenarios, ensuring consistent, efficient actions"[cite: 143, 207].
  * [cite\_start]**Narration/Key Message:** "By equipping our frontline valets with standardized procedures and simple decision-making tools, we empower them to turn chaos into order, one task at a time"[cite: 133].

#### **Section 3: Manager Layer – The Watchtower**

  * [cite\_start]**Visuals:** The camera pans up to the watchtower, which sits atop a large binder labeled "**Site Operations Bible**"[cite: 16]. The papers from the previous section are now shown sorted into organized stacks within the tower labeled "Training," "Processes," and "Compliance."
  * **Interactions:** Clicking the main binder opens it with a 3D flip effect, revealing tabbed sections. Clicking a tab (e.g., "Performance Management") expands it to show key initiatives.
  * **Contextual Details:**
      * [cite\_start]**Training Tab:** "Develop a formal 2-4 hour initial training program and designate 'Mentor Valets' to ensure consistency, unlike the current 'whoever is working' approach"[cite: 123, 199, 211].
      * [cite\_start]**Processes Tab:** "Mandate the use of Standardized Daily Pass-Down Sheets and Site Audit Checklists to document procedures and hazards"[cite: 180, 188].
      * [cite\_start]**Accountability Tab:** "Implement consistent consequences for lateness and no-shows, which currently often go unaddressed"[cite: 151].
  * [cite\_start]**Narration/Key Message:** "Managers, from their vantage point, use these systems to direct the team, enforce standards, and ensure every valet is operating from the same playbook"[cite: 44, 266].

#### **Section 4: Executive Layer – The Fire-Spotter Plane**

  * **Visuals:** The view shifts to the airplane circling high above. [cite\_start]A sleek, transparent dashboard overlay appears, reminiscent of the prototype software screenshot[cite: 402]. The dashboard displays key metrics.
  * **Interactions:** Clicking on a metric on the dashboard (e.g., "Turnover Costs") drills down into the financial impact and projected improvements. A slider can be used to simulate ROI (e.g., "Invest X in training to save Y on damage claims").
  * **Contextual Details:** The dashboard features quantifiable benefits from the proposal:
      * [cite\_start]**KPI: Revenue Capture:** "Increase daily revenue by over $7 per white ticket through accurate time-stamping procedures"[cite: 103, 241].
      * [cite\_start]**KPI: Damage Claim Costs:** "Reduce costs from incidents like the $7,000 and $7,500 claims by implementing better training and tracking"[cite: 102, 236].
      * [cite\_start]**KPI: Service Credits:** "Minimize revenue loss from comped $75/night parking fees by reducing service failures"[cite: 164, 242].
      * [cite\_start]**KPI: Employee Retention:** "Lower turnover costs, estimated at 33-200% of annual salary per employee, through enhanced training, recognition, and clear career paths"[cite: 235, 257, 260].
  * [cite\_start]**Narration/Key Message:** "From a strategic altitude, the executive team can see the entire picture. This system provides the data to not just spot fires, but to predict and prevent them, securing contracts and driving long-term profitability"[cite: 8, 81, 244].

#### **Section 5: Closing – The Organized Desk & CTA**

  * **Visuals:** The camera returns to a wide shot of the desk, which is now clean and organized. The messy papers are gone, replaced by the neat binders. A tablet on the desk displays the clean dashboard from the executive view. The firefighter, watchtower, and plane figures stand aligned and ready.
  * [cite\_start]**Interactions:** A prominent, glowing button appears: "**Launch Marriott Marquis Pilot**"[cite: 100, 229]. Clicking it brings up a final modal summarizing the projected ROI. An option to export this summary as a PDF is available.
  * [cite\_start]**Contextual Details:** The ROI table clearly states the expected outcomes: "By investing in this phased initiative, ACE can expect significant cost reductions in turnover, damages, and bonuses, while enhancing revenue through improved billing and securing multi-million dollar contracts through superior service delivery"[cite: 36, 101, 102, 103, 234].
  * **Narration/Key Message:** "With clear systems, empowered staff, and data-driven oversight, ACE can transform its operations. Let's prove it, starting with a pilot at the Marriott Marquis."

-----

### **5. Data Management & JSON Schema**

All dynamic content will be driven by a local JSON file to ensure easy updates and offline availability.

  * **JSON Schema:**
    ```json
    {
      "id": "string",
      "section": "enum('valet', 'manager', 'executive')",
      "priority": "number",
      "title": "string",
      "description": "string",
      "impact": "string",
      "solution": "string",
      "paper_image": "string (e.g., 'sticky_note.png')",
      "paper_color": "string (e.g., 'red', 'blue')"
    }
    ```
  * **Sample Entry (based on context):**
    ```json
    {
      "id": "damage-claim-01",
      "section": "valet",
      "priority": 1,
      "title": "$7,500 Damage to Guest Vehicle",
      "description": "On April 25th, a poorly trained valet operating without a binary decision tree for oversized vehicles caused $7,500 in damage to a handicap-accessible van.",
      "impact": "Significant financial loss, negative guest experience, and increased insurance liability.",
      "solution": "Implement mandatory, assessed training with specific modules for vehicle types and a BDT for handling exceptions.",
      "paper_image": "damaged_van_icon.png",
      "paper_color": "red"
    }
    ```
  * **Validation:** A JSON schema linter will be integrated into the CI/CD pipeline (e.g., via GitHub Actions) to prevent data-related errors upon deployment.

-----

### **6. Visual & Animation Framework**

  * **3D Elements:** **Three.js** will be used for the core desk environment and figures. Models will be optimized `.GLTF` format, with a target budget under 500 KB each.
  * **2D Elements:** Papers and UI elements will be lightweight 2D sprites to ensure fast rendering.
  * **Color Transitions:** The core color scheme will transition from chaotic reds and yellows (problems) to calm, organized blues and greens (solutions).
  * **Animation Library:** Animations will be primarily handled with performant **CSS transitions and keyframes**.
      * *Paper Slide:* 200ms ease-out transition.
      * *Modal Fade:* 150ms fade-in/fade-out.
      * *Plane Loop:* 3-second seamless CSS keyframe animation.
      * All animations will respect the `prefers-reduced-motion` media query.

-----

### **7. Interactive Elements**

  * **Click/Tap Handling:** **interact.js** will be utilized to provide a consistent and responsive click/tap experience across all devices.
  * **Binder Interaction:** The binder will use CSS 3D transforms for a realistic flip-open effect. Nesting of expandable sections will be limited to two levels to maintain UI simplicity.
  * **Demo Mode:** A lightweight Finite State Machine (FSM) will be coded in vanilla JS to automate a 30-second sequence of clicks, showcasing the core problem-to-solution flow for a quick, hands-off demonstration.

-----

### **8. Delivery & Export**

  * **PDF Summary:** The client-side library **jsPDF** will be used to generate a one-page PDF summary of the final ROI table for easy sharing with stakeholders.
  * **Feedback Mechanism:** A simple "Provide Feedback" button will link to a pre-filled Google Form or an optional serverless endpoint for capturing stakeholder comments post-presentation.
  * [cite\_start]**Presenter Mode:** The UI can include an optional overlay for the presenter with a timer and JSON-driven cues (e.g., "At 1:00, click the 'Lost Keys' paper to discuss chain of custody" [cite: 135]).

-----

### **9. Scalability & Maintenance**

  * **Brand Customization:** A `config.json` file will allow for easy white-labeling and customization of logos, color schemes, and site-specific metrics for future presentations.
  * **CI/CD Pipeline:** A robust pipeline will be established to:
    1.  Validate JSON schema.
    2.  Check asset sizes against a performance budget (\<1 MB total initial load).
    3.  Run a Lighthouse performance audit (target score: ≥90 mobile, ≥95 desktop).
  * **Version Control:** A standard Git flow will be used, with release tags for major versions (e.g., `v2.0-pilot`).

-----

### **10. Prototyping Roadmap**

  * **Week 1:** **Foundations & Opening Chaos.** Build the 3D desk, load 30+ contextual "problem" papers via JSON, implement 3 clickable modals, and establish the offline cache with the service worker.
  * **Week 2:** **Valet & Manager Layers.** Implement the paper-to-binder filtering animation, create the 3D binder flip effect, and build the expandable sections for manager duties.
  * **Week 3:** **Executive Layer & Closing.** Code the plane loop and the data-driven executive dashboard. Implement the final "Launch Pilot" CTA and the jsPDF export functionality.
  * **Week 4:** **Integration & Polish.** Integrate the Demo and Presenter modes. Refine all responsive breakpoints and conduct cross-device testing.
  * **Week 5:** **Testing & Accessibility Audit.** Focus on performance optimization (target 60 FPS on mid-range devices), bug fixing, and a thorough accessibility audit.

-----

### **11. Stakeholder Engagement & Pilot Simulator**

  * **Interactive Simulators:** To make the pitch more engaging, simple interactive elements will be included in the executive dashboard. For example, a slider control labeled "**Training Investment**" will allow the user to see a live-updating chart that projects a decrease in "**Damage Claim Costs**."
  * [cite\_start]**"The ACE Way" Overlay:** A clickable icon will trigger a pop-up that defines the company's cultural goals: "**VISION**: Situational awareness, career path. **VALUES**: Employees are valued. **TEAM**: Collaboration is essential"[cite: 173].
  * [cite\_start]**Feedback Loop:** An instant feedback form will be embedded to log comments and questions directly after the presentation, demonstrating a commitment to a collaborative process[cite: 267].


  ## Bibliography

  Of course. Here is a bibliography of the sources used to generate the proposal, organized by the source document.

### **Bibliography / Source List**

---

#### **Source Document: `proposal.txt`**

1.  "Problem: Current ACE Parking valet operations face significant systemic challenges."
2.  "While enjoying the core valet work, I have observed significant opportunities to address systemic issues currently contributing to reactive workflows and operational inconsistencies, such as a lack of clear instructions leading to confusion about ramp rules or parking procedures, rates, and billing for different situations."
3.  "Current workflows sometimes tend towards reactivity rather than proactive planning."
4.  "A pilot program at the Marriott Marquis is recommended to validate the approach."
5.  "It is strongly recommended to pilot the Phase 1 components (Daily Sheets, Key Tracking, White Ticket Process, Site Audit Template, Data Tracking Software) and potentially early Phase 2 elements (Initial Training Module draft, basic SOPs) at the Marriott Marquis."
6.  "Call to Action: This proposal seeks collaboration with ACE leadership to launch this improvement initiative, beginning with the recommended pilot program."
7.  "ACE Valet Operations Improvement Proposal…"
8.  "Develop and deploy an Event-Based Data Tracking and Analysis Software solution integrated with Deep Blue or as stand-alone (detailed in Appendix G) to capture, aggregate, and analyze data, transitioning from manual inputs."
9.  "It aims to replace manual tracking limitations and guesswork with objective data, enabling informed decision-making, establishing baseline metrics, supporting the pilot program, and enhancing the overall credibility and measurability of the proposed improvement initiative."
10. "Key financial benefits include reduced expenses from lower turnover (avoiding substantial recruitment/training costs and incidents like a cited $7,000 damage claim from a new hire 2/14/25 and a recent $7500 damage to a handicap vehicle 4/25), fewer damage claims, and minimized overtime/bonus payouts."
11. "Retaining experienced staff also avoids costly mistakes, such as the cited $7,000damage caused by a new hire and $7500 caused by a poorly trained valet without a binary decision tree in place."
12. "Key Handling: Current practices (e.g., reliance on unreliable sticky notes for room numbers to assure proper assignment of charges, disorganized key baskets, lack of full use of call down sheet and key assignment) offer opportunities for standardization to reduce risk, improve efficiency, and ensure a clear chain of custody."
13. "These factors currently impact operational efficiency, contribute to costs (including damages, turnover, and staffing gap bonuses exceeding $3000/month), affect service consistency, and influence employee morale."
14. "Data-driven staffing decisions will minimize overtime and bonus payouts (like the cited >$3000/month example for staffing gaps), further supported by improved attendance."
15. "Implement Revised Call-Down Logs & Key Tracking: Design a new log (paper initially)."
16. "Purpose: Reduce key loss (pinpoint last handler), improve billing, track workload. (See Appendix B)."
17. "Ramp Management: Developing clear, consistent procedures can alleviate congestion (avoiding situations where phones are taken off the hook due to inability to keep up), enhance guest experience, improve safety, and ensure uniform application of rules regarding taxis or double-parking standards."
18. "Parking: Implementing systematic parking strategies (e.g., how, and where to position vehicles, oversized vehicles, organizing by size/location, clear use of overflow areas like PD or Marina Terrace at the Marriott Marquis) holds potential for greater efficiency and reduced risk compared to current, less organized/structured methods."
19. "Document & Implement Standard Operating Procedures (SOPs): Collaboratively develop clear SOPs for key tasks: ramp management (e.g., filling lane 2 first, handling Ubers/deliveries), damage checks, lost ticket procedure, parking methods (e.g., organizing by size, parking next to cars and not leaving open spots, parking compacts under vets on C and D levels/small SUVs opposite side, using C slant effectively)."
20. "Utilize Binary Decision Tree so each decision is preplanned and executed effectively."
21. "Introduce Binary Decision Trees (BDTs): Create simple, visual BDTs for common scenarios (e.g., valet or self-parking?, assistance with luggage or not?, guest reports damage, ramp is full, oversized vehicle arrival – check policy sheet for rates/permissions before calling manager, manager not on duty, etc.)."
22. "A lack of clearly defined, consistently applied procedures presents an opportunity to establish and embed “The ACE Way” across operations, ensuring predictability and quality."
23. "Furthermore, on-site training consistency could be improved. New hires are often paired with available valets (“whoever is working”), which may not ensure consistent knowledge transfer or adherence to best practices."
24. "Develop & Deliver Formal Initial Training Program: Create a 2–4-hour mandatory group in person session/class."
25. "Establish Mentor Program: Formalize pairing new hires with experienced, designated “Mentor Valets” for structured guidance and support during initial weeks."
26. "Implement Standardized Daily Pass-Down Sheets: Create and mandate use at each site."
27. "Develop & Implement Site Audit Checklists/Templates: Create templates for managers to document site specifics: layout (e.g., MM: C Slant, D Flat, PD, Waterfall, Marina Terrace), procedures, hazards, equipment, client rules (e.g., MM: no beanies)."
28. "Implementing clear standards and consistent consequences for attendance and performance issues, such as lateness or no-shows which currently often go unaddressed, can foster a more accountable environment."
29. "This proposal envisions a collaborative effort, leveraging the collective experience within ACE, particularly site managers, to refine and implement solutions (e.g., co-developing revised SOPs and site-specific training materials)."
30. "This is without any access to Deep Blue or any other internal ACE data."
31. "Revenue will be enhanced through improved capture (e.g., accurate hourly billing potentially capturing $7+/ white ticket daily) and reduced losses from service credits."
32. "Accurate time stamping for hourly (“White Ticket”) parking, tracked via the proposed system adjustment, is expected to increase revenue capture significantly (estimated potential of $7+/ticket/day at Marriott Marquis alone)."
33. "Reducing service failures minimizes the need for concessions, such as comped $65/night, recently increased to $75/night, parking."
34. "Data will allow precise measurement and optimization. Fewer service errors and improved overall service quality will lead to reduced revenue loss from fewer requests for comped or credited parking (e.g., $75/night charges)."
35. "Improvements in training, clear expectations, feeling valued, and potential for advancement are expected to increase employee retention, significantly lowering turnover costs associated with recruitment, hiring, onboarding, and lost productivity (industry estimates range from 33% to 2x annual salary)."
36. "Employees gain competence and confidence through better training, operate with clear expectations under fair systems, and feel valued through recognition programs (like Employee of the Month) and supportive management, leading to higher job satisfaction and morale ."
37. "Defined processes and performance metrics can illuminate career advancement pathways (e.g., a valet -> shift lead -> site manager pipeline)."
38. "Perhaps most importantly, delivering consistent, high-quality service strengthens client satisfaction, addressing potential hotel concerns before contract renewals and thereby securing existing major revenue streams ."
39. "Expected ROI & Benefits: This strategic investment is anticipated to yield significant returns through measurable cost reductions and revenue enhancements, projected to far outweigh implementation costs. Key financial benefits include reduced expenses from lower turnover (avoiding substantial recruitment/training costs and incidents like a cited $7,000 damage claim from a new hire 2/14/25 and a recent $7500 damage to a handicap vehicle 4/25), fewer damage claims, and minimized overtime/bonus payouts. Revenue will be enhanced through improved capture (e.g., accurate hourly billing potentially capturing $7+/ white ticket daily) and reduced losses from service credits."
40. "Cost Reduction…"
41. "Define “The ACE Way”: Establish clear company values, proposed as VISION (Situational awareness, career path), VALUES (Employees are valued), TEAM (Collaboration is essential)."
42. "Regular communication and feedback loops, such as roundtables with experienced employees, will be crucial for success and adapting the plan as needed."

---

#### **Source Document: `rant.txt`**

1.  "The TripAdvisor solution to my analogy about firefighting is the firefighter in the forest, putting out the fire in front of him, but not seeing what the man of the tower or the firefighter in the plane can observe I would like a more strategic role within Ace , but I’m concerned with compensation package that would fully compensate me for my contributions one as mentioned above."
2.  "I definitely have strong opinions about where I think that the things need to be done and how they need to be done, but I understand that I need to work Structure and existing systems now I That’s where my existing information value constant being the firefighter fighting the fire, and then the future value would come from me being in the plane, but there would be an intermediary step with somebody in the tower that would be executing the plan that I would not be responsible for that’s the difficulty in the complications in what I’m suggesting As an example, I’m…"
3.  "Note to self integrate Hakeem‘s comments about showing up on Friday morning and six new valets with little no training experience coming straight from the ““ new training program that has been implemented at a since January were completely useless. Didn’t know how to write tickets had no idea how things functioned just basic level skills that were not Assessed so they may have gone through training, but nobody assessed whether they are actually proficient at their jobs in order to be placed on a front line."
4.  "I’m not sure if I’ll be able to make a direct correlation between increase revenue or decrease cost, especially without having information and data related to existing cost like hiring cost per employee number of tickets written at each site length of service on average for each valet, turnover rates and things like that, but if Ace continues with the Current policies and procedures in place I can with a high level of certainty predict that service will deteriorate, and the ongoing issues will only be exacerbated. I’m not so arrogant to think that I can change this by myself, but…"
5.  "…if they need directions or they’re waiting for something pull down the ramp into lanes two and three put a QR code in it and have that link to something with multiple languages and then the valet could give the card out and he could have a list that he writes on his card that has the cab number so that they’ve been notified."
6.  "…binder 180 days first first year week by week end of the year had a binder then I could assess at the end of each day the lesson and then ascend at the end of the year which lessons need to be fixed and then by the end of year two the binder was perfect."
7.  "…sure there are dozens of standard operating procedure sheets that are inexistence right now obviously from some of the examples I have shown those are not included in that but a lot of it is execution on that and then some kind of system to be able to check compliance and to help assist the managers and the values to execute their job to the best of their ability and then away to track those that do and reward those and then to penalize or to diminish the ones who don’t either with new assignments or different responsibilities."
8.  "This leads to a situation where contracts are lost and there is not a direct correlation made to the line employee, which is actually the root cause of some of the issues I believe."
9.  "…guest experience, like the grant or the Hyatt or the Pendry or the marquee this cannot be qualified directly in an ROI situation."
10. "…value of this is not to be understated Even the explanation to how to label the cards for the convention center wasn’t done in a thoughtful way."