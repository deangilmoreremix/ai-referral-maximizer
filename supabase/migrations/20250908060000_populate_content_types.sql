/*
  # Populate Content Types Migration

  This migration populates the content_types table with comprehensive
  content type definitions for various business categories including
  consulting, agency, and general business use cases.

  Each content type includes:
  - Detailed prompt templates with personalization placeholders
  - Appropriate export options
  - Metadata for generation time and popularity
  - Support for multi-day content where applicable
*/

-- Insert consulting content types
INSERT INTO content_types (name, description, category, has_multiple_days, total_days, export_options, prompt_template, estimated_generation_time, popularity_score, is_active) VALUES
(
  'Business Development Strategy',
  'Comprehensive business development plan with market analysis, target identification, and growth strategies',
  'consulting',
  false,
  1,
  ARRAY['pdf', 'docx', 'pptx'],
  'Create a comprehensive business development strategy document for {business_name}, a {business_type} company specializing in {industry}. The strategy should include:

1. Executive Summary
2. Market Analysis & Competitive Landscape
3. Target Market Identification
4. Growth Objectives & KPIs
5. Strategic Initiatives & Action Plan
6. Resource Requirements
7. Timeline & Milestones
8. Risk Assessment & Mitigation
9. Success Metrics & Measurement

Key Focus Areas:
- Industry: {industry}
- Target Audience: {target_audience}
- Business Size: {business_size}
- Current Challenges: {challenges}
- Growth Goals: {growth_goals}

Ensure the strategy is actionable, measurable, and tailored to {business_name}''s specific market position and competitive advantages.',
  90,
  85,
  true
),
(
  'Client Acquisition Plan',
  'Strategic plan for acquiring new clients with outreach strategies, messaging, and conversion tactics',
  'consulting',
  true,
  30,
  ARRAY['pdf', 'docx', 'xlsx'],
  'Develop a 30-day client acquisition plan for {business_name} in the {industry} sector. The plan should include:

1. Target Client Profile Analysis
2. Outreach Strategy & Channels
3. Value Proposition Messaging
4. Content Marketing Plan
5. Networking & Partnership Opportunities
6. Lead Generation Tactics
7. Conversion Funnel Optimization
8. Follow-up & Nurturing Process
9. Budget & Resource Allocation
10. Success Metrics & Tracking

Client Profile Details:
- Industry: {industry}
- Company Size: {business_size}
- Pain Points: {client_pain_points}
- Decision Makers: {decision_makers}
- Budget Range: {budget_range}

Create specific, actionable steps for each day of the 30-day period, with clear deliverables and success criteria.',
  75,
  78,
  true
),
(
  'Consulting Proposal',
  'Professional consulting proposal with scope, deliverables, timeline, and pricing',
  'consulting',
  false,
  1,
  ARRAY['pdf', 'docx'],
  'Create a professional consulting proposal for {business_name} to present to {client_name}. The proposal should include:

1. Executive Summary
2. Client Situation Analysis
3. Proposed Solution & Approach
4. Scope of Work & Deliverables
5. Project Timeline & Milestones
6. Team & Expertise
7. Investment & Pricing Structure
8. Terms & Conditions
9. Next Steps

Project Details:
- Service Type: {service_type}
- Project Duration: {project_duration}
- Key Objectives: {project_objectives}
- Expected Outcomes: {expected_outcomes}
- Budget Range: {budget_range}

Make the proposal compelling, professional, and clearly demonstrate the value proposition for the client.',
  60,
  92,
  true
),
(
  'Industry Analysis Report',
  'Comprehensive industry analysis with market trends, competitive landscape, and strategic insights',
  'consulting',
  false,
  1,
  ARRAY['pdf', 'docx', 'pptx'],
  'Generate a comprehensive industry analysis report for the {industry} sector, focusing on {business_name}''s position and opportunities. Include:

1. Executive Summary
2. Industry Overview & Market Size
3. Key Market Trends & Drivers
4. Competitive Landscape Analysis
5. Technology & Innovation Trends
6. Regulatory Environment
7. Consumer Behavior Insights
8. Growth Opportunities & Threats
9. Strategic Recommendations
10. Data Sources & Methodology

Analysis Parameters:
- Time Period: {analysis_period}
- Geographic Focus: {geographic_focus}
- Key Competitors: {key_competitors}
- Emerging Trends: {emerging_trends}

Provide data-driven insights with actionable recommendations for {business_name}.',
  80,
  67,
  true
),
(
  'Client Onboarding Kit',
  'Complete onboarding package for new clients with welcome materials, processes, and resources',
  'consulting',
  false,
  1,
  ARRAY['pdf', 'docx', 'zip'],
  'Create a comprehensive client onboarding kit for {business_name} to use with new {client_type} clients. The kit should include:

1. Welcome Letter & Introduction
2. Client Profile & Needs Assessment
3. Service Overview & Expectations
4. Team Introduction & Contact Information
5. Project Timeline & Key Milestones
6. Communication Protocols
7. Resource Library & Templates
8. FAQ & Troubleshooting Guide
9. Success Metrics & KPIs
10. Next Steps & Check-in Schedule

Client Information:
- Client Type: {client_type}
- Industry: {industry}
- Project Scope: {project_scope}
- Key Contacts: {key_contacts}
- Onboarding Timeline: {onboarding_timeline}

Design the kit to be professional, comprehensive, and easy to customize for each client.',
  55,
  71,
  true
);

