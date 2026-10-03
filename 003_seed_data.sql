-- Demo/seed data for SafeAware — for development and BCA demonstration only.
-- No official phone numbers, laws, or statistics here are invented; emergency
-- numbers are the standard published India-wide helplines. Review and adapt
-- for your own jurisdiction before treating this as authoritative.

-- Campaigns -------------------------------------------------------------------
insert into campaigns (title, slug, description, category, topics, start_date, end_date, status) values
('Campus Safety Week', 'campus-safety-week',
 'A week of orientation sessions covering safe travel, emergency contacts, and how to report a concern on campus.',
 'Campus Safety', array['Safe travel','Emergency contacts','Reporting concerns','Anti-bullying awareness'],
 '2026-02-02', '2026-02-08', 'published'),
('Cyber Safety Awareness', 'cyber-safety-awareness',
 'Practical guidance on passwords, phishing, and account security.',
 'Cyber Safety', array['Strong passwords','Phishing','Social engineering','Account security'],
 '2026-02-15', '2026-02-22', 'published'),
('Road Safety Drive', 'road-safety-drive',
 'Helmet use, seat belts, and distracted-driving awareness ahead of the college commute season.',
 'Road Safety', array['Helmet use','Seat belts','Distracted driving','Pedestrian awareness'],
 '2026-03-01', '2026-03-07', 'published'),
('Public Safety Awareness', 'public-safety-awareness',
 'Situational awareness and safe-transport habits for students commuting through busy public spaces.',
 'Public Safety', array['Situational awareness','Safe transportation','Emergency planning'],
 '2026-03-15', '2026-03-21', 'draft'),
('Women''s Safety Orientation', 'womens-safety-orientation',
 'Sessions on personal safety habits, support helplines, and how to escalate a concern responsibly.',
 'Women''s Safety', array['Personal safety habits','Support helplines','Escalation process'],
 '2026-04-01', '2026-04-07', 'published')
on conflict (slug) do nothing;

-- Resources ---------------------------------------------------------------------
insert into resources (title, summary, content, category) values
('Five habits for safer commutes', 'Simple situational-awareness habits for walking or commuting alone.',
 'Share your live location with someone you trust, plan your route ahead of time, keep your phone charged, avoid poorly lit shortcuts, and trust your instincts if a situation feels wrong.',
 'Personal Safety'),
('Spotting a phishing message', 'Common signs that a message or email is trying to steal your information.',
 'Look out for urgent language, mismatched sender addresses, unexpected attachments, and links that do not match the organisation they claim to be from. When in doubt, contact the organisation directly.',
 'Cyber Safety'),
('Helmet and seatbelt basics', 'Why consistent helmet and seatbelt use matters, every single ride.',
 'Most two-wheeler injuries involve head trauma that a correctly fastened helmet meaningfully reduces. Make it a rule for every ride.',
 'Road Safety'),
('Building a strong password habit', 'Practical password hygiene that does not rely on memorising complexity.',
 'Use a unique passphrase per important account, turn on two-factor authentication wherever offered, and use a password manager.',
 'Digital Privacy'),
('What to do right after witnessing an incident', 'A short checklist for staying safe and helpful as a bystander.',
 'Prioritise your own safety first, call for appropriate help, avoid crowding the scene, and note details responders may ask for.',
 'Public Safety'),
('Preparing a basic emergency kit', 'A minimal home or hostel-room emergency kit anyone can put together.',
 'A flashlight, spare batteries, a printed list of emergency contacts, basic first-aid supplies, and copies of important documents.',
 'Emergency Preparedness'),
('Talking to someone about a safety concern', 'How to approach a friend if you are worried about their safety.',
 'Choose a private moment, listen without judgement, avoid pressuring them into a specific action, and share resources rather than ultimatums.',
 'Personal Safety'),
('Locking down your social accounts', 'A quick privacy pass for your most-used social platforms.',
 'Review who can see your posts and location tags, remove unused app permissions, and check login-alert settings.',
 'Digital Privacy'),
('Campus escort and buddy systems', 'Why a simple buddy system reduces risk on late-night campus walks.',
 'Where available, use a campus escort service or arrange a walking buddy for late hours, and share your expected arrival time.',
 'Campus Safety'),
('Recognising social engineering attempts', 'How attackers use trust and urgency rather than technical tricks.',
 'Be cautious of unsolicited calls or messages asking for OTPs, passwords, or urgent money transfers.',
 'Cyber Safety');

-- Legal resources -----------------------------------------------------------------
insert into legal_resources (title, topic, summary, general_information, official_source_url, jurisdiction, last_verified) values
('Reporting cybercrime: general process', 'Cybercrime awareness',
 'An overview of how cybercrime reports are generally handled in India.',
 'India operates a national cybercrime reporting portal alongside local police cybercrime cells. Reports typically require a description of the incident, relevant screenshots, and transaction details where financial fraud is involved.',
 'https://cybercrime.gov.in', 'India', '2026-01-01'),
