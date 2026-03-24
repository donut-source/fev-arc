# Pest Control Business — Data & Analytics Plan
### Crawl → Walk → Run Roadmap

**Audience:** Small business owner + low-to-moderate skill contractor
**Primary systems:** FieldRoutes (CRM/ops) · CallTrackingMetrics (marketing)
**Goal:** Fast time-to-value, no overengineering

---

## Table of Contents

1. [Crawl Phase (0–30 days)](#1-crawl-phase-030-days)
2. [Walk Phase (30–90 days)](#2-walk-phase-3090-days)
3. [Run Phase (90+ days)](#3-run-phase-90-days)
4. [Instructions for a Low-Tech Contractor](#4-instructions-for-a-low-tech-contractor)
5. [Security Note — Protecting API Keys](#5-security-note--protecting-api-keys)

---

## 1. Crawl Phase (0–30 days)

**Goal:** Get FieldRoutes data into a simple dashboard. Prove value fast.

---

### Recommended Stack

| Layer | Tool | Why |
|---|---|---|
| Data extraction | Make (formerly Integromat) | Visual, no-code, handles REST APIs |
| Storage | Google Sheets | Free, shareable, zero setup |
| Dashboard | Looker Studio (free) | Connects directly to Sheets, drag-and-drop |
| Backup option (storage) | Airtable | If Sheets gets messy; better for relational data |

**Total estimated cost:** $10–20/month (Make paid plan)

---

### Architecture (Plain English)

```
FieldRoutes API
      |
      v
Make (scheduled trigger — runs daily at 6am)
      |
      v
Google Sheets (one tab per data type)
      |
      v
Looker Studio (reads Sheets, renders dashboards)
      |
      v
Owner views dashboard in browser or phone
```

No servers. No code. No databases. Just three connected tools.

---

### What Data to Pull from FieldRoutes

Pull these endpoints daily. All are available in the FieldRoutes REST API (`https://api.fieldroutes.com`).

#### Priority 1 — Pull on Day 1

| Data | FieldRoutes Object | Key Fields |
|---|---|---|
| Jobs/Appointments | `Appointment` | appointmentID, date, status, employeeID, customerID, duration, serviceType |
| Revenue/Invoices | `Invoice` | invoiceID, customerID, date, amount, balance, status |
| Payments | `Payment` | paymentID, invoiceID, amount, date, method |
| Customers | `Customer` | customerID, name, address, zip, createdDate, status, source |
| Technicians | `Employee` | employeeID, name, active |

#### Priority 2 — Pull in Week 2

| Data | FieldRoutes Object | Key Fields |
|---|---|---|
| Subscriptions/Plans | `Subscription` | subscriptionID, customerID, frequency, serviceType, nextServiceDate |
| Service Routes | `Route` | routeID, date, employeeID, appointments |

---

### How to Pull Data (Step-by-Step, Make.com)

**One-time setup (do this once per data type):**

1. Log in to Make.com
2. Create a new Scenario
3. Add trigger: **Schedule** — set to daily at 6:00 AM
4. Add module: **HTTP → Make a Request**
   - URL: `https://api.fieldroutes.com/v1/appointments` (or relevant endpoint)
   - Method: `GET`
   - Headers: Add `authenticationKey` and `authenticationToken` as headers (pull from Make's credential vault — see Security section)
   - Params: Set `dateStart` and `dateEnd` to yesterday's date using Make's date functions
5. Add module: **Google Sheets → Add a Row**
   - Map each API field to a column
6. Save and activate

**Repeat for each data type (jobs, invoices, payments, customers).**

---

### Pull Frequency

| Data type | Frequency | Reason |
|---|---|---|
| Jobs / Appointments | Daily at 6am | Morning review ready by start of day |
| Invoices / Payments | Daily at 6am | Revenue tracking |
| Customers | Daily at 6am | New customer tracking |
| Technicians | Weekly | Rarely changes |
| Subscriptions | Daily | Service renewal tracking |

> **Do NOT pull in real-time** during the crawl phase. Daily batch is simpler, cheaper, and good enough.

---

### Google Sheets Structure

Create one Google Sheets workbook with these tabs:

| Tab Name | Contents |
|---|---|
| `raw_appointments` | All job records pulled daily |
| `raw_invoices` | All invoice records |
| `raw_payments` | All payment records |
| `raw_customers` | All customer records |
| `raw_employees` | Technician list |
| `dashboard_data` | Summary formulas (SUMIF, COUNTIF, PIVOT) used by Looker Studio |

Keep raw tabs untouched. Only write formulas in `dashboard_data`.

---

### 5–7 High-Value Dashboards (Crawl Phase)

Build these in Looker Studio. Each connects to one or more Sheets tabs.

---

#### Dashboard 1: Daily Revenue Snapshot
**What it shows:** Revenue collected today, this week, this month vs. same period last month
**Data source:** `raw_invoices` + `raw_payments`
**Key metrics:**
- Total revenue collected (by date)
- Revenue by service type
- Outstanding balances (invoiced but not paid)

---

#### Dashboard 2: Jobs Completed vs. Scheduled
**What it shows:** Are we hitting our daily/weekly job targets?
**Data source:** `raw_appointments`
**Key metrics:**
- Jobs scheduled today/this week
- Jobs completed vs. cancelled vs. no-show
- Completion rate % (completed / scheduled)

---

#### Dashboard 3: Technician Productivity
**What it shows:** Who is performing well? Who needs support?
**Data source:** `raw_appointments` joined with `raw_employees`
**Key metrics:**
- Jobs completed per technician (daily/weekly)
- Revenue generated per technician
- Cancellation rate per technician

---

#### Dashboard 4: Customer Retention & Repeat Visits
**What it shows:** Are customers coming back?
**Data source:** `raw_customers` + `raw_appointments`
**Key metrics:**
- New customers this month
- Customers with 2+ visits (repeat rate)
- Customers with active subscriptions
- Churn: customers with no appointment in 90+ days

---

#### Dashboard 5: Average Ticket Size
**What it shows:** How much are we earning per job?
**Data source:** `raw_invoices` + `raw_appointments`
**Key metrics:**
- Average invoice amount (all time, this month, by service type)
- Trend: is ticket size going up or down?
- Highest ticket service types

---

#### Dashboard 6: Outstanding Payments
**What it shows:** Who owes us money?
**Data source:** `raw_invoices`
**Key metrics:**
- Total accounts receivable
- Aging buckets: 0–30 days, 31–60 days, 60+ days overdue
- Top 10 customers by outstanding balance

---

#### Dashboard 7: Service Area Heat Map (Optional, Week 3)
**What it shows:** Where are our customers concentrated?
**Data source:** `raw_customers` (zip code field)
**Key metrics:**
- Customer count by zip code
- Revenue by zip code
- Use Looker Studio's geo chart (just needs a zip/address field)

---

## 2. Walk Phase (30–90 days)

**Goal:** Add CTM data, build lead-to-revenue funnel visibility.

---

### Adding CallTrackingMetrics (CTM)

CTM has a REST API. Use the same Make.com approach as FieldRoutes.

**Pull from CTM daily:**

| Data | CTM Object | Key Fields |
|---|---|---|
| Calls / Leads | `calls` | callID, date, duration, source, campaign, trackingNumber, callerPhone, status |
| Campaigns | `campaigns` | campaignID, name, source, trackingNumbers |

**Store in a new Sheets tab:** `raw_ctm_calls`

---

### Combining FieldRoutes + CTM

The join key is **phone number** or **customer name**.

In Google Sheets, add a formula column to `raw_customers`:
```
=VLOOKUP(phone_number, raw_ctm_calls, call_source_column, FALSE)
```

This tells you: "This customer first called us from Google Ads campaign X."

> This is marketing attribution. It doesn't need to be perfect in the walk phase — directionally correct is fine.

---

### Simple Data Model (No Jargon)

Think of it as three linked tables:

```
CTM Call (Lead)
    └── matched to → FieldRoutes Customer
                          └── has many → FieldRoutes Appointments
                                              └── generates → FieldRoutes Invoices
```

Each lead becomes a customer. Each customer generates jobs. Each job generates revenue.

---

### Funnel Dashboards (Walk Phase)

#### Dashboard 8: Lead-to-Booked Funnel
**Metrics:**
- Total inbound calls (from CTM)
- Calls answered vs. missed
- New bookings created (from FieldRoutes, same day/week as call)
- Booking conversion rate = new bookings / total calls

---

#### Dashboard 9: Marketing Attribution
**Metrics:**
- Revenue by lead source (Google Ads, organic, referral, direct)
- Cost per lead by source (manual input: paste your ad spend into a Sheets cell)
- Best-performing campaigns by booked revenue

---

#### Dashboard 10: Full Funnel (One Page)
```
Calls → Booked → Completed → Paid
  100 →   65   →    58     →  54
```
**Display as a funnel chart in Looker Studio.** Each number is a count. Drop-offs show where to focus.

---

### Data Reliability Improvements (Walk Phase)

- Add a "last refreshed" timestamp to every Sheets tab (Make can write this automatically)
- Add a row count check: if today's row count is less than yesterday's, send an email alert (Make can do this)
- Start a simple data dictionary: one Google Doc listing every field name and what it means
- Fix any fields with inconsistent values (e.g., "Google" vs "google ads" in source field) — standardize in a lookup table in Sheets

---

## 3. Run Phase (90+ days)

**Goal:** Move to a real data infrastructure when Sheets starts to break.

---

### When to Move to a Real Database

Move when **any** of these are true:
- Google Sheets has more than 100,000 rows and is getting slow
- You need to join more than 3 data sources
- You're spending more than 2 hours/week fixing data issues
- You want to add Zendesk, Verizon Connect, or Gmail data
- You want automated anomaly detection or forecasting

**Recommended next stack:**

| Layer | Tool | Cost |
|---|---|---|
| Storage | BigQuery (Google) | ~$0–5/month at this scale |
| Extraction | Fivetran or Airbyte | $50–200/month |
| Transformation | dbt (open source) | Free |
| Dashboard | Looker Studio or Metabase | Free–$500/month |

---

### When to Hire a Real Data Engineer

Hire when:
- You're spending more than $500/month on data tools and still have problems
- Your contractor is spending more than 10 hours/week on data maintenance
- You need real-time data (not daily batch)
- You want predictive models (churn, LTV, routing optimization)

Hire for part-time fractional work first (~10 hrs/week). This costs ~$3,000–6,000/month at a senior level.

---

### What to Automate vs. Keep Manual

| Keep Manual | Automate |
|---|---|
| Interpreting dashboards | Data extraction (batch jobs) |
| Business decisions | Alerting on anomalies |
| Ad spend input (short term) | Report distribution (email dashboards) |
| Data quality review | Schema validation |

---

### Optional Predictive Insights (Run Phase)

Once you have 6+ months of clean data:

| Insight | What it predicts | Tool |
|---|---|---|
| Customer LTV | Expected revenue from each customer over time | Python / BigQuery ML |
| Churn risk | Which customers haven't booked in a while and are likely to leave | BigQuery ML or Retool |
| Routing efficiency | Which routes are taking longest vs. shortest (requires Verizon Connect) | Custom Python |
| Demand forecasting | When to staff up based on seasonal patterns | Looker Studio trend lines (simple) |

---

## 4. Instructions for a Low-Tech Contractor

**Read this section carefully before starting any work.**

---

### Exact Tools to Use

1. **Make.com** (formerly Integromat) — for API connections and automation
   - Sign up at make.com
   - Use the paid "Core" plan (~$10/month) — you need more than 1,000 operations/month
2. **Google Sheets** — for data storage
   - Use a shared Google account (not a personal one)
3. **Looker Studio** — for dashboards
   - Free at lookerstudio.google.com
   - Log in with the same Google account as Sheets
4. **FieldRoutes API** — for data
   - Docs at: https://api.fieldroutes.com/index
   - You need: `authenticationKey` and `authenticationToken` (ask the business owner — do NOT store these in a spreadsheet)

---

### What NOT to Do

- **Do NOT** build a custom Python script unless you know Python well — Make.com does the same thing without code
- **Do NOT** store API keys in a Google Sheet, in a Make scenario description, or anywhere visible
- **Do NOT** pull all historical data at once on the first run — start with the last 30 days and add a date filter
- **Do NOT** build more than the dashboards listed in this plan — more dashboards = more maintenance
- **Do NOT** create multiple Sheets workbooks — keep everything in one
- **Do NOT** skip testing (see below)

---

### How to Test If Data Is Correct

Run these checks before calling it done:

1. **Row count check:** Pull 7 days of appointments from the API manually (use Postman or the API docs test tool). Count the rows. Does your Sheets tab have the same number?

2. **Revenue spot-check:** Look at yesterday's total revenue in your dashboard. Log into FieldRoutes and check the same number in their native reports. Do they match within $10?

3. **Date filter check:** Make sure your automation is only pulling yesterday's data, not all-time data. Check by looking at the date column in Sheets — all rows should have yesterday's date.

4. **Null check:** Are there rows with blank values in key fields (date, amount, customerID)? If yes, the API mapping is broken. Fix the Make module.

5. **Duplicate check:** Run `=COUNTIF(A:A, A2)` on the ID column. If any value returns > 1, you have duplicate rows. Add a deduplication step in Make.

---

### Expected Timeline

| Task | Estimated Hours |
|---|---|
| Set up Make.com + FieldRoutes API connection | 3–5 hours |
| Build Google Sheets structure (5 tabs) | 1–2 hours |
| Set up daily automation for 4 data types | 4–6 hours |
| Build 5 dashboards in Looker Studio | 6–10 hours |
| Testing and fixing errors | 3–5 hours |
| **Total** | **17–28 hours** |

At $25–50/hour contractor rate: **$425–$1,400 total**

---

### Estimated Cost Range (Monthly Ongoing)

| Tool | Monthly Cost |
|---|---|
| Make.com (Core plan) | $10 |
| Google Sheets / Looker Studio | $0 (free) |
| Contractor maintenance (2 hrs/month) | $50–$100 |
| **Total** | **~$60–$110/month** |

---

## 5. Security Note — Protecting API Keys

**This section is critical. Read it before giving any credentials to a contractor.**

---

### Why API Keys Must Not Be Exposed

Your FieldRoutes API key gives full access to your business data — customers, revenue, appointments, everything. If it leaks:
- Competitors or bad actors could read your customer list
- Someone could delete or modify your data
- FieldRoutes may suspend your account

**Never put API keys in:**
- A Google Sheet cell
- A Make scenario name or description
- An email or Slack message
- A GitHub or code repository
- A shared document

---

### Where to Store API Keys Safely

**Option A: Make.com Connections (Recommended for this stack)**
- In Make, use the built-in "Connections" or "Custom HTTP headers" with stored credentials
- Make encrypts these and does not expose them in the scenario view
- Go to: Make → Connections → Add → Custom → paste key there
- Reference the connection in your HTTP module — never paste the key directly into a URL or header field manually

**Option B: Environment Variables (if using Python/code)**
- Store in a `.env` file locally
- Never commit `.env` to git — add it to `.gitignore`
- Use `python-dotenv` to load them in your script

**Option C: Google Secret Manager (advanced)**
- Only needed if moving to the Run phase with cloud infrastructure

---

### Instructions for the Contractor

1. Ask the business owner to share API credentials via a **password manager** (1Password, Bitwarden) or a **one-time secret link** (onetimesecret.com)
2. Paste the credentials directly into Make's credential vault — do not write them down
3. Confirm with the owner after setup that the keys are not visible anywhere except Make's connections panel
4. If you accidentally expose a key (e.g., paste it somewhere wrong), tell the owner immediately so they can rotate it in FieldRoutes

---

*Document version: Crawl–Walk–Run v1.0 | Prepared for internal use*
