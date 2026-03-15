# CausalMe — Complete UX Flows

> Personal causal inference engine. Connect your life data, ask "what if?" and see predicted ripple effects.

---

## Table of Contents

1. [Sign Up / Log In](#1-sign-up--log-in)
2. [Onboarding Walkthrough](#2-onboarding-walkthrough)
3. [Core First-Time Use Flow](#3-core-first-time-use-flow)
4. [Returning User Experience](#4-returning-user-experience)
5. [Settings / Profile Management](#5-settings--profile-management)
6. [Subscription / Upgrade Flow](#6-subscription--upgrade-flow)
7. [Sharing / Social Features](#7-sharing--social-features)
8. [Notifications & Re-engagement](#8-notifications--re-engagement)
9. [Account Deletion & Data Export](#9-account-deletion--data-export)
10. [Error States, Empty States, Loading States](#10-error-states-empty-states-loading-states)
11. [Mobile vs Desktop Considerations](#11-mobile-vs-desktop-considerations)

---

## 1. Sign Up / Log In

### 1.1 Landing Page

**Screen: Hero**
- Dark background with animated causal graph: glowing nodes (sleep, mood, productivity, money) connected by flowing lines that pulse when hovered
- Headline: **"What if you could see the ripple effects of every decision?"**
- Subhead: "CausalMe connects your health, finances, calendar, and mood to build a living model of your life. Ask any 'what if' and see what happens."
- CTA: `Start Free` (primary, large)
- Secondary: `See How It Works` → scrolls to demo
- Trust strip: "256-bit encryption · Your data never trains our models · SOC 2 compliant"

**Interactive Demo (Below Fold):**
- Embedded mini causal graph with fake data
- Pre-loaded question: "What if I slept 1 hour more?"
- User can tap `See Effect` → graph animates: Sleep node pulses → ripples to Mood (+12%), Energy (+18%), Productivity (+9%), Spending (-3%)
- After demo: "This is fake data. Imagine this with YOUR life." + `Create Your Graph`

### 1.2 Auth Flow

**Screen: Sign Up**
- Headline: **"Create your CausalMe account"**
- `Continue with Google` (top, recommended — many integrations use Google)
- Divider "— or —"
- Email field + `Continue` → verification code → password creation
- "Already have an account? `Log in`"
- Terms + Privacy footer

**Google OAuth:**
- Scopes: email, profile
- On success → Onboarding
- Additional Google scopes (Calendar, Fit) requested later during data connection

**Email Flow:**
- Email → 6-digit code (resend after 30s) → password (8+ chars) → Onboarding

**Log In:**
- Google / Email+Password
- `Forgot Password` → email code → reset
- Biometric login on mobile (Face ID / fingerprint) after first login

### 1.3 Edge Cases

| Scenario | Behavior |
|---|---|
| Email exists with Google | "This email uses Google sign-in. `Continue with Google`" |
| Under 18 | Age gate during onboarding: "CausalMe requires users to be 18+. We process sensitive health and financial data." |
| VPN/unusual location | No block, but: "We detected an unusual login location. Is this you?" + verification code |

---

## 2. Onboarding Walkthrough

### 2.1 Welcome (Screen 1 of 5)

**Screen: Welcome to CausalMe**
- Animated illustration: a life graph assembling itself node by node
- Headline: **"Let's build your life graph."**
- Body: "We'll connect your data sources and start finding the hidden patterns in your life. The more you connect, the more accurate your predictions."
- `Let's Go` (primary)
- `Skip Setup — I'll connect later` (goes to empty dashboard)
- Progress: 5 steps shown

### 2.2 Connect Health (Screen 2 of 5)

**Screen: Health & Body**
- Headline: **"Start with your body."**
- Body: "Sleep, heart rate, steps, workouts — your body data is the foundation of your graph."

**Integration cards (tap to connect):**

| Source | Icon | Data | Status |
|---|---|---|---|
| Apple Health | ❤️ | Sleep, steps, heart rate, workouts, HRV | `Connect` |
| Google Fit | 🟢 | Sleep, steps, heart rate, workouts | `Connect` |
| Fitbit | ⌚ | Sleep, steps, heart rate, stress | `Connect` |
| Oura Ring | 💍 | Sleep, readiness, activity, HRV | `Connect` |
| Whoop | 🔴 | Strain, recovery, sleep | `Connect` |
| Garmin | 🏃 | All fitness data | `Connect` |
| Manual Entry | ✏️ | Log sleep, exercise manually | `Set Up` |

**On tapping `Connect`:**
1. OAuth flow for the selected service
2. Permission screen showing specific data requested
3. On success: card shows ✓ Connected, with data preview: "Last 90 days: 847 sleep records, 2,341 activity records"
4. On failure: "Couldn't connect to [service]. `Try Again` / `Skip`"

- "Connect at least one health source for the best experience."
- `Continue` (enabled even with 0 connections, but shows: "Your graph will be limited without health data")

### 2.3 Connect Finances (Screen 3 of 5)

**Screen: Money & Spending**
- Headline: **"Add your financial picture."**
- Body: "See how spending, income, and financial stress connect to your mood and health."

**Integration cards:**

| Source | Data | Status |
|---|---|---|
| Plaid (Bank accounts) | Transactions, balances, income | `Connect via Plaid` |
| Manual Budget | Monthly income/expenses categories | `Set Up` |

**Plaid Flow:**
1. Tap `Connect via Plaid` → Plaid Link modal opens
2. User selects their bank → credentials → account selection
3. On success: "Connected: [Bank Name] — 3 accounts" + transaction count
4. On failure: Plaid error handling (bank not supported / wrong credentials / MFA required)

**Privacy reassurance (prominent):**
- "CausalMe uses Plaid to securely read your transactions. We never store your banking credentials. We categorize spending patterns — we never see individual merchant names in your graph."
- `What data do we access?` expandable FAQ

- `Continue` / `Skip — I'll add this later`

### 2.4 Connect Calendar & Mood (Screen 4 of 5)

**Screen: Time & Mind**
- Headline: **"How you spend your time. How you feel about it."**

**Calendar Integration:**
| Source | Status |
|---|---|
| Google Calendar | `Connect` (OAuth) |
| Apple Calendar | `Connect` (system permission) |
| Outlook | `Connect` (OAuth) |

- Data used: meeting count, meeting duration, free time blocks, event categories
- "We read event titles to categorize (work/social/exercise) but never store full event details."

**Mood Tracking:**
- "CausalMe includes a built-in mood tracker, or connect an existing one."
- Options:
  - `Use CausalMe Mood Tracker` — quick daily check-in (explained later)
  - `Connect Daylio` (API integration)
  - `Connect Apple Health mood data`
  - `Skip mood tracking`

- If CausalMe tracker selected: "We'll ask you once a day — takes 5 seconds."
- `Continue`

### 2.5 Processing & First Graph (Screen 5 of 5)

**Screen: Building Your Graph**
- Animated visualization: nodes appearing one by one, connections forming between them
- Progress stages:
  - ✓ Importing health data (2,341 records)
  - ✓ Importing financial data (1,847 transactions)
  - ✓ Importing calendar data (340 events)
  - ◻ Running causal inference
  - ◻ Building your graph
- "This usually takes 1-3 minutes depending on how much data you connected."
- Fun facts: "Did you know? Most people's sleep quality is causally linked to their spending patterns — not the other way around."
- No back button, `Cancel` at bottom

**On completion:**
- Graph reveal animation: dark screen, then nodes light up one by one, connections flow between them
- Headline: **"Your life, connected."**
- Mini stats: "12 nodes · 34 connections · 90 days of data"
- `Explore Your Graph` (primary CTA)
- `Take the Tour` (secondary — guided walkthrough of the graph)

---

## 3. Core First-Time Use Flow

### 3.1 Graph Explorer (Main Screen)

**Screen: Your Causal Graph**
- Full-screen interactive graph visualization
- **Nodes** (circles of varying size based on data density):
  - 😴 Sleep (duration, quality, timing)
  - ❤️ Heart Rate / HRV
  - 🏃 Exercise (type, duration, intensity)
  - 😊 Mood (if tracking)
  - 💰 Spending (categories)
  - 💵 Income
  - 📅 Meetings (count, duration)
  - ⏰ Free Time
  - 🧘 Stress (derived from HRV + behavior)
  - ⚡ Energy (derived from activity + sleep)
  - 📊 Productivity (derived from calendar + behavior)
  - ☕ Caffeine (if logged)
- **Connections** (lines between nodes):
  - Thickness = strength of causal relationship
  - Color: green = positive effect, red = negative effect
  - Arrow direction = causal direction
  - Tap a connection to see: "Sleep quality → Mood: +0.34 (strong positive)"

**Controls:**
- Pinch to zoom, drag to pan
- Tap node to focus (highlights its connections, dims others)
- Bottom sheet (draggable): node details when selected
- Top bar: `Ask What If` button (prominent, glowing)
- Filter chips: Health / Finance / Time / All
- Time range: 7d / 30d / 90d / All

### 3.2 First-Time Tour (Optional)

**Triggered by `Take the Tour` or auto-prompted on first graph visit**

Step-by-step overlay tour (6 steps):

1. **"This is your causal graph."** — highlights full graph. "Each circle is a part of your life. Each line is a cause-and-effect relationship we've discovered in your data."

2. **"Tap any node."** — prompts user to tap Sleep node. On tap: "This is your sleep data. Tap connections to see how sleep affects other areas."

3. **"See the connections."** — highlights Sleep → Mood connection. "Thicker lines = stronger effects. Green = positive. Red = negative."

4. **"Ask 'What If?'"** — highlights the What If button. "This is the magic. Ask any question about changing your life and see the predicted ripple effects."

5. **"Try it now."** — pre-loads "What if I slept 1 hour more?" in the What If input. User taps `Simulate` → graph animates with predictions.

6. **"Your graph gets smarter."** — "The more data you add and the longer you use CausalMe, the more accurate your predictions become. Log your mood daily for the biggest improvement."

`Done` → dismisses tour

### 3.3 What-If Simulation (Core Feature)

**Trigger:** `Ask What If` button or natural language input

**Screen: What If — Input**
- Slide-up panel from bottom (mobile) or right panel (desktop)
- Headline: **"What if…"**
- Natural language input: placeholder "e.g., I slept 1 hour more, I quit coffee, I exercised 3x per week"
- **Quick suggestions** (tappable chips based on user's data):
  - "I slept 1 hour more"
  - "I cut spending by 20%"
  - "I had no meetings on Fridays"
  - "I exercised every morning"
  - "I quit coffee" (if caffeine node exists)
- Parsed input shown below: "Simulate: **Sleep duration +1 hour/night**" (with edit option for precision)

**Screen: What If — Simulation Running**
- Graph nodes pulse outward from the changed node
- Ripple animation: sleep node changes → connected nodes update sequentially
- Each affected node shows a delta: "+12%" or "-$45/mo"
- Timeline: "Predicted effects over 30 / 90 / 180 days" slider

**Screen: What If — Results**
- Graph settled in new state with all deltas visible
- Summary card below graph:

```
What if you slept 1 hour more per night?

Predicted effects (90 days):
  😊 Mood         +12% improvement
  ⚡ Energy        +18% improvement  
  📊 Productivity  +9% improvement
  💰 Spending      -3% (fewer impulse purchases)
  ❤️ Resting HR    -4 bpm
  🏃 Exercise      +15% more likely to work out
  😰 Stress        -8% reduction

Confidence: Medium-High (based on 90 days of data)
```

- `Save This Simulation` button
- `Try Another` button
- `Share Results` button
- `How is this calculated?` expandable: explains causal inference methodology in plain language

**Pro-only features in simulation:**
- Extended timeframes (180d, 1yr)
- Multi-variable simulations ("Sleep +1hr AND quit coffee")
- Confidence intervals with ranges
- Historical backtesting: "If you had done this 6 months ago, here's what would have changed"

### 3.4 Mood Check-In (Daily Micro-Interaction)

**Trigger:** Push notification once daily at user-selected time (default: 8 PM)

**Screen: How are you feeling?**
- Five emoji faces in a row: 😫 😕 😐 🙂 😊
- Tap one → optional: "Anything specific?" with quick tags: Work / Relationships / Health / Money / Sleep / Exercise / Weather / Nothing specific
- `Done` (auto-closes in 3 seconds after selection)
- Total interaction time: 3-5 seconds

**If user misses check-in:**
- No second notification that day
- Next day shows: "We missed you yesterday. Consistent mood data = better predictions."
- After 7 missed days: "Mood tracking paused. `Resume`"

---

## 4. Returning User Experience

### 4.1 Daily Dashboard (Home Screen)

**Screen: Today**
- **Today's snapshot:**
  - Mood (if logged): emoji + "You felt 🙂 yesterday"
  - Sleep: "7h 23m · 82% quality" (from wearable)
  - Activity: "6,400 steps · No workout logged"
  - Meetings: "3 meetings today (2.5 hours)"
  - Spending: "$34 today · $847 this month"

- **Daily insight card** (AI-generated, rotates):
  - "Your mood tends to drop on days with 3+ hours of meetings. Today has 2.5 hours — you're right on the edge."
  - "You slept 45 minutes less than usual last night. Historically, this leads to a 15% mood dip by evening."
  - "Your spending is 12% under your monthly average. When you're under budget, your stress scores are 8% lower."

- **Quick What If:** abbreviated input bar always visible: "What if…" placeholder

- **Graph preview:** mini version of the causal graph, tap to expand full-screen

- **Notification: Mood check-in** reminder if not yet logged today

### 4.2 Weekly Report (Monday Push Notification)

**Screen: Your Week in Review**
- Headline: **"Week of March 8-14"**
- **Key metrics (cards):**
  - Average mood: 🙂 (3.8/5) — +0.2 from last week
  - Sleep: 7h 12m avg — stable
  - Exercise: 4 sessions — +1 from last week
  - Spending: $612 — -$89 from last week
  - Meetings: 14 hours — +2 from last week

- **Weekly insight:**
  - "This week, your exercise sessions correlated with better sleep the following night (r=0.72). This is a new causal link in your graph."
  - "Your spending dropped this week, which coincided with lower stress and better sleep. Your graph suggests these are genuinely connected, not just coincidence."

- **Graph changes:**
  - "1 new connection discovered: Exercise → Sleep quality (strong positive)"
  - "1 connection strengthened: Meetings → Stress"

- `Explore Full Graph` / `Run a Simulation`

### 4.3 Long-Term Evolution (Month 2+)

**Graph maturation signals:**
- Nodes gain confidence rings (thicker = more data = more reliable)
- New connections appear with "NEW" badge
- Connections that don't hold up fade and are removed: "We removed Caffeine → Productivity (insufficient evidence)"
- Milestone: "Your graph now has 30 days of data. Prediction confidence increased by 40%."
- 90-day milestone: "Your graph is now highly personalized. Predictions are based on YOUR patterns, not population averages."

**Seasonal patterns (6+ months):**
- "We detected seasonal patterns in your mood. You tend to score 15% lower in November-January."
- "Your exercise frequency drops 30% in winter. This appears to cause a mood decline 2 weeks later."

---

## 5. Settings / Profile Management

### 5.1 Settings Hub

**Screen: Settings** (accessed via profile icon or tab)

**Account**
- Name, email, avatar
- Password change
- Connected accounts (Google)
- `Delete Account`

**Data Sources**
- List of all connected integrations with status:
  - Apple Health: ✓ Connected · Last sync: 2 min ago · `Disconnect`
  - Plaid (Chase): ✓ Connected · Last sync: 1 hour ago · `Disconnect` / `Reconnect`
  - Google Calendar: ✓ Connected · `Disconnect`
  - Mood Tracker: Active · `Pause` / `Change Time`
- `+ Connect New Source` button
- Sync frequency: Real-time (wearables) / Hourly (Plaid) / On change (Calendar)
- Manual sync: `Sync All Now`

**Graph Settings**
- Time range default: 30d / 90d / All
- Minimum confidence threshold: slider (show only connections above X% confidence)
- Node visibility: toggle individual nodes on/off
- `Reset Graph` — deletes all causal analysis, re-runs from raw data (destructive, confirm required)

**Mood Tracker**
- Check-in time: time picker (default 8 PM)
- Check-in notification: on/off
- Include tags: on/off
- History: view/edit past entries

**Notifications**
- Daily insight: on/off + time
- Weekly report: on/off + day
- Mood check-in reminder: on/off
- New discovery alerts: on/off
- Marketing emails: on/off
- Quiet hours: time range

**Appearance**
- Theme: System / Light / Dark
- Graph style: Default / Minimal / Vibrant
- Colorblind mode: on/off (changes red/green to blue/orange)
- Reduce motion: on/off (static graph instead of animated)

**Privacy**
- Data processing: "All causal inference runs on our servers using encrypted data. Raw data is encrypted at rest and in transit."
- `What data do we store?` → detailed breakdown
- Third-party sharing: "Never. Your data is never sold or shared."
- `Export My Data` / `Delete All Data`

**Subscription**
- Plan details + billing
- `Manage Subscription`

---

## 6. Subscription / Upgrade Flow

### 6.1 Tier Structure

**Free:**
- Connect up to 3 data sources
- Basic causal graph (limited to 8 nodes)
- 3 What-If simulations per month
- 30-day data window
- Weekly report

**Pro — $15/month ($12/mo annual):**
- Unlimited data sources
- Full causal graph (unlimited nodes)
- Unlimited What-If simulations
- Multi-variable simulations
- Historical backtesting
- 1-year data window
- Daily + weekly insights
- Export simulations
- Priority model training
- API access (for personal dashboards)

### 6.2 Upgrade Triggers

1. **Trying to connect 4th data source (Free):** "Upgrade to Pro for unlimited connections." + `Upgrade` / `Choose which 3 to keep`
2. **4th What-If simulation in a month:** "You've used your 3 simulations this month. `Upgrade for unlimited` or wait until [date]."
3. **Tapping Pro-only feature** (multi-variable, backtesting): lock icon + "Pro feature" badge + `Upgrade`
4. **Viewing graph with 8+ nodes possible:** "Your data supports 12 nodes, but Free shows 8. `See your full graph with Pro`"
5. **Soft banner on dashboard** (dismissible, shows 1x/week)

### 6.3 Upgrade Screen

**Screen: Upgrade to Pro**
- Headline: **"See your full picture."**
- Current usage stats: "You've made 3 simulations this month. With Pro, make unlimited."
- Side-by-side comparison table (Free vs Pro)
- Personalized: "With your data, Pro would unlock 4 additional nodes and 12 more causal connections."
- Graph preview: left=Free (sparse), right=Pro (full, vibrant)
- `Start 7-Day Free Trial` (primary)
- "Then $15/month. Cancel anytime."
- `$12/mo billed annually` toggle
- `Maybe Later`

### 6.4 Payment

- Apple Pay / Google Pay / Stripe card form
- `Start Free Trial` → success: "Welcome to Pro! Your full graph is loading…" + graph animates, new nodes appearing
- On failure: inline error + retry

### 6.5 Cancellation

1. Settings → Subscription → `Cancel`
2. **Personalized retention:**
   - "In the last month, CausalMe discovered 3 new patterns in your life and you ran 12 simulations."
   - "If you cancel, your graph will be limited to 8 nodes and 3 simulations/month."
   - Reason selection (too expensive / not useful / privacy concerns / other)
3. If "too expensive" → offer annual ($12/mo)
4. `Confirm Cancel` → "Pro features active until [date]. Your data is preserved."

---

## 7. Sharing / Social Features

### 7.1 Share a Simulation

**From What-If results → `Share Results`**
- Generates a styled card:
  - "What if I slept 1 hour more?" + key effect deltas
  - Mini graph visualization
  - CausalMe branding
  - **No personal data** — only the question + predicted percentages
- Share targets: native share sheet / copy image / copy link
- Shared link: interactive mini-simulation on causalme.com (no account needed to view)

### 7.2 Share an Insight

**From daily/weekly insight → share icon**
- Same styled card format
- "CausalMe discovered: My exercise causally improves my sleep quality by 23%."
- No raw data exposed

### 7.3 Compare with Friends (V2 — Opt-In)

- "Want to see how your graph compares?"
- Invite a friend → both opt in → see anonymized comparison:
  - "Your sleep affects your mood more than 78% of CausalMe users."
  - "Your exercise-to-productivity connection is unusually strong."
- No raw data shared — only relative comparisons

### 7.4 Referral Program

- "Give a friend 1 month of Pro. Get 1 month when they subscribe."
- Referral link + tracker
- Share via Messages, Email, Copy Link

---

## 8. Notifications & Re-engagement

### 8.1 Notification Schedule

| Notification | Channel | Frequency | Copy |
|---|---|---|---|
| Mood check-in | Push | Daily at set time | "How are you feeling? Quick check-in 😊" |
| Daily insight | Push | Daily (AM, if enabled) | "Your sleep and spending are connected in a surprising way. `See Insight`" |
| Weekly report | Push + Email | Monday AM | "Your week in data: mood up 8%, sleep stable, new pattern found. `View Report`" |
| New causal link discovered | Push | When detected | "🔗 New discovery: Your meeting load causally affects your exercise frequency." |
| Simulation suggestion | Push | 2x/week max | "You haven't simulated 'what if I exercised more?' yet. Your data suggests interesting effects. `Try It`" |
| Data source disconnected | Push + Email | On disconnect | "Your Fitbit connection was lost. `Reconnect` to keep your graph current." |
| Milestone | Push | On achievement | "🎉 Your graph hit 90 days of data! Prediction confidence just jumped 40%." |
| Trial ending | Push + Email | Day 5, 7 | "Your trial ends in 2 days. You've discovered 8 causal links in your life." |

### 8.2 Re-engagement (Lapsed Users)

**7 days inactive:**
- Push: "Your graph misses you. 7 days of mood data = better predictions."

**30 days inactive:**
- Email: "Your life didn't stop — your graph shouldn't either. We've been running in the background. Come see what changed." + personalized stat from passive data

**90 days inactive:**
- Email: "It's been a while. Your graph has 3 months of data waiting to be explored. `Pick up where you left off`"

### 8.3 Notification Preferences

- Full control per notification type (on/off)
- Quiet hours
- "Maximum 3 notifications per day" hard cap
- "Mute for 1 week" quick action

---

## 9. Account Deletion & Data Export

### 9.1 Data Export

**Settings → Privacy → `Export My Data`**

**Export options:**
1. **Full export (ZIP):**
   - `health_data.json` (all imported health records)
   - `financial_data.json` (categorized transactions — no raw bank data)
   - `calendar_data.json` (event summaries)
   - `mood_log.json` (all mood entries)
   - `causal_graph.json` (nodes, connections, confidence scores)
   - `simulations.json` (all saved What-If results)
   - `insights.json` (all generated insights)
   - `account.json` (profile, settings, subscription history)

2. **Graph-only export:**
   - `causal_graph.json` + `causal_graph.svg` (visual)
   - For users who want to analyze their graph externally

3. **CSV option:** all data as CSV files instead of JSON

- Processing: "Preparing your export…" (usually <2 minutes)
- Download link emailed + available in-app for 7 days

### 9.2 Account Deletion

1. Settings → Account → `Delete Account`
2. **Screen: Delete Account**
   - "Deleting your account permanently removes:"
   - All health, financial, calendar, and mood data
   - Your entire causal graph and all simulations
   - Your account and subscription
   - Connected integrations will be disconnected
   - "This cannot be undone."
   - `Export My Data First` (secondary)
   - `Delete My Account` (red)
3. **Third-party data note:** "Deleting CausalMe does not delete data at Plaid, Apple Health, or other connected services. Manage those separately."
4. Re-authenticate (password or Google)
5. Type "DELETE" to confirm
6. On deletion: logged out, data queued for deletion within 30 days, confirmation email sent
7. Plaid tokens revoked immediately, other OAuth tokens revoked

---

## 10. Error States, Empty States, Loading States

### 10.1 Loading States

| Context | Treatment |
|---|---|
| App launch | Splash: CausalMe logo + graph animation (max 2s) |
| Initial graph building | Full-screen: animated graph assembling with staged progress (1-3 min) |
| What-If simulation | Graph nodes ripple outward from source, deltas appear sequentially (2-5s) |
| Data sync | Subtle spinner on data source card. "Syncing…" |
| Weekly report generating | "Crunching your week…" with mini graph animation (3-5s) |
| Dashboard loading | Skeleton: shimmer cards for insights, grey circles for graph preview |
| Export preparing | Progress bar + "Packaging your data…" |

### 10.2 Empty States

| Context | Empty State |
|---|---|
| Dashboard — no data connected | Illustration: empty graph outline with dotted nodes. "Your graph is waiting for data." + `Connect Your First Source` CTA |
| Graph — too little data (<7 days) | Graph shows nodes but connections are dotted/faded. "CausalMe needs at least 7 days of data to find reliable patterns. Keep logging!" + progress: "Day 3 of 7" |
| What-If — no simulations saved | "No saved simulations yet." + `Ask Your First What If` |
| Mood log — no entries | "No mood data yet. Daily check-ins unlock the most powerful insights." + `Log Your Mood Now` |
| Insights — none generated | "Insights appear as CausalMe discovers patterns. Usually takes 5-7 days." |
| Financial data — Plaid not connected | Finance node shown as outline/ghost: "Connect your bank to add financial patterns to your graph." + `Connect via Plaid` |
| Simulation results — low confidence | "⚠️ Low confidence prediction. CausalMe needs more data for reliable results on this question. Keep logging for 2 more weeks." |

### 10.3 Error States

| Error | Treatment |
|---|---|
| Network offline | Top banner (yellow): "You're offline. Your graph shows cached data. Simulations require connection." |
| Plaid connection lost | Dashboard card (orange): "Bank connection lost. Reconnect to keep financial data flowing." + `Reconnect` |
| Wearable sync failed | "Couldn't sync with [device]. Check that [app] is running and has permissions." + `Retry` / `Troubleshoot` |
| Simulation failed | "Couldn't run this simulation. The question may be too complex for your current data." + `Simplify Question` / `Try Different Question` |
| Graph build failed | "Something went wrong building your graph. We're looking into it." + `Retry` / `Contact Support` |
| Payment failed | Banner: "Payment issue. Update your card to keep Pro features." + `Update Card` |
| Server error | Full-screen: illustration of tangled graph. "Something went wrong on our end." + `Try Again` / `Contact Support` |
| Data import error (partial) | "We imported 1,847 of 2,100 records. 253 records had formatting issues and were skipped. `View Details`" |
| Rate limit on Plaid | "Your bank is temporarily limiting data access. We'll retry in 1 hour." (auto-retry, no user action needed) |
| Calendar permission revoked | "Google Calendar access was revoked. `Reconnect` to keep calendar data in your graph." |
| Mood streak broken (7+ days missed) | Gentle: "We haven't heard from you in a while. Your mood data has a gap. `Log Today's Mood`" (not an error, but a recovery prompt) |

---

## 11. Mobile vs Desktop Considerations

### 11.1 Platform Strategy

CausalMe is **mobile-first for daily use, desktop-enhanced for deep exploration**.
- Mobile: mood logging, daily insights, quick simulations, push notifications
- Desktop: full graph exploration, complex simulations, weekly reports, settings management

### 11.2 Mobile App (iOS + Android)

**Tab Bar Navigation:**
1. **Today** — daily dashboard, snapshot, daily insight
2. **Graph** — full interactive causal graph (touch-optimized)
3. **What If** — simulation input + history
4. **You** — profile, settings, data sources

**Mobile-Specific Interactions:**
| Feature | Mobile Treatment |
|---|---|
| Graph | Full-screen, pinch zoom, tap nodes, force-touch for details. Simplified view (fewer labels) with expand on tap. |
| What If | Bottom sheet slides up with input. Results overlay on graph. |
| Mood check-in | Push notification → tap → in-notification quick response (iOS) or full-screen 5-emoji picker |
| Daily insight | Card on Today tab + push notification. Swipe to dismiss. |
| Data sources | Simplified list. Wearable connections via health app permissions (system dialog). |
| Weekly report | Scrollable card stack. Tap to expand sections. |
| Simulation results | Vertical scroll: graph at top (animated), summary cards below |

**iOS Specific:**
- Apple Health integration (native, no OAuth needed — system permission dialog)
- HealthKit background delivery for real-time sync
- Widgets: Today's mood + focus metric (small), Graph preview + insight (medium), Full daily snapshot (large)
- Live Activities: none (not applicable)
- Haptics: light tap on mood selection, medium on simulation complete
- Face ID for app lock (optional, in Settings)

**Android Specific:**
- Google Fit integration (OAuth)
- Health Connect API support
- Material You dynamic theming
- Widgets: similar to iOS
- Notification channels: Insights, Mood Reminders, System Alerts
- Glance widgets for Wear OS (mood quick-log)

### 11.3 Desktop Web App

**Layout:**
- Left sidebar: Today / Graph / What If / Insights / Settings
- Main content area: wide, data-dense

**Desktop-Specific:**
| Feature | Desktop Treatment |
|---|---|
| Graph | Large canvas. Mouse hover for node details. Click + drag to rearrange. Scroll to zoom. Much more detail visible. Connection labels always shown. |
| What If | Side panel. Graph + results visible simultaneously. Multi-variable input with sliders. |
| Simulation comparison | Side-by-side: two simulations compared on the same graph |
| Weekly report | Full-page layout with expandable sections, charts, and historical comparisons |
| Data management | Table views for raw data. Sort, filter, search. Bulk edit mood entries. |
| Export | Full export options. CSV/JSON/SVG toggle. |

**Keyboard Shortcuts:**
- `/` — open What If input
- `G` — focus graph
- `T` — go to Today
- `M` — log mood
- `Esc` — close panels

### 11.4 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| < 640px | Mobile — bottom tab bar, single column, simplified graph |
| 640-1024px | Tablet — bottom tab bar, wider cards, medium graph |
| > 1024px | Desktop — left sidebar, multi-panel, full graph |

### 11.5 Offline Behavior

- **Mobile:** cached Today view + recent insights viewable offline. Mood check-in queued for sync. Graph viewable but not simulatable.
- **Desktop:** same as mobile. Simulations require connection.
- **Sync:** all data syncs when connection restored. Mood entries timestamped to original entry time, not sync time.

---

## Appendix: Causal Graph Node Reference

### Default Nodes (appear based on connected data)

| Node | Source | Derived From |
|---|---|---|
| Sleep Duration | Wearable | Direct measurement |
| Sleep Quality | Wearable | HRV + movement + cycles |
| Resting Heart Rate | Wearable | Direct measurement |
| HRV | Wearable | Direct measurement |
| Steps | Wearable | Direct measurement |
| Exercise | Wearable | Workout detection |
| Mood | CausalMe / Daylio | User-logged |
| Energy | Derived | Sleep + activity + HRV |
| Stress | Derived | HRV + meeting load + behavior |
| Productivity | Derived | Calendar free time + app usage patterns |
| Total Spending | Plaid | Aggregated transactions |
| Discretionary Spending | Plaid | Categorized non-essential |
| Income | Plaid | Deposit detection |
| Meeting Load | Calendar | Count + duration |
| Social Time | Calendar | Event categorization |
| Free Time | Calendar | Unscheduled blocks |
| Caffeine | Manual log | User-entered |
| Alcohol | Manual log | User-entered |
| Screen Time | OS integration | System-reported |
| Weather | Location | Auto-fetched (temperature, sunlight hours) |

### Example Causal Connections

| From | To | Typical Direction | Example |
|---|---|---|---|
| Sleep Duration | Mood | Positive | +1hr sleep → +12% mood |
| Exercise | Sleep Quality | Positive | Workout → +15% sleep quality (next night) |
| Meeting Load | Stress | Positive | +2hrs meetings → +18% stress |
| Stress | Discretionary Spending | Positive | +10% stress → +8% impulse spending |
| Caffeine | Sleep Quality | Negative (delayed) | Afternoon coffee → -10% sleep quality |
| Weather (sunlight) | Mood | Positive | +2hrs sunlight → +5% mood |
| Free Time | Exercise | Positive | +1hr free time → +20% workout likelihood |

---

## Appendix: Microcopy Reference

### What-If Suggestions (Rotating, Personalized)
- "What if I went to bed 1 hour earlier?"
- "What if I had no meetings on Wednesdays?"
- "What if I cut alcohol for a month?"
- "What if I exercised before work instead of after?"
- "What if I reduced my subscriptions by $50/month?"
- "What if I walked 10,000 steps daily?"
- "What if I meditated every morning?"

### Insight Copy Patterns
- "Your [X] causally affects your [Y] by [Z]%."
- "On days with [condition], your [metric] is [delta]% [better/worse]."
- "This week, [metric] improved. Your graph suggests [cause] is the reason."
- "Warning: your [metric] has been declining for [N] days. Your graph links this to [cause]."

### Onboarding Reassurance Copy
- "We never sell your data. Ever."
- "Your bank credentials are handled by Plaid — we never see them."
- "All data is encrypted in transit and at rest."
- "You can delete everything at any time."

### Empty State Encouragement
- "Every data point makes your graph smarter."
- "Day 3 of 7 — patterns emerging soon."
- "Your graph is growing. Come back tomorrow for your first insight."