('Workplace and campus harassment: reporting mechanisms', 'Harassment awareness',
 'General information about internal committees that handle harassment complaints.',
 'Educational institutions and workplaces in India are generally required to maintain an Internal Complaints Committee to receive and process harassment complaints.',
 'https://wcd.nic.in', 'India', '2026-01-01'),
('Consumer complaints: where to start', 'Consumer awareness',
 'A general starting point for unresolved consumer disputes.',
 'India''s National Consumer Helpline and consumer commissions provide channels for unresolved disputes with sellers or service providers.',
 'https://consumerhelpline.gov.in', 'India', '2026-01-01'),
('Recognising online financial fraud', 'Online fraud awareness',
 'General information on common online fraud patterns and where to report them.',
 'Common patterns include fake investment schemes, impersonation calls, and phishing links. Suspected financial cybercrime can generally be reported through the national cybercrime portal.',
 'https://cybercrime.gov.in', 'India', '2026-01-01'),
('Women''s safety: support and reporting resources', 'Women''s safety resources',
 'An overview of nationally available women''s safety helplines.',
 'India maintains a national women''s helpline alongside state-level resources intended to provide support and information about further steps.',
 'https://wcd.nic.in', 'India', '2026-01-01'),
('Child protection: reporting a concern', 'Child protection awareness',
 'General information about India''s child helpline system.',
 'India operates a national child helpline intended for children in distress and for adults reporting concerns about a child''s safety.',
 'https://wcd.nic.in', 'India', '2026-01-01');

-- Emergency contacts ------------------------------------------------------------
insert into emergency_contacts (name, description, phone, website, category, jurisdiction) values
('Police', 'For emergencies requiring police assistance.', '112', 'https://digitalpolice.gov.in', 'Police', 'India (national emergency number)'),
('Ambulance', 'Medical emergency response.', '108', null, 'Ambulance', 'India (widely used in most states)'),
('Fire', 'Fire emergency response.', '101', null, 'Fire', 'India'),
('Women''s Helpline', 'National helpline for women in distress.', '181', 'https://wcd.nic.in', 'Women''s Support', 'India (national)'),
('Child Helpline', 'National helpline for children in need of assistance or protection.', '1098', null, 'Child Support', 'India (national)'),
('Cybercrime Reporting', 'National portal and helpline for reporting cybercrime.', '1930', 'https://cybercrime.gov.in', 'Cybercrime Reporting', 'India (national)'),
('Disaster Management', 'National disaster response helpline.', '108', 'https://ndma.gov.in', 'Disaster/Emergency Services', 'India (national)');

-- Survey questions + options ----------------------------------------------------
do $$
declare
  q1 uuid; q2 uuid; q3 uuid; q4 uuid; q5 uuid; q6 uuid; q7 uuid; q8 uuid;
begin
  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('Which safety concerns do you encounter most often?', 'checkbox', true, 1) returning id into q1;
  insert into survey_options (question_id, label, order_index) values
    (q1, 'Cyber safety', 1), (q1, 'Campus safety', 2), (q1, 'Road safety', 3),
    (q1, 'Public-place safety', 4), (q1, 'Other', 5);

  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('Where do you feel least safe?', 'multiple_choice', true, 2) returning id into q2;
  insert into survey_options (question_id, label, order_index) values
    (q2, 'Commuting alone at night', 1), (q2, 'Crowded public places', 2),
    (q2, 'Online / on social media', 3), (q2, 'On campus after hours', 4);

  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('What time of day do you feel most concerned?', 'multiple_choice', false, 3) returning id into q3;
  insert into survey_options (question_id, label, order_index) values
    (q3, 'Early morning', 1), (q3, 'Afternoon', 2), (q3, 'Evening', 3), (q3, 'Late night', 4);

  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('Have you experienced or witnessed a safety incident in the last year?', 'yes_no', true, 4) returning id into q4;

  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('Which safety resources would be most useful to you?', 'checkbox', false, 5) returning id into q5;
  insert into survey_options (question_id, label, order_index) values
    (q5, 'Emergency contact directory', 1), (q5, 'Self-defense workshops', 2),
    (q5, 'Cyber safety guides', 3), (q5, 'Anonymous reporting', 4);

  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('How confident are you in responding to an emergency?', 'rating', true, 6) returning id into q6;

  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('How aware are you of local emergency resources?', 'rating', true, 7) returning id into q7;

  insert into survey_questions (prompt, question_type, is_required, order_index)
    values ('Which awareness topics should receive more attention?', 'text', false, 8) returning id into q8;
end $$;
