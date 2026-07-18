# Moenation Customer and Sales Analytics Data Plan

## Core identifiers
Every record should use internal identifiers: `visitor_id`, `lead_id`, `customer_id`, `project_id`, `estimate_id`, `invoice_id`, and `payment_id`.

## Lead fields
- name, email, phone, company
- customer_type
- requested_service
- project_zip and city
- budget_range and desired_start_date
- financing_interest
- first_touch_url, referrer, UTM parameters
- email_consent, sms_consent, analytics_consent, advertising_consent
- consent_timestamp and policy_version

## Funnel stages
`new_lead`, `contact_attempted`, `contacted`, `site_visit_scheduled`, `site_visit_completed`, `estimate_sent`, `estimate_viewed`, `estimate_accepted`, `deposit_paid`, `scheduled`, `in_progress`, `completed`, `final_payment_received`, `lost`, `cancelled`.

Capture a timestamp for each stage and a controlled lost reason.

## Recommended events
`page_view`, `service_page_view`, `quote_button_click`, `quote_form_started`, `quote_form_submitted`, `quote_form_abandoned`, `phone_click`, `email_click`, `financing_section_viewed`, `financing_button_clicked`, `lead_popup_viewed`, `lead_popup_dismissed`, `discount_form_submitted`, `payment_checkout_started`, `payment_completed`.

Do not send names, email addresses, phone numbers, full addresses, project descriptions, or payment credentials into advertising analytics.

## Project economics
Capture contract amount, change orders, discounts, labor hours and cost, equipment rental, fuel, disposal, materials, permits, subcontractors, processing fees, project duration, crew size, and rework.

## Stripe metadata
Attach the internal `customer_id`, `project_id`, `invoice_id`, and milestone name to Stripe objects. Stripe handles card and bank credentials; Moenation should not store them.

## Accounting integration
QuickBooks remains the accounting source of truth. Maintain mapping records between Moenation, Stripe, and QuickBooks identifiers.

## Data platform roadmap
1. Secure API Gateway and Lambda endpoints for forms and events.
2. Operational database for leads, customers, projects, consent, and payments.
3. Scheduled exports to Amazon S3.
4. AWS Glue catalog and Athena or Redshift reporting.
5. QuickSight or Power BI dashboards.

## Initial KPIs
Lead volume, qualified-lead rate, response time, estimate rate, estimate acceptance, lead-to-customer conversion, sales-cycle length, average project value, revenue by service, gross margin by service, outstanding balance, financing usage, repeat-customer rate, source attribution, and campaign return.
