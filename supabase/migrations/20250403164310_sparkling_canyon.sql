/*
  # Additional views and functions

  1. Database Functions
    - `increment_revision_count` - Safely increment revision counter
    - `update_timestamp` - Update timestamp on row changes
  2. Views
    - `user_content_summary` - Aggregated view of user content
    - `recent_user_activity` - Recent activity for dashboard
*/

-- Create function to increment revision count
CREATE OR REPLACE FUNCTION increment_revision_count(row_id uuid) 
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT revision_count + 1 FROM generated_content WHERE id = row_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_content_types_timestamp
BEFORE UPDATE ON content_types
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_generated_content_timestamp
BEFORE UPDATE ON generated_content
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_personalization_settings_timestamp
BEFORE UPDATE ON personalization_settings
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_linkedin_profiles_timestamp
BEFORE UPDATE ON linkedin_profiles
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_user_preferences_timestamp
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Create user content summary view - fixed to avoid nested aggregates
CREATE OR REPLACE VIEW user_content_summary AS
SELECT 
  u.id AS user_id,
  u.email,
  COUNT(gc.id) AS total_content_count,
  COUNT(DISTINCT gc.content_type_id) AS unique_content_types_count,
  MAX(gc.created_at) AS last_generated_at,
  SUM(gc.revision_count) AS total_revisions
FROM 
  users u
LEFT JOIN generated_content gc ON u.id = gc.user_id
GROUP BY u.id, u.email;

-- Create content type usage view (separate to avoid nested aggregates)
CREATE OR REPLACE VIEW content_type_usage_summary AS
SELECT
  u.id AS user_id,
  ct.name AS content_type_name,
  COUNT(gc.id) AS usage_count
FROM
  users u
JOIN generated_content gc ON u.id = gc.user_id
JOIN content_types ct ON gc.content_type_id = ct.id
GROUP BY u.id, ct.name;

-- Create recent user activity view
CREATE OR REPLACE VIEW recent_user_activity AS
SELECT 
  u.id AS user_id,
  u.email,
  ul.action,
  ul.resource_type,
  ul.resource_id,
  ul.details,
  ul.created_at AS action_time
FROM 
  users u
JOIN usage_logs ul ON u.id = ul.user_id
ORDER BY ul.created_at DESC;

-- Create materialized view for popular content types
CREATE MATERIALIZED VIEW popular_content_types AS
SELECT 
  ct.id,
  ct.name,
  ct.category,
  COUNT(gc.id) AS usage_count,
  COUNT(DISTINCT gc.user_id) AS unique_users
FROM 
  content_types ct
LEFT JOIN generated_content gc ON ct.id = gc.content_type_id
GROUP BY ct.id, ct.name, ct.category
ORDER BY COUNT(gc.id) DESC;

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW popular_content_types;
END;
$$ LANGUAGE plpgsql;