-- Insert agency content types
INSERT INTO content_types (name, description, category, has_multiple_days, total_days, export_options, prompt_template, estimated_generation_time, popularity_score, is_active) VALUES
(
  'Marketing Campaign Plan',
  'Complete marketing campaign strategy with objectives, tactics, timeline, and measurement',
  'agency',
  true,
  90,
  ARRAY['pdf', 'docx', 'pptx', 'xlsx'],
  'Develop a comprehensive 90-day marketing campaign plan for {client_name}''s {product_service}. The plan should include:

1. Campaign Overview & Objectives
2. Target Audience Analysis
3. Campaign Strategy & Key Messages
4. Channel Strategy & Tactics
5. Content Calendar & Assets
6. Budget Allocation & ROI Projections
7. Timeline & Implementation Schedule
8. Team Roles & Responsibilities
9. Measurement & Analytics Plan
10. Risk Assessment & Contingency Plans

Campaign Details:
- Product/Service: {product_service}
- Target Audience: {target_audience}
- Campaign Goals: {campaign_goals}
- Budget: {campaign_budget}
- Key Performance Indicators: {kpis}
- Brand Guidelines: {brand_guidelines}

Create a detailed day-by-day execution plan with specific deliverables and success metrics.',
  120,
  89,
  true
),
(
  'Social Media Strategy',
  'Strategic social media plan with content pillars, posting schedule, and engagement tactics',
  'agency',
  true,
  30,
  ARRAY['pdf', 'docx', 'pptx'],
  'Create a strategic social media plan for {client_name} across {platforms}. The strategy should include:

1. Social Media Audit & Current State Analysis
2. Target Audience & Platform Selection
3. Content Strategy & Content Pillars
4. Posting Schedule & Content Calendar
5. Engagement Strategy & Community Management
6. Influencer & Partnership Opportunities
7. Advertising Strategy & Budget Allocation
8. Measurement & Analytics Framework
9. Team Structure & Workflow
10. Risk Management & Crisis Communication

Strategy Parameters:
- Platforms: {platforms}
- Target Audience: {target_audience}
- Content Focus: {content_focus}
- Brand Voice: {brand_voice}
- Competitor Analysis: {competitor_analysis}
- Budget: {budget}

Provide specific content ideas, posting times, and engagement tactics for each platform.',
  85,
  94,
  true
),
(
  'Content Creation Brief',
  'Detailed content creation brief with objectives, target audience, key messages, and deliverables',
  'agency',
  false,
  1,
  ARRAY['pdf', 'docx'],
  'Generate a comprehensive content creation brief for {client_name}''s {content_type} project. The brief should include:

1. Project Overview & Objectives
2. Target Audience Profile
3. Key Messages & Value Proposition
4. Content Requirements & Specifications
5. Style Guide & Brand Guidelines
6. Technical Requirements & Formats
7. Timeline & Deliverables
8. Budget & Resources
9. Approval Process & Revisions
10. Success Metrics & KPIs

Content Details:
- Content Type: {content_type}
- Primary Goal: {primary_goal}
- Target Audience: {target_audience}
- Key Messages: {key_messages}
- Brand Voice: {brand_voice}
- Technical Specs: {technical_specs}
- Deadline: {deadline}

Ensure the brief is clear, actionable, and provides all necessary information for content creators.',
  45,
  76,
  true
),
(
  'Client Presentation Deck',
  'Professional presentation deck for client meetings with compelling visuals and strategic messaging',
  'agency',
  false,
  1,
  ARRAY['pdf', 'pptx', 'keynote'],
  'Create a professional presentation deck for {client_name}''s {presentation_type} meeting. The deck should include:

1. Title Slide & Agenda
2. Client Situation & Challenges
3. Our Understanding & Analysis
4. Proposed Solution & Strategy
5. Implementation Plan & Timeline
6. Expected Results & ROI
7. Team & Expertise
8. Next Steps & Call to Action
9. Q&A Preparation
10. Backup Slides & Data

Presentation Details:
- Presentation Type: {presentation_type}
- Meeting Objective: {meeting_objective}
- Key Challenges: {key_challenges}
- Proposed Solution: {proposed_solution}
- Timeline: {timeline}
- Budget: {budget}
- Decision Makers: {decision_makers}

Design the deck to be visually compelling, data-driven, and persuasive for the client''s decision-making process.',
  70,
  88,
  true
),
(
  'Brand Strategy Document',
  'Comprehensive brand strategy with positioning, messaging, and implementation guidelines',
  'agency',
  false,
  1,
  ARRAY['pdf', 'docx', 'pptx'],
  'Develop a comprehensive brand strategy document for {client_name}. The strategy should include:

1. Brand Audit & Current State Analysis
2. Target Audience Definition
3. Competitive Analysis & Positioning
4. Brand Personality & Voice
5. Core Values & Mission
6. Visual Identity Guidelines
7. Messaging Framework & Key Messages
8. Content Strategy & Pillars
9. Implementation Roadmap
10. Measurement & Success Metrics

Brand Strategy Elements:
- Industry: {industry}
- Target Audience: {target_audience}
- Current Brand Perception: {current_perception}
- Desired Brand Position: {desired_position}
- Key Competitors: {key_competitors}
- Brand Values: {brand_values}

Create a strategic document that provides clear direction for all brand communications and touchpoints.',
  95,
  82,
  true
);

-- Insert general business content types
INSERT INTO content_types (name, description, category, has_multiple_days, total_days, export_options, prompt_template, estimated_generation_time, popularity_score, is_active) VALUES
(
  'Sales Pitch Script',
  'Compelling sales pitch script with objection handling and closing techniques',
  'general_business',
  false,
  1,
  ARRAY['pdf', 'docx', 'txt'],
  'Create a compelling sales pitch script for {business_name}''s {product_service} targeted at {prospect_type}. The script should include:

1. Opening Hook & Rapport Building
2. Problem Identification & Pain Points
3. Solution Presentation & Value Proposition
4. Social Proof & Case Studies
5. Pricing & Investment Discussion
6. Objection Handling Responses
7. Call to Action & Closing
8. Follow-up Strategy
9. Alternative Closes
10. Practice Scenarios

Sales Script Details:
- Product/Service: {product_service}
- Prospect Type: {prospect_type}
- Key Benefits: {key_benefits}
- Price Point: {price_point}
- Common Objections: {common_objections}
- Unique Selling Points: {unique_selling_points}

Make the script conversational, persuasive, and adaptable to different prospect personalities and situations.',
  50,
  91,
  true
),
(
  'Networking Conversation Guide',
  'Structured guide for networking conversations with icebreakers, questions, and follow-up strategies',
  'general_business',
  false,
  1,
  ARRAY['pdf', 'docx'],
  'Develop a comprehensive networking conversation guide for {business_name} professionals attending {event_type}. The guide should include:

1. Pre-Event Preparation
2. Icebreakers & Opening Lines
3. Conversation Starters & Questions
4. Active Listening Techniques
5. Value Exchange Strategies
6. Business Card Exchange Protocol
7. Follow-up Email Templates
8. LinkedIn Connection Strategy
9. Common Networking Scenarios
10. Success Metrics & Tracking

Networking Details:
- Event Type: {event_type}
- Target Connections: {target_connections}
- Industry Focus: {industry_focus}
- Personal Elevator Pitch: {elevator_pitch}
- Key Value Propositions: {value_propositions}
- Follow-up Timeline: {follow_up_timeline}

Create a practical guide that helps professionals make meaningful connections and build long-term business relationships.',
  40,
  73,
  true
),
(
  'Follow-up Email Template',
  'Professional follow-up email templates for various business scenarios with personalization tips',
  'general_business',
  false,
  1,
  ARRAY['pdf', 'docx', 'txt'],
  'Create a set of professional follow-up email templates for {business_name} to use in {follow_up_context}. Include:

1. Initial Meeting Follow-up
2. Proposal Follow-up
3. Networking Event Follow-up
4. Sales Call Follow-up
5. Thank You & Appreciation
6. Re-engagement After Inactivity
7. Referral Request
8. Partnership Opportunity
9. Event Invitation Response
10. Feedback Request

Email Template Details:
- Follow-up Context: {follow_up_context}
- Industry: {industry}
- Relationship Stage: {relationship_stage}
- Key Objectives: {key_objectives}
- Personalization Elements: {personalization_elements}
- Call to Action: {call_to_action}

Provide multiple variations for each scenario with personalization tips and best practices for email etiquette.',
  35,
  86,
  true
),
(
  'Business Plan Outline',
  'Comprehensive business plan template with all essential sections and strategic guidance',
  'general_business',
  false,
  1,
  ARRAY['pdf', 'docx', 'pptx'],
  'Generate a comprehensive business plan outline for {business_name}, a {business_type} company in the {industry} sector. Include:

1. Executive Summary
2. Company Description & Mission
3. Market Analysis & Industry Overview
4. Organization & Management Structure
5. Products & Services
6. Marketing & Sales Strategy
7. Funding Request & Financial Projections
8. Operations Plan
9. Risk Analysis & Contingency Plans
10. Appendix & Supporting Documents

Business Plan Details:
- Business Type: {business_type}
- Industry: {industry}
- Target Market: {target_market}
- Competitive Advantages: {competitive_advantages}
- Financial Goals: {financial_goals}
- Growth Strategy: {growth_strategy}

Create a detailed outline with key questions to address in each section and strategic guidance for development.',
  100,
  79,
  true
),
(
  'Partnership Proposal',
  'Strategic partnership proposal with mutual benefits, terms, and implementation plan',
  'general_business',
  false,
  1,
  ARRAY['pdf', 'docx'],
  'Create a strategic partnership proposal for {business_name} to present to {partner_name}. The proposal should include:

1. Partnership Overview & Strategic Rationale
2. Mutual Benefits & Value Proposition
3. Partnership Objectives & Goals
4. Proposed Structure & Roles
5. Implementation Plan & Timeline
6. Resource Commitment & Investment
7. Success Metrics & KPIs
8. Risk Assessment & Mitigation
9. Legal & Operational Considerations
10. Next Steps & Decision Timeline

Partnership Details:
- Partner Name: {partner_name}
- Partnership Type: {partnership_type}
- Strategic Objectives: {strategic_objectives}
- Mutual Benefits: {mutual_benefits}
- Timeline: {timeline}
- Investment Required: {investment_required}
- Success Criteria: {success_criteria}

Develop a compelling case for partnership that clearly demonstrates value for both parties.',
  65,
  68,
  true
);